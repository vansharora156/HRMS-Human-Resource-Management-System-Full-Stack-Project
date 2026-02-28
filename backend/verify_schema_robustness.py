from app.db import supabase
import sys

def check_table_schema(table_name):
    print(f"--- Checking {table_name} ---")
    try:
        # Fetch one record to see keys
        response = supabase.table(table_name).select("*").limit(1).execute()
        if response.data:
            print(f"Columns: {list(response.data[0].keys())}")
            return response.data[0]
        else:
            print(f"Table {table_name} is empty. Cannot infer columns from data.")
            return None
    except Exception as e:
        print(f"Error checking {table_name}: {e}")
        return None

def verify_all():
    tables = ["employees", "assets", "candidates", "expenses", "attendance", "leave_requests"]
    schemas = {}
    for t in tables:
        schemas[t] = check_table_schema(t)
    
    print("\n--- Summary of Critical Fields ---")
    # Check Attendance
    if schemas.get("attendance"):
        keys = schemas["attendance"].keys()
        if "employee_id" in keys:
            print("Attendance: OK (Has employee_id)")
        elif "emp_id" in keys:
             print("Attendance: WARNING (Has emp_id, code expects employee_id?)")
        else:
             print("Attendance: UNKNOWN ID FIELD")

    # Check Assets
    if schemas.get("assets"):
        keys = schemas["assets"].keys()
        if "assigned_to" in keys: 
            print("Assets: OK (Has assigned_to)")
        else:
            print("Assets: CHECK ASSIGNED FIELD")

    # Check Candidates
    if schemas.get("candidates"):
        keys = schemas["candidates"].keys()
        # Check if id is present (it usually is)
        print(f"Candidates keys: {list(keys)}")

if __name__ == "__main__":
    verify_all()
