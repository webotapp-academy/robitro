# Robitro - Learning Platform

## Project Structure
- **Client**: React + Vite (Frontend)
- **Server**: Node.js + Express (Backend)

## How to Run

1.  **Install Dependencies** (if not already done):
    ```bash
    npm run install:all
    ```

2.  **Start Development Servers**:
    ```bash
    npm run dev
    ```
    This specific command runs both client and server concurrently.

## Accessing the Application

- **Frontend (User Interface)**: [http://localhost:5173](http://localhost:5173)
- **Backend (API)**: [http://localhost:5001](http://localhost:5001)

> **Note**: If you access the backend URL (`http://localhost:5001`) directly in your browser, you will see a `{"success":false,"message":"Route not found"}` error. This is normal because the backend is an API server, not a web server for the frontend. Please use the **Frontend URL**.

## API Endpoints
The backend provides API endpoints at `http://localhost:5001/api/...`.
# robitro
