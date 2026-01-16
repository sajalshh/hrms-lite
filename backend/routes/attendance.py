from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import date
import schemas, crud
from database import get_db

# router instance
router = APIRouter(
    prefix="/attendance",
    tags=["Attendance"]
)

@router.post("/", response_model=schemas.AttendanceResponse, status_code=status.HTTP_201_CREATED)
def mark_attendance(attendance: schemas.AttendanceCreate, db: Session = Depends(get_db)):
    return crud.create_attendance(db=db, attendance=attendance)

@router.get("/stats")
def get_dashboard_stats(db: Session = Depends(get_db)):
    return crud.get_stats(db)

@router.get("/", response_model=List[schemas.AttendanceResponse])
def read_attendance(date: Optional[date] = None, db: Session = Depends(get_db)):
    return crud.get_attendance(db, date_filter=date)

