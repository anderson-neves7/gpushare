from datetime import datetime, timedelta

from sqlalchemy import (
    Column,
    Integer,
    String,
    ForeignKey,
    DateTime,
    Text,
)
from sqlalchemy.orm import relationship

from database import Base


# ============================================================
# USER
# ============================================================

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    role = Column(String, nullable=False)
    created_at = DateTime = Column(DateTime, default=datetime.utcnow, nullable=False)

    compute_gpus = relationship(
        "ComputeGPU",
        back_populates="provider",
        foreign_keys="ComputeGPU.provider_id",
    )

    rented_gpus = relationship(
        "ComputeGPU",
        back_populates="renter",
        foreign_keys="ComputeGPU.renter_id",
    )

    rentals_as_provider = relationship(
        "Rental",
        back_populates="provider",
        foreign_keys="Rental.provider_id",
    )

    rentals_as_customer = relationship(
        "Rental",
        back_populates="customer",
        foreign_keys="Rental.customer_id",
    )


# ============================================================
# GPU (ComputeGPU)
# ============================================================

class ComputeGPU(Base):
    __tablename__ = "gpus"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    vram_gb = Column(Integer, nullable=False)

    # NEW: automatic pricing based on VRAM (full dollar amounts)
    price_per_hour = Column(Integer, nullable=False)

    provider_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    renter_id = Column(Integer, ForeignKey("users.id"), nullable=True)

    status = Column(String, default="available", nullable=False)

    provider = relationship(
        "User",
        back_populates="compute_gpus",
        foreign_keys=[provider_id],
    )

    renter = relationship(
        "User",
        back_populates="rented_gpus",
        foreign_keys=[renter_id],
    )

    # One GPU -> many rentals
    rentals = relationship(
        "Rental",
        back_populates="gpu",
        foreign_keys="Rental.gpu_id",
    )

    jobs = relationship("Job", back_populates="gpu")


# ============================================================
# RENTAL
# ============================================================

class Rental(Base):
    __tablename__ = "rentals"

    id = Column(Integer, primary_key=True, index=True)

    gpu_id = Column(Integer, ForeignKey("gpus.id"), nullable=False)
    provider_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    customer_id = Column(Integer, ForeignKey("users.id"), nullable=False)

    status = Column(String, default="pending", nullable=False)

    requested_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    approved_at = Column(DateTime, nullable=True)
    started_at = Column(DateTime, nullable=True)
    ended_at = Column(DateTime, nullable=True)

    termination_requested_at = Column(DateTime, nullable=True)
    grace_period_minutes = Column(Integer, default=30, nullable=False)

    gpu = relationship(
        "ComputeGPU",
        back_populates="rentals",
        foreign_keys=[gpu_id],
    )

    provider = relationship(
        "User",
        back_populates="rentals_as_provider",
        foreign_keys=[provider_id],
    )

    customer = relationship(
        "User",
        back_populates="rentals_as_customer",
        foreign_keys=[customer_id],
    )

    def is_within_grace_period(self) -> bool:
        if not self.termination_requested_at:
            return False
        return datetime.utcnow() < (
            self.termination_requested_at + timedelta(minutes=self.grace_period_minutes)
        )


# ============================================================
# JOB
# ============================================================

class Job(Base):
    __tablename__ = "jobs"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    type = Column(String, nullable=False)
    gpu_id = Column(Integer, ForeignKey("gpus.id"), nullable=True)
    code = Column(Text, nullable=False)
    status = Column(String, default="queued")
    result = Column(Text, nullable=True)
    submitted_at = Column(DateTime, default=datetime.utcnow)
    completed_at = Column(DateTime, nullable=True)

    user = relationship("User")
    gpu = relationship("ComputeGPU", back_populates="jobs")
