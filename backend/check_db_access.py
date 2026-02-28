import os
from dotenv import load_dotenv
from supabase import create_client, Client

# Load env variables
load_dotenv()

url = os.environ.get("SUPABASE_URL")
key = os.environ.get("SUPABASE_KEY")

if not url or not key:
    print("Error: SUPABASE_URL or SUPABASE_KEY not found in .env")
    exit(1)

try:
    supabase: Client = create_client(url, key)
    
    # Inspect 'candidates' table schema
    print("Inspecting 'candidates' table schema...")
    response = supabase.table("candidates").select("*").limit(1).execute()
    
    if response.data:
        print("Existing columns in 'candidates':", response.data[0].keys())
    else:
        print("Table 'candidates' exists but is empty. Cannot infer columns from data.")
        # Try to insert a dummy to provoke error?
        
except Exception as e:
    print(f"Error accessing Supabase: {e}")
