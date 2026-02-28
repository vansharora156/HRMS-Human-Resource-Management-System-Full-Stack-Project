import os
from supabase import create_client, Client
from app.config import settings

url: str = settings.SUPABASE_URL
key: str = settings.SUPABASE_KEY
supabase: Client = create_client(url, key)

def verify_connection():
    try:
        # Try a simple query, e.g. list tables or just check auth
        # Since we don't know if any table has data, we can try to select from a known table like 'employees' or just 'auth.users' (but that requires admin key usually)
        # Let's try to query 'employees' with limit 1
        response = supabase.table('employees').select("*").limit(1).execute()
        print("Supabase Connection Successful!")
        if response.data:
            print("Columns found:", response.data[0].keys())
        else:
            print("No data in employees table to infer columns.")
    except Exception as e:
        print(f"Supabase Connection Failed: {e}")

if __name__ == "__main__":
    verify_connection()
