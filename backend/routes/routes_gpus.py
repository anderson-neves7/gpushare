from typing import List

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from auth import require_role
from database import get_db
from models import User, ComputeGPU
from schemas import GPUCreate, GPUOut

router = APIRouter(prefix="/gpus", tags=["GPUs"])


def calculate_price_per_hour(vram_gb: int) -> int:
    """
    Automatic pricing based on VRAM (full dollar amounts only):

    - ≤ 6 GB   -> $1/hr
    - 7–12 GB  -> $2/hr
    - 13–24 GB -> $3/hr
    - 25+ GB   -> $4/hr
    """
    if vram_gb <= 6:
        return 1
    elif vram_gb <= 12:
        return 2
    elif vram_gb <= 24:
        return 3
    else:
        return 4


@router.post("/", response_model=GPUOut)
def create_gpu(
    gpu_in: GPUCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role("provider")),
):
    price = calculate_price_per_hour(gpu_in.vram)

    gpu = ComputeGPU(
        provider_id=current_user.id,
        renter_id=None,
        name=gpu_in.model,
        vram_gb=gpu_in.vram,
        price_per_hour=price,
        status="available",
    )

    db.add(gpu)
    db.commit()
    db.refresh(gpu)

    return gpu


@router.get("/", response_model=List[GPUOut])
def list_gpus(db: Session = Depends(get_db)):
    return db.query(ComputeGPU).all()


@router.get("/mine", response_model=List[GPUOut])
def list_my_gpus(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role("provider")),
):
    return (
        db.query(ComputeGPU)
        .filter(ComputeGPU.provider_id == current_user.id)
        .all()
    )


@router.delete("/{gpu_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_gpu(
    gpu_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role("provider")),
):
    gpu = db.query(ComputeGPU).filter(ComputeGPU.id == gpu_id).first()
    if not gpu:
        raise HTTPException(status_code=404, detail="GPU not found.")

    if gpu.provider_id != current_user.id and current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Not allowed to delete this GPU.")

    if gpu.status == "rented":
        raise HTTPException(
            status_code=400,
            detail="Cannot delete a GPU that is currently rented.",
        )

    db.delete(gpu)
    db.commit()
    return
