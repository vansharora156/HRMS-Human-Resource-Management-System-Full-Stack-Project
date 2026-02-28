# Nexus HR Core - Backend API

A robust, asynchronous Human Resource Management System backend built with **FastAPI** and **Supabase (PostgreSQL)**. This API serves as the core engine for managing employees, attendance, leave requests, and authentication with strict Role-Based Access Control (RBAC).

## 🚀 Key Features

*   **High Performance:** Built on **FastAPI** for high-throughput, non-blocking I/O operations.
*   **Secure Authentication:** JWT-based stateless authentication with secure password hashing.
*   **Role-Based Access Control (RBAC):** Granular permission scopes for `Admin` vs. `Employee` roles.
*   **Data Integrity:** Complete Pydantic schema validation to decouple internal DB models from external API responses.
*   **Complex Relations:** Handles relational data for Employees, Departments, Leave Requests, and Attendance Logs via Supabase.
*   **Dockerized:** Fully containerized for consistent deployment.

## 🛠️ Tech Stack

*   **Framework:** [FastAPI](https://fastapi.tiangolo.com/) (Python 3.11+)
*   **Database:** PostgreSQL (via [Supabase](https://supabase.com/))
*   **Validation:** [Pydantic](https://docs.pydantic.dev/) v2
*   **Server:** Uvicorn (ASGI)
*   **Containerization:** Docker & Docker Compose

## 📂 Project Structure

```bash
backend/
├── app/
│   ├── main.py            # Entry point
│   ├── core/              # Config & Security (JWT)
│   ├── models/            # Database Models & Schemas
│   ├── routers/           # API Endpoints (Employees, Leave, etc.)
│   └── utils/             # Helper functions
├── Dockerfile             # Container definition
├── requirements.txt       # Python dependencies
└── verify_attendance.py   # Utility scripts
```

## ⚙️ Setup & Installation

### Prerequisites
*   Python 3.9+
*   [Supabase Account](https://supabase.com) (for Database)

### 1. Clone the Repository
```bash
git clone https://github.com/Har-dik25/hrms-backend.git
cd hrms-backend
```

### 2. Configure Environment Variables
Create a `.env` file in the root directory:
```ini
SUPABASE_URL=your_supabase_project_url
SUPABASE_KEY=your_supabase_anon_key
SUPABASE_SERVICE_KEY=your_supabase_service_role_key
SECRET_KEY=your_jwt_secret_key
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

### 3. Run Locally (Traditional)
```bash
# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Start Server
uvicorn main:app --reload
```
The API will be available at `http://localhost:8000`.

### 4. Run with Docker
```bash
docker build -t hrms-backend .
docker run -p 8000:8000 --env-file .env hrms-backend
```

## 📖 API Documentation

FastAPI provides automatic interactive documentation. Once the server is running, visit:

*   **Swagger UI:** `http://localhost:8000/docs`
*   **ReDoc:** `http://localhost:8000/redoc`

## 🧪 Key Endpoints

| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| `POST` | `/auth/login` | Authenticate & get JWT Token | Public |
| `GET` | `/employees/` | List all employees | Admin |
| `POST` | `/attendance/check-in` | Record daily check-in | Employee |
| `POST` | `/leave/request` | Submit a leave request | Employee |
| `PATCH` | `/leave/{id}/status` | Approve/Reject leave | Admin |

## 🤝 Contributing
Contributions are welcome! Please open an issue or submit a pull request.
