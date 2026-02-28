# 📝 Task Tracker API

A simple and scalable backend API for managing tasks with secure user authentication.

This project allows users to sign up, log in, and manage their personal tasks efficiently using RESTful APIs.

---

## 🚀 Features

- User Signup
- User Login (JWT Authentication)
- Create Tasks
- View Tasks
- Update Tasks
- Delete Tasks
- Mark Tasks as Complete

---

## 🛠️ Tech Stack

- Node.js
- Express.js
- MongoDB
- JWT Authentication
- Mongoose

---

## 📁 Project Structure

```
task-tracker-api
 ┣ models
 ┣ routes
 ┣ controllers
 ┣ middleware
 ┣ config
 ┗ server.js
```

---

## 🔐 Authentication

This API uses **JWT (JSON Web Token)** for secure authentication.

Users receive a token upon login which must be included in protected routes.

---

## 📌 API Endpoints

### Auth Routes

| Method | Endpoint | Description   |
| ------ | -------- | ------------- |
| POST   | /signup  | Register user |
| POST   | /login   | Login user    |

---

### Task Routes (Protected)

| Method | Endpoint            | Description      |
| ------ | ------------------- | ---------------- |
| POST   | /tasks              | Create task      |
| GET    | /tasks              | Get all tasks    |
| PUT    | /tasks/:id          | Update task      |
| DELETE | /tasks/:id          | Delete task      |
| PATCH  | /tasks/:id/complete | Mark as complete |

---

## ⚙️ Setup Instructions

### 1. Clone the Repository

```
git clone <your-repo-url>
cd task-tracker-api
```

### 2. Install Dependencies

```
npm install
```

### 3. Setup Environment Variables

Create a `.env` file and add:

```
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

### 4. Run the Server

```
npm start
```

Server will run at:

```
http://localhost:5000
```

---

## 📈 Future Improvements

- Docker Support
- Task Due Dates
- Priority Levels
- User Profiles
- Deployment

---

## 📄 License

This project is open-source and available for learning and development purposes.
