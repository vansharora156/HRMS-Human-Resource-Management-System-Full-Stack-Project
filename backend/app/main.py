import logging
from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.routers import employees, attendance, leave, dashboard, recruitment, performance, finance, payroll, auth
from app.routers import assets

# Configure Logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="HRMS API", version="1.0.0")

# Global Exception Handler
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.error(f"Global exception: {exc}", exc_info=True)
    return JSONResponse(
        status_code=500,
        content={"message": "Internal Server Error", "detail": str(exc)},
    )

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Dedicated Routers ---
app.include_router(auth.router) # /api/auth
app.include_router(employees.router, prefix="/api/employees")
app.include_router(attendance.router, prefix="/api/attendance")
app.include_router(leave.router, prefix="/api/leave")
app.include_router(dashboard.router, prefix="/api/dashboard")
app.include_router(recruitment.router, prefix="/api/recruitment")
app.include_router(performance.router, prefix="/api/performance")
app.include_router(finance.router, prefix="/api/finance")
app.include_router(payroll.router, prefix="/api/payroll")
app.include_router(assets.router, prefix="/api/assets")

from app.crud import create_crud_router

# --- Flat CRUD Routers (matching table names in frontend CrudPage) ---

# Core flat access
app.include_router(create_crud_router("employees", pk="emp_id", prefix="/api/employees"), tags=["Flat CRUD"])
app.include_router(create_crud_router("attendance", pk="attendance_id", prefix="/api/attendance"), tags=["Flat CRUD"])

# Employee Module
app.include_router(create_crud_router("personal_details", pk="emp_id", prefix="/api/employee-personal-details"))
app.include_router(create_crud_router("contacts", pk="contact_id", prefix="/api/employee-contacts"))
app.include_router(create_crud_router("addresses", pk="address_id", prefix="/api/employee-addresses"))
app.include_router(create_crud_router("documents", pk="doc_id", prefix="/api/employee-documents"))
app.include_router(create_crud_router("bank_details", pk="bank_id", prefix="/api/employee-bank-details"))
app.include_router(create_crud_router("salary_structure", pk="salary_id", prefix="/api/employee-salary-structure"))
app.include_router(create_crud_router("status_history", pk="status_id", prefix="/api/employee-status-history"))

# Organization Module
app.include_router(create_crud_router("companies", pk="company_id", prefix="/api/companies"))
app.include_router(create_crud_router("branches", pk="branch_id", prefix="/api/branches"))
app.include_router(create_crud_router("departments", pk="dept_id", prefix="/api/departments"))
app.include_router(create_crud_router("designations", pk="designation_id", prefix="/api/designations"))
app.include_router(create_crud_router("employment_types", pk="emp_type_id", prefix="/api/employment-types"))
app.include_router(create_crud_router("work_locations", pk="location_id", prefix="/api/work-locations"))
app.include_router(create_crud_router("shifts", pk="shift_id", prefix="/api/shifts"))

# Attendance & Leave Module
app.include_router(create_crud_router("attendance_logs", pk="log_id", prefix="/api/attendance-logs"))
app.include_router(create_crud_router("leave_types", pk="leave_type_id", prefix="/api/leave-types"))
app.include_router(create_crud_router("leave_balances", pk="balance_id", prefix="/api/leave-balances"))
app.include_router(create_crud_router("leave_requests", pk="request_id", prefix="/api/leave-requests"))
app.include_router(create_crud_router("leave_approvals", pk="approval_id", prefix="/api/leave-approvals"))
app.include_router(create_crud_router("holidays", pk="holiday_id", prefix="/api/holidays"))

# Recruitment Module
app.include_router(create_crud_router("job_openings", pk="job_id", prefix="/api/job-openings"))
app.include_router(create_crud_router("candidates", pk="candidate_id", prefix="/api/candidates"))
app.include_router(create_crud_router("applications", pk="application_id", prefix="/api/applications"))
app.include_router(create_crud_router("interviews", pk="interview_id", prefix="/api/interviews"))
app.include_router(create_crud_router("offers", pk="offer_id", prefix="/api/offers"))

# Performance & Finance Module
app.include_router(create_crud_router("performance_cycles", pk="cycle_id", prefix="/api/performance-cycles"))
app.include_router(create_crud_router("goals", pk="goal_id", prefix="/api/goals"))
app.include_router(create_crud_router("reviews", pk="review_id", prefix="/api/reviews"))
app.include_router(create_crud_router("expenses", pk="id", prefix="/api/expenses"))

# Training & Assets
app.include_router(create_crud_router("training_programs", pk="training_id", prefix="/api/training-programs"))
app.include_router(create_crud_router("enrollments", pk="enrollment_id", prefix="/api/enrollments"))
app.include_router(create_crud_router("certifications", pk="cert_id", prefix="/api/certifications"))
app.include_router(create_crud_router("asset_allocations", pk="allocation_id", prefix="/api/asset-allocations"))

# Access & Roles
app.include_router(create_crud_router("system_roles", pk="role_id", prefix="/api/system-roles"))
app.include_router(create_crud_router("permissions", pk="permission_id", prefix="/api/permissions"))
app.include_router(create_crud_router("role_permissions", pk="role_id", prefix="/api/role-permissions"))
app.include_router(create_crud_router("user_accounts", pk="user_id", prefix="/api/user-accounts"))


@app.get("/")
def read_root():
    return {"message": "Welcome to HRMS API", "status": "active"}

@app.get("/health")
def health_check():
    return {"status": "healthy"}
