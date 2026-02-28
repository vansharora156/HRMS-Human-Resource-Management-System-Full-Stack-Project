"""
Payroll module blueprints.
Tables: payroll_cycles, payroll_runs, payslips, salary_components,
        payroll_details, bonuses, reimbursements, tax_declarations,
        tax_deductions
"""

from utils import crud_blueprint

payroll_cycles_bp = crud_blueprint(
    table_name="payroll_cycles",
    primary_key="cycle_id",
    bp_name="payroll_cycles",
    url_prefix="/api/payroll-cycles",
)

payroll_runs_bp = crud_blueprint(
    table_name="payroll_runs",
    primary_key="run_id",
    bp_name="payroll_runs",
    url_prefix="/api/payroll-runs",
)

payslips_bp = crud_blueprint(
    table_name="payslips",
    primary_key="payslip_id",
    bp_name="payslips",
    url_prefix="/api/payslips",
)

salary_components_bp = crud_blueprint(
    table_name="salary_components",
    primary_key="component_id",
    bp_name="salary_components",
    url_prefix="/api/salary-components",
)

payroll_details_bp = crud_blueprint(
    table_name="payroll_details",
    primary_key="detail_id",
    bp_name="payroll_details",
    url_prefix="/api/payroll-details",
)

bonuses_bp = crud_blueprint(
    table_name="bonuses",
    primary_key="bonus_id",
    bp_name="bonuses",
    url_prefix="/api/bonuses",
)

reimbursements_bp = crud_blueprint(
    table_name="reimbursements",
    primary_key="reimb_id",
    bp_name="reimbursements",
    url_prefix="/api/reimbursements",
)

tax_declarations_bp = crud_blueprint(
    table_name="tax_declarations",
    primary_key="tax_id",
    bp_name="tax_declarations",
    url_prefix="/api/tax-declarations",
)

tax_deductions_bp = crud_blueprint(
    table_name="tax_deductions",
    primary_key="deduction_id",
    bp_name="tax_deductions",
    url_prefix="/api/tax-deductions",
)
