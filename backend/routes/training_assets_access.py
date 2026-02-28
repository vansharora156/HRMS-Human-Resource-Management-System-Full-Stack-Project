"""
Training, Assets & Access module blueprints.
Tables: training_programs, enrollments, certifications, assets,
        asset_allocations, system_roles, permissions,
        role_permissions (composite PK), user_accounts
"""

from flask import Blueprint, request, jsonify
from config import supabase
from utils import crud_blueprint

# ── Standard CRUD tables ─────────────────────────────────

training_programs_bp = crud_blueprint(
    table_name="training_programs",
    primary_key="training_id",
    bp_name="training_programs",
    url_prefix="/api/training-programs",
)

enrollments_bp = crud_blueprint(
    table_name="enrollments",
    primary_key="enrollment_id",
    bp_name="enrollments",
    url_prefix="/api/enrollments",
)

certifications_bp = crud_blueprint(
    table_name="certifications",
    primary_key="cert_id",
    bp_name="certifications",
    url_prefix="/api/certifications",
)

assets_bp = crud_blueprint(
    table_name="assets",
    primary_key="asset_id",
    bp_name="assets",
    url_prefix="/api/assets",
)

asset_allocations_bp = crud_blueprint(
    table_name="asset_allocations",
    primary_key="allocation_id",
    bp_name="asset_allocations",
    url_prefix="/api/asset-allocations",
)

system_roles_bp = crud_blueprint(
    table_name="system_roles",
    primary_key="role_id",
    bp_name="system_roles",
    url_prefix="/api/system-roles",
)

permissions_bp = crud_blueprint(
    table_name="permissions",
    primary_key="permission_id",
    bp_name="permissions",
    url_prefix="/api/permissions",
)

user_accounts_bp = crud_blueprint(
    table_name="user_accounts",
    primary_key="user_id",
    bp_name="user_accounts",
    url_prefix="/api/user-accounts",
)

# ── role_permissions (composite primary key) ─────────────

role_permissions_bp = Blueprint(
    "role_permissions", __name__, url_prefix="/api/role-permissions"
)


@role_permissions_bp.route("", methods=["GET"])
def list_role_permissions():
    """List all role-permission mappings. Supports ?role_id= and ?permission_id= filters."""
    try:
        query = supabase.table("role_permissions").select("*")
        for col, val in request.args.items():
            query = query.eq(col, val)
        result = query.execute()
        return jsonify(result.data), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@role_permissions_bp.route("", methods=["POST"])
def create_role_permission():
    """Create a new role-permission mapping. Body: { role_id, permission_id }"""
    try:
        body = request.get_json(force=True)
        result = supabase.table("role_permissions").insert(body).execute()
        return jsonify(result.data), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@role_permissions_bp.route("/<int:role_id>/<int:permission_id>", methods=["DELETE"])
def delete_role_permission(role_id, permission_id):
    """Delete a role-permission mapping by composite key."""
    try:
        result = (
            supabase.table("role_permissions")
            .delete()
            .eq("role_id", role_id)
            .eq("permission_id", permission_id)
            .execute()
        )
        return jsonify({"message": "Deleted", "data": result.data}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
