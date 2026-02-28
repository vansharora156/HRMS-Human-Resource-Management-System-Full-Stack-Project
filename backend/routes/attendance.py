"""
Attendance & Leave module blueprints.
Tables: attendance, attendance_logs, leave_types, leave_balances,
        leave_requests, leave_approvals, holidays
"""

from utils import crud_blueprint

attendance_bp = crud_blueprint(
    table_name="attendance",
    primary_key="attendance_id",
    bp_name="attendance",
    url_prefix="/api/attendance",
)

attendance_logs_bp = crud_blueprint(
    table_name="attendance_logs",
    primary_key="log_id",
    bp_name="attendance_logs",
    url_prefix="/api/attendance-logs",
)

leave_types_bp = crud_blueprint(
    table_name="leave_types",
    primary_key="leave_type_id",
    bp_name="leave_types",
    url_prefix="/api/leave-types",
)

leave_balances_bp = crud_blueprint(
    table_name="leave_balances",
    primary_key="balance_id",
    bp_name="leave_balances",
    url_prefix="/api/leave-balances",
)

leave_requests_bp = crud_blueprint(
    table_name="leave_requests",
    primary_key="request_id",
    bp_name="leave_requests",
    url_prefix="/api/leave-requests",
)

leave_approvals_bp = crud_blueprint(
    table_name="leave_approvals",
    primary_key="approval_id",
    bp_name="leave_approvals",
    url_prefix="/api/leave-approvals",
)

holidays_bp = crud_blueprint(
    table_name="holidays",
    primary_key="holiday_id",
    bp_name="holidays",
    url_prefix="/api/holidays",
)
