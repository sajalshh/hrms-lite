# HRMS Lite 🚀

**HRMS Lite** is a lightweight, modern Human Resource Management System designed to simplify employee data management and attendance tracking. Built with performance and scalability in mind, it features a responsive Next.js frontend and a high-performance FastAPI backend.

![Project Status](https://img.shields.io/badge/status-live-success)
![License](https://img.shields.io/badge/license-MIT-blue)

## ✨ Features

* **Employee Management:** Add, view, and edit employee details efficiently.
* **Daily Attendance:** Mark attendance (Present/Absent) with a single click.
* **Responsive UI:** Optimized for both Desktop and Mobile (using accordion patterns for small screens).
* **Real-time Status:** Instant visual feedback on attendance status.
* **Secure Deployment:** Fully HTTPS compliant setup on Vercel and VPS.

## 🛠️ Tech Stack

* **Frontend:** Next.js 15 (React), Tailwind CSS, Lucide Icons, Axios.
* **Backend:** Python FastAPI, SQLAlchemy, Pydantic.
* **Database:** MySQL.
* **Deployment:** Vercel (Frontend), VPS/Nginx (Backend), Cloudflare (SSL).

---

## 🚀 Getting Started

Follow these instructions to set up the project locally.

### Prerequisites
* Node.js (v18+)
* Python (v3.10+)
* MySQL Server

### 1️⃣ Backend Setup (FastAPI)

1.  Navigate to the backend folder:
    ```bash
    cd backend
    ```
2.  Create a virtual environment and activate it:
    ```bash
    python3 -m venv venv
    source venv/bin/activate  # On Windows: venv\Scripts\activate
    ```
3.  Install dependencies:
    ```bash
    pip install -r requirements.txt
    ```
4.  Configure Environment Variables:
    * Copy `.env.example` to `.env`.
    * Update `DATABASE_URL` with your MySQL credentials.
5.  Run the server:
    ```bash
    uvicorn main:app --reload --port 8005
    ```
    *The API will be available at `http://localhost:8005`*

### 2️⃣ Frontend Setup (Next.js)

1.  Navigate to the frontend folder:
    ```bash
    cd frontend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Configure Environment Variables:
    * Set `.env.local` with `NEXT_PUBLIC_API_URL=http://localhost:8005`
4.  Run the development server:
    ```bash
    npm run dev
    ```
    *Open `http://localhost:3000` in your browser.*

---

## 🌐 Deployment Architecture

This project is deployed using a hybrid architecture to ensure performance and security:

* **Frontend:** Hosted on **Vercel** for global CDN distribution.
* **Backend:** Hosted on a **Linux VPS** (Ubuntu) using **PM2** and **Nginx** as a reverse proxy.
* **Security:**
    * **SSL/TLS:** Secured via Cloudflare (Full Strict Mode) and Certbot (Let's Encrypt).
    * **CORS:** Configured to strictly allow requests only from the Vercel frontend.

### Live Demo
* **Frontend URL:** [https://hrms-lite-zwri.vercel.app](https://hrms-lite-zwri.vercel.app)
* **Backend API Docs:** [https://hrms.sajalstack.com/docs](https://hrms.sajalstack.com/docs)

---

## 📝 Notes for Reviewers

If you are running the frontend locally against the live backend, please ensure your `.env.local` points to the HTTPS backend URL to avoid Mixed Content errors.

```bash
NEXT_PUBLIC_API_URL=[https://hrms.sajalstack.com](https://hrms.sajalstack.com)
