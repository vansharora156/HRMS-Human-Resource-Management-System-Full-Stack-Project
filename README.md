# HRMS Full Stack Suite

A comprehensive, robust, and dynamic Human Resource Management System built with **React, Vite, FastAPI**, and **Supabase**. This system offers an end-to-end organizational suite tailored for high performance, intuitive User Interfaces, and seamless Data Management.

<div align="center">

![HRMS Frontend Dashboard](frontend_dashboard.png)

</div>

<p align="center">
    <img src="https://img.shields.io/badge/Frontend-React%20%2B%20Vite-blue?style=for-the-badge&logo=react" alt="Frontend" />
    <img src="https://img.shields.io/badge/Backend-FastAPI-009688?style=for-the-badge&logo=fastapi" alt="Backend" />
    <img src="https://img.shields.io/badge/Database-Supabase-3ECF8E?style=for-the-badge&logo=supabase" alt="Database" />
    <img src="https://img.shields.io/badge/Styling-Tailwind%20CSS-38B2AC?style=for-the-badge&logo=tailwind-css" alt="Styling" />
</p>

## ✨ Key Features

-   **Interactive Dashboard:** View analytics, attendance overviews, and employee statistics at a glance.
-   **Role-Based Access Control (RBAC):** Distinct roles and permissions for `Admin` and `Employee` access.
-   **Employee Management:** Full CRUD operations for detailed onboarding, contacts, and personal information.
-   **Attendance & Leaves Tracking:** Seamlessly request, view, and approve leaves with strict schema validations.
-   **Organization Structuring:** Manage comprehensive company details including Departments, Branches, Designations, and Shifts.
-   **High-Speed Backend:** Asynchronous Python API powered by **FastAPI** running on Uvicorn.
-   **Container Ready:** Easy deployment setups through included `Dockerfile` and `docker-compose.yml`.

---

## 🏗️ Architecture

The application is structured intelligently into two distinct domains:

1.  **Frontend**: A modern Single Page Application built on **React** bundled with **Vite**. UI styling is heavily curated utilizing TailwindCSS and custom CSS parameters ensuring an extremely polished glassmorphic aesthetic.
2.  **Backend**: A high-performance RESTful API served natively via **FastAPI** utilizing robust **Pydantic** models mapping securely into **Supabase's** PostgreSQL environment.

---

## 🚀 Setup & Installation

Follow these steps to spin up the local development environment.

### Prerequisites
-   Node.js & npm (v16+)
-   Python (v3.9+)
-   Git

### 1. Clone the Source
```bash
git clone https://github.com/vansharora156/HRMS-Full-Stack-App.git
cd HRMS-Full-Stack-App
```

### 2. Configure Environment Secrets
You need your Supabase Postgres Database endpoints ready.

*   **Backend (`backend/.env`)**
    ```env
    SUPABASE_URL=your_supabase_url
    SUPABASE_KEY=your_supabase_anon_key
    ```
*   **Frontend (`frontend/.env`)**
    ```env
    VITE_SUPABASE_URL=your_supabase_url
    VITE_SUPABASE_KEY=your_supabase_anon_key
    VITE_API_URL=http://localhost:8000/api
    ```

### 3. Spin up the Backend (FastAPI)
```bash
cd backend
python -m venv .venv
source .venv/bin/activate  # Or .venv\Scripts\Activate on Windows
pip install -r requirements.txt
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```
Browse to `http://localhost:8000/docs` to view the auto-generated Swagger UI!

### 4. Spin up the Frontend (React + Vite)
```bash
cd frontend
npm install
npm run dev
```
Browse to `http://localhost:5173` to interact with the platform.

---

## 💎 Design Philosophy

The User Interface isn't just a basic MVP. Extensive curation went into creating dynamic and lively interactions:

*   **Glassmorphism & Gradients:** Beautiful transluscent containers over soft background palettes.
*   **Micro-Animations:** Seamless transitions dynamically loading data elements into the view.
*   **Modern Typography:** Utilizing streamlined sans-serif font weights to prioritize clarity and aesthetics.

---

## 🤝 Contributing
Contributions, issues, and feature requests are always heavily encouraged. 

*If you liked the system structure, please give the repository a ⭐️!*
