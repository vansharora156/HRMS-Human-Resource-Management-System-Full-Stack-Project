"""
Organisation module blueprints.
Tables: companies, branches, departments, designations,
        employment_types, work_locations, shifts
"""

from utils import crud_blueprint

companies_bp = crud_blueprint(
    table_name="companies",
    primary_key="company_id",
    bp_name="companies",
    url_prefix="/api/companies",
)

branches_bp = crud_blueprint(
    table_name="branches",
    primary_key="branch_id",
    bp_name="branches",
    url_prefix="/api/branches",
)

departments_bp = crud_blueprint(
    table_name="departments",
    primary_key="dept_id",
    bp_name="departments",
    url_prefix="/api/departments",
)

designations_bp = crud_blueprint(
    table_name="designations",
    primary_key="designation_id",
    bp_name="designations",
    url_prefix="/api/designations",
)

employment_types_bp = crud_blueprint(
    table_name="employment_types",
    primary_key="emp_type_id",
    bp_name="employment_types",
    url_prefix="/api/employment-types",
)

work_locations_bp = crud_blueprint(
    table_name="work_locations",
    primary_key="location_id",
    bp_name="work_locations",
    url_prefix="/api/work-locations",
)

shifts_bp = crud_blueprint(
    table_name="shifts",
    primary_key="shift_id",
    bp_name="shifts",
    url_prefix="/api/shifts",
)
