"""
HRMS Flask API — main application entry-point.
Registers all module blueprints and starts the dev server.
"""

from flask import Flask, jsonify, make_response
from flask_cors import CORS

# ── Organisation module ──────────────────────────────────
from routes.organization import (
    companies_bp, branches_bp, departments_bp,
    designations_bp, employment_types_bp, work_locations_bp, shifts_bp,
)

# ── Employee core module ─────────────────────────────────
from routes.employee import (
    employees_bp, personal_details_bp, contacts_bp,
    addresses_bp, documents_bp, bank_details_bp,
    salary_structure_bp, status_history_bp,
)

# ── Attendance & Leave module ────────────────────────────
from routes.attendance import (
    attendance_bp, attendance_logs_bp, leave_types_bp,
    leave_balances_bp, leave_requests_bp, leave_approvals_bp, holidays_bp,
)

# ── Payroll module ───────────────────────────────────────
from routes.payroll import (
    payroll_cycles_bp, payroll_runs_bp, payslips_bp,
    salary_components_bp, payroll_details_bp, bonuses_bp,
    reimbursements_bp, tax_declarations_bp, tax_deductions_bp,
)

# ── Performance module ───────────────────────────────────
from routes.performance import (
    performance_cycles_bp, goals_bp, reviews_bp,
    ratings_bp, feedback_bp,
)

# ── Recruitment module ───────────────────────────────────
from routes.recruitment import (
    job_openings_bp, candidates_bp, applications_bp,
    interviews_bp, offers_bp,
)

# ── Training, Assets & Access module ─────────────────────
from routes.training_assets_access import (
    training_programs_bp, enrollments_bp, certifications_bp,
    assets_bp, asset_allocations_bp, system_roles_bp,
    permissions_bp, role_permissions_bp, user_accounts_bp,
)

# ── Authentication module ────────────────────────────────
from routes.auth import auth_bp

from swagger import get_openapi_spec


SWAGGER_UI_HTML = """
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>HRMS API — Swagger UI</title>
    <link rel="stylesheet" href="https://unpkg.com/swagger-ui-dist@5/swagger-ui.css" />
    <style>
        html { box-sizing: border-box; overflow-y: scroll; }
        *, *::before, *::after { box-sizing: inherit; }
        body { margin: 0; background: #fafafa; }
    </style>
</head>
<body>
    <div id="swagger-ui"></div>
    <script src="https://unpkg.com/swagger-ui-dist@5/swagger-ui-bundle.js"></script>
    <script src="https://unpkg.com/swagger-ui-dist@5/swagger-ui-standalone-preset.js"></script>
    <script>
        SwaggerUIBundle({
            url: "/swagger.json",
            dom_id: "#swagger-ui",
            presets: [SwaggerUIBundle.presets.apis, SwaggerUIStandalonePreset],
            layout: "StandaloneLayout",
            deepLinking: true,
        });
    </script>
</body>
</html>
"""


def create_app() -> Flask:
    app = Flask(__name__)
    CORS(app)

    # ── Register blueprints ──────────────────────────────
    blueprints = [
        # Organisation
        companies_bp, branches_bp, departments_bp,
        designations_bp, employment_types_bp, work_locations_bp, shifts_bp,
        # Employee core
        employees_bp, personal_details_bp, contacts_bp,
        addresses_bp, documents_bp, bank_details_bp,
        salary_structure_bp, status_history_bp,
        # Attendance & Leave
        attendance_bp, attendance_logs_bp, leave_types_bp,
        leave_balances_bp, leave_requests_bp, leave_approvals_bp, holidays_bp,
        # Payroll
        payroll_cycles_bp, payroll_runs_bp, payslips_bp,
        salary_components_bp, payroll_details_bp, bonuses_bp,
        reimbursements_bp, tax_declarations_bp, tax_deductions_bp,
        # Performance
        performance_cycles_bp, goals_bp, reviews_bp,
        ratings_bp, feedback_bp,
        # Recruitment
        job_openings_bp, candidates_bp, applications_bp,
        interviews_bp, offers_bp,
        # Training, Assets & Access
        training_programs_bp, enrollments_bp, certifications_bp,
        assets_bp, asset_allocations_bp, system_roles_bp,
        permissions_bp, role_permissions_bp, user_accounts_bp,
        # Auth
        auth_bp,
    ]

    for bp in blueprints:
        app.register_blueprint(bp)

    # ── Health-check ─────────────────────────────────────
    @app.route("/")
    def index():
        return jsonify({"status": "ok", "message": "HRMS API is running"}), 200

    # ── Swagger UI & OpenAPI spec ────────────────────────
    @app.route("/docs")
    def docs():
        resp = make_response(SWAGGER_UI_HTML)
        resp.headers["Content-Type"] = "text/html"
        return resp

    @app.route("/swagger.json")
    def swagger_json():
        return jsonify(get_openapi_spec())

    # ── Generic error handlers ───────────────────────────
    @app.errorhandler(404)
    def not_found(e):
        return jsonify({"error": "Resource not found"}), 404

    @app.errorhandler(500)
    def server_error(e):
        return jsonify({"error": "Internal server error"}), 500

    return app


if __name__ == "__main__":
    app = create_app()
    app.run(debug=True, port=5000)
