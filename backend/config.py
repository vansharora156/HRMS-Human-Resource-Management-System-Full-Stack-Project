import os
import ssl
import httpx
from dotenv import load_dotenv
from supabase import create_client, Client

load_dotenv()

# ══════════════════════════════════════════════════════════════════
# Disable SSL verification COMPLETELY for self-signed cert chains.
# Needed when behind a corporate proxy / firewall.
# ══════════════════════════════════════════════════════════════════

# 1. Environment-level: tell underlying libs to skip verification
os.environ["CURL_CA_BUNDLE"] = ""
os.environ["REQUESTS_CA_BUNDLE"] = ""

# 2. Patch Python's ssl module so any default context skips verification
_original_create_default_context = ssl.create_default_context

def _no_verify_context(*args, **kwargs):
    ctx = _original_create_default_context(*args, **kwargs)
    ctx.check_hostname = False
    ctx.verify_mode = ssl.CERT_NONE
    return ctx

ssl.create_default_context = _no_verify_context

# 3. Force httpx Client / AsyncClient to ALWAYS use verify=False
_original_client_init = httpx.Client.__init__
_original_async_init  = httpx.AsyncClient.__init__

def _patched_client_init(self, *args, **kwargs):
    kwargs["verify"] = False          # force, not setdefault
    _original_client_init(self, *args, **kwargs)

def _patched_async_init(self, *args, **kwargs):
    kwargs["verify"] = False          # force, not setdefault
    _original_async_init(self, *args, **kwargs)

httpx.Client.__init__      = _patched_client_init
httpx.AsyncClient.__init__ = _patched_async_init

# ══════════════════════════════════════════════════════════════════

SUPABASE_URL: str = os.getenv("SUPABASE_URL")
SUPABASE_KEY: str = os.getenv("SUPABASE_KEY")
SUPABASE_SERVICE_ROLE_KEY: str = os.getenv("SUPABASE_SERVICE_ROLE_KEY", "")

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

# Admin client uses the service-role key (needed for auto-confirming emails)
supabase_admin: Client = (
    create_client(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)
    if SUPABASE_SERVICE_ROLE_KEY
    else supabase
)

