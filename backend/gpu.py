from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from pydantic import BaseModel

from database import get_db
from models import ComputeGPU as GPUModel

router = APIRouter(prefix="/compute-gpus", tags=["Compute GPUs"])


class GPU(BaseModel):
    name: str
    specs: str
    rate: float


@router.post("/", response_model=dict)
def create_gpu(gpu: GPU, db: Session = Depends(get_db)):
    gpu_obj = GPUModel(
        name=gpu.name,
        specs=gpu.specs,
        rate=gpu.rate,
        status="available",
    )
    db.add(gpu_obj)
    db.commit()
    db.refresh(gpu_obj)
    return {
        "id": gpu_obj.id,
        "name": gpu_obj.name,
        "specs": gpu_obj.specs,
        "rate": gpu_obj.rate,
        "status": gpu_obj.status,
    }


@router.get("/", response_model=list[dict])
def list_gpus(db: Session = Depends(get_db)):
    gpus = db.query(GPUModel).all()
    return [
        {
            "id": g.id,
            "name": g.name,
            "specs": g.specs,
            "rate": g.rate,
            "status": g.status,
        }
        for g in gpus
    ]


def get_available_gpu(db: Session):
    return db.query(GPUModel).filter(GPUModel.status == "available").first()
