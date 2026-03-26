# 🚀 TaskFlow – Cloud-Native Task Management Platform

TaskFlow is a full-stack task management application that enables users to securely manage their daily tasks through a clean and responsive dashboard. It demonstrates core full-stack development concepts including authentication, RESTful APIs, and frontend-backend integration.

---

## ✨ Features

- 🔐 Secure User Authentication (JWT-based Login & Registration)
- 📋 Task Management (Create, Read, Update, Delete)
- ✅ Mark tasks as completed
- ❌ Delete tasks
- 🔒 Protected Routes (Dashboard accessible only after login)
- ⚡ Responsive and modern UI using Tailwind CSS

---

## 🛠️ Tech Stack

### Frontend

- React.js
- React Router
- Axios
- Tailwind CSS

### Backend

- Node.js
- Express.js

### Database

- MongoDB

### Tools & Technologies

- JSON Web Tokens (JWT)
- Git & GitHub

---

## 📁 Project Structure

```
TaskFlow/
│
├── client/                 # Frontend (React)
│   ├── src/
│   │   ├── pages/          # Login, Register, Dashboard
│   │   ├── services/       # API configuration
│   │   ├── App.jsx
│   │   └── main.jsx
│
├── server/                 # Backend (Node.js + Express)
│   ├── routes/
│   ├── controllers/
│   ├── models/
│   └── server.js
```

---

## ⚙️ Installation & Setup

### 1. Clone the Repository

```
git clone https://github.com/your-username/taskflow.git
cd taskflow
```

---

### 2. Setup Backend

```
cd server
npm install
```

Create a `.env` file in the server directory:

```
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

Run backend server:

```
npm run dev
```

---

### 3. Setup Frontend - UI Upgrade

```
cd client
npm install
npm run dev
```

---

## 🌐 API Endpoints

### Authentication Routes

```
POST /api/auth/register
POST /api/auth/login
```

### Task Routes

```
GET    /api/tasks
POST   /api/tasks
PUT    /api/tasks/:id
DELETE /api/tasks/:id
```

---

## 🔐 Authentication Flow

1. User registers or logs in
2. Server generates a JWT token
3. Token is stored in localStorage
4. Token is sent in Authorization headers for protected API requests

---

## 🚧 Future Improvements

- ✏️ Edit Task functionality
- 🔍 Search and filter tasks
- 📊 Dashboard analytics (task stats)
- 🌙 Dark mode support
- ☁️ Cloud deployment (Frontend + Backend)
- 🐳 Docker containerization

---

## 📌 Learning Outcomes

- Implemented secure authentication using JWT
- Built RESTful APIs using Node.js and Express.js
- Integrated frontend with backend services using Axios
- Managed application state in React
- Structured a scalable full-stack application

---

## 🤝 Contributing

Contributions are welcome. Feel free to fork the repository and submit pull requests.

---

## 📄 License

This project is licensed under the MIT License.

---

## 👨‍💻 Author

**Manas Gupta**
Aspiring Software Engineer
Passionate about building scalable and cloud-native applications
