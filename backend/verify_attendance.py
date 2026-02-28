from app.db import supabase
import sys

try:
    print("Checking attendance table...")
    res = supabase.table("attendance").select("*").limit(1).execute()
    if res.data:
        print(f"Attendance Columns: {list(res.data[0].keys())}")
    else:
        print("Attendance table empty. Trying to insert dummy to check constraints.")
        # Try insert with employee_id
        try:
            supabase.table("attendance").insert({"employee_id": 1, "attendance_date": "2025-01-01"}).execute()
            print("Insert with employee_id SUCCESS -> Schema has employee_id")
        except Exception as e:
            print(f"Insert with employee_id FAILED: {e}")
            # Try insert with emp_id
            try:
                supabase.table("attendance").insert({"emp_id": 1, "attendance_date": "2025-01-01"}).execute()
                print("Insert with emp_id SUCCESS -> Schema has emp_id")
            except Exception as e2:
                print(f"Insert with emp_id FAILED: {e2}")

except Exception as e:
    print(f"Error: {e}")
