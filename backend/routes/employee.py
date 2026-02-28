"""
Employee core module blueprints.
Tables: employees, employee_personal_details, employee_contacts,
        employee_addresses, employee_documents, employee_bank_details,
        employee_salary_structure, employee_status_history
"""

from utils import crud_blueprint

employees_bp = crud_blueprint(
    table_name="employees",
    primary_key="emp_id",
    bp_name="employees",
    url_prefix="/api/employees",
)

personal_details_bp = crud_blueprint(
    table_name="employee_personal_details",
    primary_key="emp_id",
    bp_name="employee_personal_details",
    url_prefix="/api/employee-personal-details",
)

contacts_bp = crud_blueprint(
    table_name="employee_contacts",
    primary_key="contact_id",
    bp_name="employee_contacts",
    url_prefix="/api/employee-contacts",
)

addresses_bp = crud_blueprint(
    table_name="employee_addresses",
    primary_key="address_id",
    bp_name="employee_addresses",
    url_prefix="/api/employee-addresses",
)

documents_bp = crud_blueprint(
    table_name="employee_documents",
    primary_key="doc_id",
    bp_name="employee_documents",
    url_prefix="/api/employee-documents",
)

bank_details_bp = crud_blueprint(
    table_name="employee_bank_details",
    primary_key="bank_id",
    bp_name="employee_bank_details",
    url_prefix="/api/employee-bank-details",
)

salary_structure_bp = crud_blueprint(
    table_name="employee_salary_structure",
    primary_key="salary_id",
    bp_name="employee_salary_structure",
    url_prefix="/api/employee-salary-structure",
)

status_history_bp = crud_blueprint(
    table_name="employee_status_history",
    primary_key="status_id",
    bp_name="employee_status_history",
    url_prefix="/api/employee-status-history",
)
