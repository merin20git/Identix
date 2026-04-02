# IDENTIX - Intelligent Surveillance and Identification System

A full stack AI-based web application for police to detect criminals and missing persons using face recognition and CCTV footage analysis.

## Stack
- Frontend: React + Tailwind + Axios
- Backend: FastAPI
- AI/CV: face_recognition, OpenCV (Haar Cascade), embeddings
- Database: MongoDB

## Project Structure
- backend/ FastAPI APIs and CV pipeline
- frontend/ React dashboard UI

## Backend Setup
1. Create and activate a virtual environment
2. Install dependencies:
   `pip install -r requirements.txt`
3. Create `.env` from `.env.example` and set `JWT_SECRET`, `MONGO_URI`
4. Run server:
   `uvicorn app.main:app --reload`

## Frontend Setup
1. Install dependencies:
   `npm install`
2. Run dev server:
   `npm run dev`

## Bootstrap Admin
Call `POST /api/auth/bootstrap-admin` with:
```json
{
  "username": "admin",
  "password": "StrongPassword",
  "full_name": "System Admin"
}
```
This endpoint only works if no admin exists.

## Features
- Criminal and missing person registry
- Suspect image matching
- CCTV video analysis with timestamps
- Role-based authentication
- Results dashboard
