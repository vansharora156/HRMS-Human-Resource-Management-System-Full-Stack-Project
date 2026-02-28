"""
Quick helper: list unconfirmed users and try to confirm them
via the GoTrue Admin API.
"""
import os, httpx, json
from dotenv import load_dotenv

load_dotenv()

URL = os.getenv("SUPABASE_URL")
KEY = os.getenv("SUPABASE_KEY")
SRK = os.getenv("SUPABASE_SERVICE_ROLE_KEY", "")

api_key = SRK or KEY
print(f"Using {'service_role' if SRK else 'anon'} key")
print(f"Project: {URL}\n")

# List users via admin API
headers = {
    "apikey": api_key,
    "Authorization": f"Bearer {api_key}",
    "Content-Type": "application/json",
}

# Try listing users
r = httpx.get(f"{URL}/auth/v1/admin/users", headers=headers, verify=False, timeout=10)
print(f"List users status: {r.status_code}")

if r.status_code == 200:
    data = r.json()
    users = data.get("users", [])
    print(f"Found {len(users)} users\n")
    for u in users:
        email = u.get("email", "")
        confirmed = u.get("email_confirmed_at")
        uid = u.get("id", "")
        status = "✓ confirmed" if confirmed else "✗ NOT confirmed"
        print(f"  {email}  {status}  (id: {uid})")

        if not confirmed:
            print(f"    → Attempting to confirm {email}...")
            patch_r = httpx.put(
                f"{URL}/auth/v1/admin/users/{uid}",
                headers=headers,
                json={"email_confirm": True},
                verify=False,
                timeout=10,
            )
            if patch_r.status_code == 200:
                print(f"    ✓ Successfully confirmed {email}!")
            else:
                print(f"    ✗ Failed ({patch_r.status_code}): {patch_r.text[:200]}")
else:
    print(f"Cannot access admin API with current key.")
    print(f"Response: {r.text[:300]}")
    print(f"\n{'='*60}")
    print("You need the SERVICE ROLE KEY from Supabase Dashboard:")
    print(f"  1. Open: https://supabase.com/dashboard/project/{URL.split('//')[1].split('.')[0]}/settings/api")
    print("  2. Copy the 'service_role' key (the secret one)")
    print("  3. Add to backend/.env:")
    print("     SUPABASE_SERVICE_ROLE_KEY=eyJ...")
    print("  4. Run this script again: python confirm_users.py")
    print(f"{'='*60}")
