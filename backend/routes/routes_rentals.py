from typing import List
from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from auth import require_role
from database import get_db
from models import User, ComputeGPU, Rental
from schemas import RentalRequestCreate, RentalOut

router = APIRouter(prefix="/rentals", tags=["Rentals"])


@router.post("/request", response_model=RentalOut)
def request_rental(
    rental_in: RentalRequestCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role("customer")),
):
    gpu = db.query(ComputeGPU).filter(ComputeGPU.id == rental_in.gpu_id).first()
    if not gpu:
        raise HTTPException(status_code=404, detail="GPU not found.")

    if gpu.status != "available":
        raise HTTPException(status_code=400, detail="GPU is not available for rent.")

    rental = Rental(
        gpu_id=gpu.id,
        provider_id=gpu.provider_id,
        customer_id=current_user.id,
        status="pending",
    )

    db.add(rental)
    db.commit()
    db.refresh(rental)

    return rental


@router.get("/my-requests", response_model=List[RentalOut])
def list_my_requests(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role("provider")),
):
    return (
        db.query(Rental)
        .filter(Rental.provider_id == current_user.id)
        .order_by(Rental.requested_at.desc())
        .all()
    )


@router.get("/my-rentals", response_model=List[RentalOut])
def list_my_rentals(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role("customer")),
):
    return (
        db.query(Rental)
        .filter(Rental.customer_id == current_user.id)
        .order_by(Rental.requested_at.desc())
        .all()
    )


@router.post("/{rental_id}/approve", response_model=RentalOut)
def approve_rental(
    rental_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role("provider")),
):
    rental = db.query(Rental).filter(Rental.id == rental_id).first()
    if not rental:
        raise HTTPException(status_code=404, detail="Rental not found.")

    if rental.provider_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not your rental request.")

    if rental.status != "pending":
        raise HTTPException(status_code=400, detail="Rental is not pending.")

    gpu = db.query(ComputeGPU).filter(ComputeGPU.id == rental.gpu_id).first()
    if not gpu:
        raise HTTPException(status_code=404, detail="GPU not found.")

    if gpu.status != "available":
        raise HTTPException(status_code=400, detail="GPU is not available.")

    now = datetime.utcnow()
    rental.status = "active"
    rental.approved_at = now
    rental.started_at = now

    gpu.status = "rented"
    gpu.renter_id = rental.customer_id

    db.commit()
    db.refresh(rental)
    return rental


@router.post("/{rental_id}/reject", response_model=RentalOut)
def reject_rental(
    rental_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role("provider")),
):
    rental = db.query(Rental).filter(Rental.id == rental_id).first()
    if not rental:
        raise HTTPException(status_code=404, detail="Rental not found.")

    if rental.provider_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not your rental request.")

    if rental.status != "pending":
        raise HTTPException(status_code=400, detail="Rental is not pending.")

    rental.status = "rejected"
    db.commit()
    db.refresh(rental)
    return rental


@router.post("/{rental_id}/end", response_model=RentalOut)
def end_rental(
    rental_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role("customer")),
):
    rental = db.query(Rental).filter(Rental.id == rental_id).first()
    if not rental:
        raise HTTPException(status_code=404, detail="Rental not found.")

    if rental.customer_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not your rental.")

    if rental.status not in ("active", "termination_pending"):
        raise HTTPException(status_code=400, detail="Rental is not active.")

    rental.status = "completed"
    rental.ended_at = datetime.utcnow()

    gpu = db.query(ComputeGPU).filter(ComputeGPU.id == rental.gpu_id).first()
    if gpu:
        gpu.status = "available"
        gpu.renter_id = None

    db.commit()
    db.refresh(rental)
    return rental


@router.post("/{rental_id}/force-end", response_model=RentalOut)
def force_end_rental(
    rental_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role("provider")),
):
    rental = db.query(Rental).filter(Rental.id == rental_id).first()
    if not rental:
        raise HTTPException(status_code=404, detail="Rental not found.")

    if rental.provider_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not your rental.")

    if rental.status != "active":
        raise HTTPException(status_code=400, detail="Rental is not active.")

    rental.status = "termination_pending"
    rental.termination_requested_at = datetime.utcnow()

    db.commit()
    db.refresh(rental)
    return rental
