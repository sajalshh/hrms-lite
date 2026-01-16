from sqlalchemy.orm import Session
from sqlalchemy import func
from datetime import date 
import models, schemas
from fastapi import HTTPException

def get_employee_by_email(db: Session, email: str):
    return db.query(models.Employee).filter(models.Employee.email == email).first()

def create_employee(db: Session, employee: schemas.EmployeeCreate):
    if get_employee_by_email(db, employee.email):
        raise HTTPException(status_code=400, detail="Email already registered")
    
    employee_data = employee.model_dump()
    if employee_data.get("department"):
        employee_data["department"] = employee_data["department"].lower()
    db_employee = models.Employee(**employee_data)
    
    db.add(db_employee)
    db.commit()
    db.refresh(db_employee)
    return db_employee

def get_employees(db: Session, skip: int = 0, limit: int = 100):
    employees = db.query(models.Employee).offset(skip).limit(limit).all()
    
    for emp in employees:
        emp.present_days = db.query(models.Attendance).filter(
            models.Attendance.employee_id == emp.id,
            models.Attendance.status == models.AttendanceStatus.PRESENT
        ).count()
        
    return employees

def delete_employee(db: Session, employee_id: int):
    employee = db.query(models.Employee).filter(models.Employee.id == employee_id).first()
    if not employee:
        raise HTTPException(status_code=404, detail="Employee not found")
    
    db.delete(employee)
    db.commit()
    return {"detail": "Employee deleted"}


def create_attendance(db: Session, attendance: schemas.AttendanceCreate):
    employee = db.query(models.Employee).filter(models.Employee.id == attendance.employee_id).first()
    if not employee:
        raise HTTPException(status_code=404, detail="Employee not found")

    existing_record = db.query(models.Attendance).filter(
        models.Attendance.employee_id == attendance.employee_id,
        models.Attendance.date == attendance.date
    ).first()

    if existing_record:
        raise HTTPException(status_code=400, detail="Attendance already marked for this date")

    db_attendance = models.Attendance(**attendance.model_dump())
    db.add(db_attendance)
    db.commit()
    db.refresh(db_attendance)
    return db_attendance

def get_attendance(db: Session, date_filter: date = None):
    query = db.query(models.Attendance)
    if date_filter:
        query = query.filter(models.Attendance.date == date_filter)
    
    results = query.all()

    for record in results:
        record.employee_name = record.employee.full_name if record.employee else "Unknown"
        
    return results

def get_stats(db: Session):
    total_employees = db.query(models.Employee).count()
    today = date.today()
    
    present_today = db.query(models.Attendance).filter(
        models.Attendance.date == today,
        models.Attendance.status == models.AttendanceStatus.PRESENT
    ).count()

    absent_today = db.query(models.Attendance).filter(
        models.Attendance.date == today,
        models.Attendance.status == models.AttendanceStatus.ABSENT
    ).count()

    dept_counts = db.query(
        models.Employee.department, func.count(models.Employee.id)
    ).group_by(models.Employee.department).all()

    department_stats = {dept: count for dept, count in dept_counts if dept}
    recent_activity = db.query(models.Attendance).order_by(
        models.Attendance.id.desc()
    ).limit(5).all()

    recent_logs = []
    for log in recent_activity:
        recent_logs.append({
            "name": log.employee.full_name if log.employee else "Unknown",
            "status": log.status,
            "date": log.date,
            "time": "Just now"
        })

    return {
        "total_employees": total_employees,
        "present_today": present_today,
        "absent_today": absent_today,
        "department_stats": department_stats,
        "recent_activity": recent_logs
    }