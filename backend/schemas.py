from pydantic import BaseModel, EmailStr
from datetime import date, datetime
from typing import Optional, List
from models import AttendanceStatus

# Shared Properties
class EmployeeBase(BaseModel):
    full_name: str
    email: EmailStr
    department: str

# Employee (Incoming Data)
class EmployeeCreate(EmployeeBase):
    pass

# Employee (Outgoing Data)
class EmployeeResponse(EmployeeBase):
    id: int
    created_at: datetime
    present_days: Optional[int] = 0

    class Config:
        from_attributes = True 

# Attendance Schemas
class AttendanceBase(BaseModel):
    employee_id: int
    date: date
    status: AttendanceStatus

class AttendanceCreate(AttendanceBase):
    pass

class AttendanceResponse(AttendanceBase):
    id: int
    employee_name: Optional[str] = None 

    class Config:
        from_attributes = True