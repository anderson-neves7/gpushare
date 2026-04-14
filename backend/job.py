from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy import asc
from sqlalchemy.orm import Session

from database import get_db
from models import Job as JobModel, ComputeGPU as GPUModel
from gpu import get_available_gpu

router = APIRouter(prefix="/queue", tags=["Job Queue"])


class Job(BaseModel):
    name: str
    input_data: str


def shift_queue_positions(db: Session):
    queued_jobs = (
        db.query(JobModel)
        .filter(JobModel.queue_position.isnot(None))
        .order_by(asc(JobModel.queue_position))
        .all()
    )

    for i, job in enumerate(queued_jobs):
        job.queue_position = i + 1

    db.commit()


def start_next_job_if_possible(db: Session):
    gpu = get_available_gpu(db)
    if not gpu:
        return None

    next_job = (
        db.query(JobModel)
        .filter(JobModel.queue_position.isnot(None))
        .order_by(asc(JobModel.queue_position))
        .first()
    )

    if not next_job:
        return None

    next_job.gpu_id = gpu.id
    next_job.status = "running"
    next_job.queue_position = None
    next_job.start_time = datetime.utcnow()
    gpu.status = "busy"

    db.commit()
    shift_queue_positions(db)

    return next_job


@router.post("/job")
def create_job(job: Job, db: Session = Depends(get_db)):
    gpu = get_available_gpu(db)

    if gpu:
        job_obj = JobModel(
            name=job.name,
            input_data=job.input_data,
            status="running",
            gpu_id=gpu.id,
            queue_position=None,
            start_time=datetime.utcnow(),
        )
        gpu.status = "busy"
    else:
        last_position = (
            db.query(JobModel)
            .filter(JobModel.queue_position.isnot(None))
            .count()
        )

        job_obj = JobModel(
            name=job.name,
            input_data=job.input_data,
            status="pending",
            gpu_id=None,
            queue_position=last_position + 1,
        )

    db.add(job_obj)
    db.commit()
    db.refresh(job_obj)

    return job_obj


@router.get("/job")
def list_jobs(db: Session = Depends(get_db)):
    running_and_done = (
        db.query(JobModel)
        .filter(JobModel.queue_position.is_(None))
        .all()
    )

    queued = (
        db.query(JobModel)
        .filter(JobModel.queue_position.isnot(None))
        .order_by(asc(JobModel.queue_position))
        .all()
    )

    return {
        "running_or_completed": running_and_done,
        "queued": queued,
    }


def finish_job(job_id: int, new_status: str, db: Session):
    job = db.query(JobModel).filter(JobModel.id == job_id).first()
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")

    job.status = new_status
    job.end_time = datetime.utcnow()

    if job.start_time and job.gpu_id:
        gpu = db.query(GPUModel).filter(GPUModel.id == job.gpu_id).first()
        if gpu:
            duration_hours = (job.end_time - job.start_time).total_seconds() / 3600
            job.cost = duration_hours * gpu.rate
            gpu.status = "available"

    job.gpu_id = None
    db.commit()

    start_next_job_if_possible(db)
    return job


@router.post("/job/{job_id}/complete")
def complete_job(job_id: int, db: Session = Depends(get_db)):
    return finish_job(job_id, "completed", db)


@router.post("/job/{job_id}/fail")
def fail_job(job_id: int, db: Session = Depends(get_db)):
    return finish_job(job_id, "failed", db)


@router.post("/job/{job_id}/cancel")
def cancel_job(job_id: int, db: Session = Depends(get_db)):
    job = db.query(JobModel).filter(JobModel.id == job_id).first()
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")

    if job.queue_position is not None:
        job.queue_position = None
        db.commit()
        shift_queue_positions(db)
        return job

    return finish_job(job_id, "cancelled", db)
