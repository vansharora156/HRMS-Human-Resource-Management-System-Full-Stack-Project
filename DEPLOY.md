# Deployment Guide

## 1. Backend Deployment (Render)

We will deploy the FastAPI backend to Render.com.

### Steps:
1. Push your code to a GitHub repository.
2. Go to [Render Dashboard](https://dashboard.render.com/).
3. Click **New +** -> **Web Service**.
4. Connect your GitHub repository.
5. Configure the service:
   - **Name**: `hrms-backend` (or similar)
   - **Region**: Choose one close to you (e.g., Singapore, Frankfurt, Oregon).
   - **Branch**: `main` (or your working branch).
   - **Root Directory**: `backend` (Important! This tells Render where the python app is).
   - **Runtime**: `Python 3`.
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn app.main:app --host 0.0.0.0 --port 10000`
6. **Environment Variables** (Scroll down to "Advanced"):
   Add the following keys (copy values from your local `.env` file):
   - `SUPABASE_URL`: `...`
   - `SUPABASE_KEY`: `...`
   - `SUPABASE_SERVICE_KEY`: `...` (if you have it)
7. Click **Create Web Service**.
8. Wait for the deployment to finish. Copy the **onrender.com URL** (e.g., `https://hrms-backend.onrender.com`).

---

## 2. Frontend Deployment (Vercel)

We will deploy the React/Vite frontend to Vercel.

### Steps:
1. Go to [Vercel Dashboard](https://vercel.com/dashboard).
2. Click **Add New...** -> **Project**.
3. Import your GitHub repository.
4. Configure the project:
   - **Framework Preset**: `Vite` (should be auto-detected).
   - **Root Directory**: Click "Edit" and select `frontend`.
5. **Environment Variables**:
   Add the following variable to point to your backend:
   - **Name**: `VITE_API_URL`
   - **Value**: The Render URL from step 1 (e.g., `https://hrms-backend.onrender.com`).
     *Note: Do not add a trailing slash `/`.*
6. Click **Deploy**.

### Post-Deployment:
- Once deployed, open your Vercel URL.
- Try logging in or navigating. It should connect to your Render backend.
- If you see CORS errors in the console, ensure your Backend `app/main.py` allows origins (currently set to `*` which allows everything).

## Troubleshooting

- **404 on Refresh (Frontend)**: The `vercel.json` file in the frontend directory handles this by rewriting all routes to `index.html`. It should work automatically.
- **Backend Connection Error**: Check the Network tab in browser dev tools. Ensure the request URL starts with your Render URL, not `localhost`.
- **Database Errors**: Ensure `SUPABASE_URL` and `SUPABASE_KEY` are correct in Render Environment Variables.
