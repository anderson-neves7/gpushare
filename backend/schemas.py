from datetime import datetime
from typing import Optional

from pydantic import BaseModel, EmailStr


class UserBase(BaseModel):
    email: EmailStr
    role: str


class UserCreate(UserBase):
    password: str


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserOut(UserBase):
    id: int
    created_at: datetime

    model_config = {"from_attributes": True}


class GPUCreate(BaseModel):
    model: str
    vram: int


class GPUOut(BaseModel):
    id: int
    name: str
    vram_gb: int
    provider_id: int
    renter_id: Optional[int] = None
    status: str

    class Config:
        orm_mode = True


class RentalRequestCreate(BaseModel):
    gpu_id: int


class RentalOut(BaseModel):
    id: int
    gpu_id: int
    provider_id: int
    customer_id: int

    status: str

    requested_at: datetime
    approved_at: Optional[datetime] = None
    started_at: Optional[datetime] = None
    ended_at: Optional[datetime] = None

    termination_requested_at: Optional[datetime] = None
    grace_period_minutes: int

    class Config:
        orm_mode = True


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"


class TokenData(BaseModel):
    user_id: Optional[int] = None
    role: Optional[str] = None


class JobOut(BaseModel):
    id: int
    type: str
    gpu_id: Optional[int]
    status: str
    result: Optional[str]
    submitted_at: datetime
    completed_at: Optional[datetime]

    class Config:
        orm_mode = True
