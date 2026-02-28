"""
Auto-generated OpenAPI 3.0 specification for the HRMS API.
"""


def get_openapi_spec() -> dict:
    """Return a complete OpenAPI 3.0 spec covering every HRMS table."""

    # ── Table definitions: (table, pk, url_prefix, tag, columns) ─────
    tables = [
        # Organisation
        ("companies",        "company_id",    "/api/companies",        "Organization",
         {"company_id": "integer", "name": "string", "registration_no": "string", "timezone": "string", "created_at": "string"}),
        ("branches",         "branch_id",     "/api/branches",         "Organization",
         {"branch_id": "integer", "company_id": "integer", "name": "string", "location": "string"}),
        ("departments",      "dept_id",       "/api/departments",      "Organization",
         {"dept_id": "integer", "branch_id": "integer", "name": "string"}),
        ("designations",     "designation_id","/api/designations",     "Organization",
         {"designation_id": "integer", "title": "string", "level": "integer", "grade": "string"}),
        ("employment_types", "emp_type_id",   "/api/employment-types", "Organization",
         {"emp_type_id": "integer", "type_name": "string"}),
        ("work_locations",   "location_id",   "/api/work-locations",   "Organization",
         {"location_id": "integer", "location_type": "string"}),
        ("shifts",           "shift_id",      "/api/shifts",           "Organization",
         {"shift_id": "integer", "start_time": "string", "end_time": "string"}),

        # Employee Core
        ("employees",                 "emp_id",    "/api/employees",                 "Employee Core",
         {"emp_id": "integer", "company_id": "integer", "dept_id": "integer", "designation_id": "integer",
          "emp_type_id": "integer", "manager_id": "integer", "join_date": "string", "status": "string"}),
        ("employee_personal_details", "emp_id",    "/api/employee-personal-details", "Employee Core",
         {"emp_id": "integer", "dob": "string", "gender": "string", "marital_status": "string"}),
        ("employee_contacts",         "contact_id","/api/employee-contacts",         "Employee Core",
         {"contact_id": "integer", "emp_id": "integer", "phone": "string", "email": "string"}),
        ("employee_addresses",        "address_id","/api/employee-addresses",        "Employee Core",
         {"address_id": "integer", "emp_id": "integer", "address_type": "string", "address": "string"}),
        ("employee_documents",        "doc_id",    "/api/employee-documents",        "Employee Core",
         {"doc_id": "integer", "emp_id": "integer", "doc_type": "string", "file_path": "string"}),
        ("employee_bank_details",     "bank_id",   "/api/employee-bank-details",     "Employee Core",
         {"bank_id": "integer", "emp_id": "integer", "account_no": "string", "ifsc": "string"}),
        ("employee_salary_structure", "salary_id", "/api/employee-salary-structure", "Employee Core",
         {"salary_id": "integer", "emp_id": "integer", "basic": "number", "hra": "number", "allowances": "number"}),
        ("employee_status_history",   "status_id", "/api/employee-status-history",   "Employee Core",
         {"status_id": "integer", "emp_id": "integer", "status": "string", "changed_at": "string"}),

        # Attendance & Leave
        ("attendance",      "attendance_id", "/api/attendance",      "Attendance & Leave",
         {"attendance_id": "integer", "emp_id": "integer", "attendance_date": "string", "check_in": "string", "check_out": "string"}),
        ("attendance_logs", "log_id",        "/api/attendance-logs", "Attendance & Leave",
         {"log_id": "integer", "emp_id": "integer", "log_time": "string"}),
        ("leave_types",     "leave_type_id", "/api/leave-types",     "Attendance & Leave",
         {"leave_type_id": "integer", "name": "string"}),
        ("leave_balances",  "balance_id",    "/api/leave-balances",  "Attendance & Leave",
         {"balance_id": "integer", "emp_id": "integer", "leave_type_id": "integer", "balance": "integer"}),
        ("leave_requests",  "request_id",    "/api/leave-requests",  "Attendance & Leave",
         {"request_id": "integer", "emp_id": "integer", "leave_type_id": "integer", "from_date": "string", "to_date": "string", "status": "string"}),
        ("leave_approvals", "approval_id",   "/api/leave-approvals", "Attendance & Leave",
         {"approval_id": "integer", "request_id": "integer", "manager_id": "integer", "approved_at": "string"}),
        ("holidays",        "holiday_id",    "/api/holidays",        "Attendance & Leave",
         {"holiday_id": "integer", "company_id": "integer", "holiday_date": "string", "name": "string"}),

        # Payroll
        ("payroll_cycles",   "cycle_id",     "/api/payroll-cycles",   "Payroll",
         {"cycle_id": "integer", "month": "integer", "year": "integer"}),
        ("payroll_runs",     "run_id",       "/api/payroll-runs",     "Payroll",
         {"run_id": "integer", "cycle_id": "integer", "processed_at": "string"}),
        ("payslips",         "payslip_id",   "/api/payslips",         "Payroll",
         {"payslip_id": "integer", "emp_id": "integer", "run_id": "integer"}),
        ("salary_components","component_id", "/api/salary-components","Payroll",
         {"component_id": "integer", "name": "string", "type": "string"}),
        ("payroll_details",  "detail_id",    "/api/payroll-details",  "Payroll",
         {"detail_id": "integer", "payslip_id": "integer", "component_id": "integer", "amount": "number"}),
        ("bonuses",          "bonus_id",     "/api/bonuses",          "Payroll",
         {"bonus_id": "integer", "emp_id": "integer", "amount": "number", "bonus_date": "string"}),
        ("reimbursements",   "reimb_id",     "/api/reimbursements",   "Payroll",
         {"reimb_id": "integer", "emp_id": "integer", "amount": "number", "status": "string"}),
        ("tax_declarations", "tax_id",       "/api/tax-declarations", "Payroll",
         {"tax_id": "integer", "emp_id": "integer", "financial_year": "string"}),
        ("tax_deductions",   "deduction_id", "/api/tax-deductions",   "Payroll",
         {"deduction_id": "integer", "emp_id": "integer", "amount": "number"}),

        # Performance
        ("performance_cycles","cycle_id",    "/api/performance-cycles","Performance",
         {"cycle_id": "integer", "year": "integer"}),
        ("goals",            "goal_id",      "/api/goals",            "Performance",
         {"goal_id": "integer", "emp_id": "integer", "description": "string"}),
        ("reviews",          "review_id",    "/api/reviews",          "Performance",
         {"review_id": "integer", "emp_id": "integer", "cycle_id": "integer"}),
        ("ratings",          "rating_id",    "/api/ratings",          "Performance",
         {"rating_id": "integer", "review_id": "integer", "score": "integer"}),
        ("feedback",         "feedback_id",  "/api/feedback",         "Performance",
         {"feedback_id": "integer", "from_emp": "integer", "to_emp": "integer", "comments": "string"}),

        # Recruitment
        ("job_openings",  "job_id",         "/api/job-openings",  "Recruitment",
         {"job_id": "integer", "dept_id": "integer", "title": "string"}),
        ("candidates",    "candidate_id",   "/api/candidates",    "Recruitment",
         {"candidate_id": "integer", "name": "string", "email": "string"}),
        ("applications",  "application_id", "/api/applications",  "Recruitment",
         {"application_id": "integer", "candidate_id": "integer", "job_id": "integer", "status": "string"}),
        ("interviews",    "interview_id",   "/api/interviews",    "Recruitment",
         {"interview_id": "integer", "application_id": "integer", "interview_date": "string", "result": "string"}),
        ("offers",        "offer_id",       "/api/offers",        "Recruitment",
         {"offer_id": "integer", "application_id": "integer", "salary": "number", "status": "string"}),

        # Training, Assets & Access
        ("training_programs","training_id",  "/api/training-programs","Training, Assets & Access",
         {"training_id": "integer", "title": "string"}),
        ("enrollments",     "enrollment_id", "/api/enrollments",     "Training, Assets & Access",
         {"enrollment_id": "integer", "emp_id": "integer", "training_id": "integer"}),
        ("certifications",  "cert_id",       "/api/certifications",  "Training, Assets & Access",
         {"cert_id": "integer", "emp_id": "integer", "name": "string"}),
        ("assets",          "asset_id",      "/api/assets",          "Training, Assets & Access",
         {"asset_id": "integer", "name": "string"}),
        ("asset_allocations","allocation_id","/api/asset-allocations","Training, Assets & Access",
         {"allocation_id": "integer", "emp_id": "integer", "asset_id": "integer", "allocated_at": "string"}),
        ("system_roles",    "role_id",       "/api/system-roles",    "Training, Assets & Access",
         {"role_id": "integer", "role_name": "string"}),
        ("permissions",     "permission_id", "/api/permissions",     "Training, Assets & Access",
         {"permission_id": "integer", "permission_name": "string"}),
        ("user_accounts",   "user_id",       "/api/user-accounts",   "Training, Assets & Access",
         {"user_id": "integer", "emp_id": "integer", "role_id": "integer", "username": "string", "password_hash": "string"}),
    ]

    paths = {}
    schemas = {}

    for table_name, pk, prefix, tag, columns in tables:
        # ── Schema ───────────────────────────────────────
        schema_name = table_name.title().replace("_", "")
        properties = {}
        for col, col_type in columns.items():
            properties[col] = {"type": col_type}
        schemas[schema_name] = {
            "type": "object",
            "properties": properties,
        }

        # ── Paths ────────────────────────────────────────
        # Collection path: GET (list) + POST (create)
        paths[prefix] = {
            "get": {
                "tags": [tag],
                "summary": f"List all {table_name}",
                "description": f"Retrieve all rows from `{table_name}`. Supports query-string equality filters, e.g. `?{pk}=1`.",
                "parameters": [
                    {"name": col, "in": "query", "required": False, "schema": {"type": col_type}, "description": f"Filter by {col}"}
                    for col, col_type in columns.items()
                ],
                "responses": {
                    "200": {
                        "description": "Successful response",
                        "content": {"application/json": {"schema": {"type": "array", "items": {"$ref": f"#/components/schemas/{schema_name}"}}}},
                    },
                    "500": {"description": "Server error"},
                },
            },
            "post": {
                "tags": [tag],
                "summary": f"Create a new {table_name} record",
                "requestBody": {
                    "required": True,
                    "content": {"application/json": {"schema": {"$ref": f"#/components/schemas/{schema_name}"}}},
                },
                "responses": {
                    "201": {"description": "Created"},
                    "500": {"description": "Server error"},
                },
            },
        }

        # Item path: GET (one) + PUT (update) + DELETE
        item_path = f"{prefix}/{{{pk}}}"
        paths[item_path] = {
            "get": {
                "tags": [tag],
                "summary": f"Get a single {table_name} record",
                "parameters": [{"name": pk, "in": "path", "required": True, "schema": {"type": "integer"}}],
                "responses": {
                    "200": {"description": "Successful response", "content": {"application/json": {"schema": {"$ref": f"#/components/schemas/{schema_name}"}}}},
                    "404": {"description": "Not found"},
                    "500": {"description": "Server error"},
                },
            },
            "put": {
                "tags": [tag],
                "summary": f"Update a {table_name} record",
                "parameters": [{"name": pk, "in": "path", "required": True, "schema": {"type": "integer"}}],
                "requestBody": {
                    "required": True,
                    "content": {"application/json": {"schema": {"$ref": f"#/components/schemas/{schema_name}"}}},
                },
                "responses": {
                    "200": {"description": "Updated"},
                    "404": {"description": "Not found"},
                    "500": {"description": "Server error"},
                },
            },
            "delete": {
                "tags": [tag],
                "summary": f"Delete a {table_name} record",
                "parameters": [{"name": pk, "in": "path", "required": True, "schema": {"type": "integer"}}],
                "responses": {
                    "200": {"description": "Deleted"},
                    "500": {"description": "Server error"},
                },
            },
        }

    # ── role_permissions (composite key) ─────────────────
    rp_tag = "Training, Assets & Access"
    schemas["RolePermissions"] = {
        "type": "object",
        "properties": {
            "role_id":       {"type": "integer"},
            "permission_id": {"type": "integer"},
        },
    }
    paths["/api/role-permissions"] = {
        "get": {
            "tags": [rp_tag],
            "summary": "List all role-permission mappings",
            "parameters": [
                {"name": "role_id",       "in": "query", "required": False, "schema": {"type": "integer"}},
                {"name": "permission_id", "in": "query", "required": False, "schema": {"type": "integer"}},
            ],
            "responses": {"200": {"description": "Successful response"}, "500": {"description": "Server error"}},
        },
        "post": {
            "tags": [rp_tag],
            "summary": "Create a role-permission mapping",
            "requestBody": {"required": True, "content": {"application/json": {"schema": {"$ref": "#/components/schemas/RolePermissions"}}}},
            "responses": {"201": {"description": "Created"}, "500": {"description": "Server error"}},
        },
    }
    paths["/api/role-permissions/{role_id}/{permission_id}"] = {
        "delete": {
            "tags": [rp_tag],
            "summary": "Delete a role-permission mapping",
            "parameters": [
                {"name": "role_id",       "in": "path", "required": True, "schema": {"type": "integer"}},
                {"name": "permission_id", "in": "path", "required": True, "schema": {"type": "integer"}},
            ],
            "responses": {"200": {"description": "Deleted"}, "500": {"description": "Server error"}},
        },
    }

    return {
        "openapi": "3.0.3",
        "info": {
            "title": "HRMS API",
            "description": "Full CRUD REST API for the Human Resource Management System backed by Supabase.",
            "version": "1.0.0",
        },
        "servers": [{"url": "http://127.0.0.1:5000", "description": "Local dev server"}],
        "tags": [
            {"name": "Organization"},
            {"name": "Employee Core"},
            {"name": "Attendance & Leave"},
            {"name": "Payroll"},
            {"name": "Performance"},
            {"name": "Recruitment"},
            {"name": "Training, Assets & Access"},
        ],
        "paths": paths,
        "components": {"schemas": schemas},
    }
