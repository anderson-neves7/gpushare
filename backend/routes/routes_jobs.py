from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session
import json

from redis_client import redis_client
from auth import require_role
from database import get_db
from models import ComputeGPU, User, Job

router = APIRouter(prefix="/jobs", tags=["Jobs"])


class JobRequest(BaseModel):
    type: str = "cpu"
    code: str
    gpu_id: int | None = None


@router.post("/submit_job")
def submit_job(
    job: JobRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role("customer")),
):
    # -----------------------------
    # GPU JOB VALIDATION
    # -----------------------------
    gpu_id = None

    if job.type == "gpu":
        if job.gpu_id is None:
            raise HTTPException(status_code=400, detail="gpu_id is required for GPU jobs.")

        compute_gpu = db.query(ComputeGPU).filter(ComputeGPU.id == job.gpu_id).first()
        if not compute_gpu:
            raise HTTPException(status_code=404, detail="Compute GPU not found.")

        # Customer must have an active rental for this GPU
        if compute_gpu.renter_id != current_user.id:
            raise HTTPException(
                status_code=403,
                detail="You do not have access to this GPU. Rent it first.",
            )

        gpu_id = compute_gpu.id

    elif job.type != "cpu":
        raise HTTPException(status_code=400, detail="Invalid job type. Use 'cpu' or 'gpu'.")

    # -----------------------------
    # CREATE JOB IN DATABASE
    # -----------------------------
    db_job = Job(
        user_id=current_user.id,
        type=job.type,
        gpu_id=gpu_id,
        code=job.code,
        status="queued",
    )

    db.add(db_job)
    db.commit()
    db.refresh(db_job)

    # -----------------------------
    # BUILD REDIS PAYLOAD
    # -----------------------------
    job_payload = {
        "job_id": db_job.id,
        "type": db_job.type,
        "gpu_id": db_job.gpu_id,
        "code": db_job.code,
        "user_id": db_job.user_id,
    }

    # -----------------------------
    # ROUTE TO CORRECT QUEUE
    # -----------------------------
    if job.type == "cpu":
        redis_client.rpush("job_queue", json.dumps(job_payload))
    else:
        redis_client.rpush("gpu_job_queue", json.dumps(job_payload))

    redis_client.hset(f"job:{db_job.id}", "status", "queued")

    return {"job_id": db_job.id, "status": "queued"}


@router.get("/job_result/{job_id}")
def job_result(job_id: int, db: Session = Depends(get_db)):
    db_job = db.query(Job).filter(Job.id == job_id).first()
    if not db_job:
        return {"status": "unknown", "result": None}

    status_val = redis_client.hget(f"job:{job_id}", "status")
    result_val = redis_client.hget(f"job:{job_id}", "result")

    status_str = status_val.decode() if status_val else db_job.status
    result_str = result_val.decode() if result_val else db_job.result

    return {
        "job_id": db_job.id,
        "status": status_str,
        "result": result_str,
    }
