from typing import List

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from auth import require_role
from database import get_db
from models import ComputeGPU, Job, User
from schemas import GPUOut, JobOut

router = APIRouter(prefix="/compute", tags=["Compute"])


@router.get("/my-gpus", response_model=List[GPUOut])
def list_my_compute_gpus(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role("customer")),
):
    return (
        db.query(ComputeGPU)
        .filter(ComputeGPU.renter_id == current_user.id)
        .all()
    )


@router.get("/my-jobs", response_model=List[JobOut])
def list_my_jobs(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role("customer")),
):
    return (
        db.query(Job)
        .filter(Job.user_id == current_user.id)
        .order_by(Job.submitted_at.desc())
        .all()
    )
