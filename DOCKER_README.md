# Docker Setup Guide

This project has been Dockerized for easy deployment and development.

## Prerequisites

- [Docker](https://www.docker.com/products/docker-desktop) installed on your machine.

## How to Run

1.  **Environment Variables**:
    Ensure you have a `.env` file in the `backend` directory with your Supabase credentials:
    ```
    SUPABASE_URL=...
    SUPABASE_KEY=...
    SUPABASE_SERVICE_KEY=...
    ```

2.  **Start the Application**:
    Run the following command in the root directory:
    ```bash
    docker-compose up --build
    ```

3.  **Access the Application**:
    - **Frontend**: http://localhost:80
    - **Backend API**: http://localhost:8000/docs (Swagger UI)

## Troubleshooting

-   If you encounter port conflicts, modify the `docker-compose.yml` file to map to different host ports (e.g., `"8080:80"` for frontend).
-   If the backend fails to connect to the database, double-check your `.env` variables and ensure your internet connection is active (for Supabase).

