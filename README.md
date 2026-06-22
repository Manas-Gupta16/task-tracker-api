# TaskFlow - Cloud-Native Task Management Platform

**[View Live Application on Render](https://task-tracker-api-oys6.onrender.com)**

TaskFlow is a robust full-stack task management application designed for scalability, security, and performance. It enables users to securely manage their daily tasks through a modern and responsive dashboard.

## Overview

This project demonstrates core full-stack development concepts, emphasizing secure authentication, RESTful API design, frontend-backend integration, and modern cloud-native deployment practices using Docker.

## Features

- Secure User Authentication (JWT-based Login & Registration)
- Comprehensive Task Management (Create, Read, Update, Delete)
- Protected Routes (Dashboard accessible only after authentication)
- Responsive and modern user interface utilizing Tailwind CSS
- Containerized environment for consistent deployment (Docker & Docker Compose)
- Multi-stage Nginx builds for optimized frontend delivery
- Production-ready security headers and rate limiting

## Tech Stack

### Frontend
- React.js
- React Router
- Vite
- Axios
- Tailwind CSS

### Backend
- Node.js
- Express.js
- Helmet (Security Middleware)
- Express Rate Limit

### Database
- MongoDB (via Mongoose)

### Infrastructure & Deployment
- Docker & Docker Compose
- Nginx (Reverse Proxy & Static File Serving)

## Project Structure

```
task-tracker-api/
│
├── taskflow-frontend/      # Frontend application (React/Vite)
│   ├── src/                # Source code (Components, Pages, Services)
│   ├── public/             # Static assets
│   ├── Dockerfile          # Multi-stage Nginx build configuration
│   └── nginx.conf          # Nginx routing configuration
│
├── controllers/            # Backend business logic
├── models/                 # MongoDB schemas
├── routes/                 # API route definitions
├── middleware/             # Authentication & custom middleware
├── config/                 # Database configuration
├── Dockerfile              # Backend Node.js image configuration
├── docker-compose.yml      # Multi-container orchestration
└── server.js               # Entry point for the Express API
```

## Installation & Local Development

### Prerequisites
- Git
- Docker Desktop (or Docker Engine)

### Quick Start (Docker)

The easiest way to run the application locally is using Docker Compose.

1. Clone the repository:
   ```bash
   git clone https://github.com/Manas-Gupta16/task-tracker-api.git
   cd task-tracker-api
   ```

2. Configure environment variables. Create a `.env` file in the root directory:
   ```env
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_secure_random_string
   ```

3. Build and run the containers:
   ```bash
   docker-compose up --build
   ```

4. Access the application:
   - Frontend: `http://localhost:80` (or `http://localhost:5173` depending on configuration)
   - Backend API: `http://localhost:5000/api`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user account
- `POST /api/auth/login` - Authenticate user and receive JWT

### Tasks
- `GET /api/tasks` - Retrieve all tasks for the authenticated user
- `POST /api/tasks` - Create a new task
- `PUT /api/tasks/:id` - Update an existing task
- `DELETE /api/tasks/:id` - Delete a task

### System
- `GET /` - Root endpoint
- `GET /api/health` - System health check and uptime

## Security Implementations

- Passwords are securely hashed using bcryptjs.
- API endpoints are protected using JSON Web Tokens (JWT).
- HTTP headers are secured against common vulnerabilities using Helmet.
- Brute-force protection is enforced via Express Rate Limiting.
- Cross-Origin Resource Sharing (CORS) is strictly configured to allow only authorized frontend domains.

## License

This project is licensed under the MIT License.

## Author

Manas Gupta
