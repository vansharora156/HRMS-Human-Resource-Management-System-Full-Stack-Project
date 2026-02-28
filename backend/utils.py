"""
Generic CRUD blueprint factory for Supabase-backed tables.
"""

from flask import Blueprint, request, jsonify
from config import supabase


def crud_blueprint(table_name: str, primary_key: str, bp_name: str, url_prefix: str) -> Blueprint:
    """
    Create a Flask Blueprint that provides five standard REST endpoints
    for the given Supabase table:

        GET    /              — list all rows  (supports ?column=value filtering)
        GET    /<id>          — get one row by primary key
        POST   /              — insert a new row  (JSON body)
        PUT    /<id>          — update a row       (JSON body)
        DELETE /<id>          — delete a row
    """
    bp = Blueprint(bp_name, __name__, url_prefix=url_prefix)

    # ---------- LIST / FILTER ----------
    @bp.route("", methods=["GET"])
    def list_rows():
        try:
            query = supabase.table(table_name).select("*")

            # allow simple equality filters via query-string
            for col, val in request.args.items():
                query = query.eq(col, val)

            result = query.execute()
            return jsonify(result.data), 200
        except Exception as e:
            return jsonify({"error": str(e)}), 500

    # ---------- GET ONE ----------
    @bp.route("/<id_val>", methods=["GET"])
    def get_row(id_val):
        try:
            result = (
                supabase.table(table_name)
                .select("*")
                .eq(primary_key, id_val)
                .execute()
            )
            if not result.data:
                return jsonify({"error": "Not found"}), 404
            return jsonify(result.data[0]), 200
        except Exception as e:
            return jsonify({"error": str(e)}), 500

    # ---------- CREATE ----------
    @bp.route("", methods=["POST"])
    def create_row():
        try:
            body = request.get_json(force=True)
            result = supabase.table(table_name).insert(body).execute()
            return jsonify(result.data), 201
        except Exception as e:
            return jsonify({"error": str(e)}), 500

    # ---------- UPDATE ----------
    @bp.route("/<id_val>", methods=["PUT"])
    def update_row(id_val):
        try:
            body = request.get_json(force=True)
            result = (
                supabase.table(table_name)
                .update(body)
                .eq(primary_key, id_val)
                .execute()
            )
            if not result.data:
                return jsonify({"error": "Not found"}), 404
            return jsonify(result.data), 200
        except Exception as e:
            return jsonify({"error": str(e)}), 500

    # ---------- DELETE ----------
    @bp.route("/<id_val>", methods=["DELETE"])
    def delete_row(id_val):
        try:
            result = (
                supabase.table(table_name)
                .delete()
                .eq(primary_key, id_val)
                .execute()
            )
            return jsonify({"message": "Deleted", "data": result.data}), 200
        except Exception as e:
            return jsonify({"error": str(e)}), 500

    return bp
