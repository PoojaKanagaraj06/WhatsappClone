# WhatsApp Web Clone (MERN + Socket.IO)

A simple real-time one-to-one chat application inspired by WhatsApp Web.

## Tech Stack

- Frontend: React, Tailwind CSS, Axios, React Router, Socket.IO Client, Vite
- Backend: Node.js, Express, Mongoose, Socket.IO
- Database: MongoDB

## Features Implemented

- Username-based user creation (no auth for this version)
- User list rendering in chat sidebar
- One-to-one chat history API
- Send message API with MongoDB persistence
- Real-time message updates using Socket.IO
- WhatsApp-like responsive split layout (chat list + chat window)
- Messages persist after refresh (loaded from MongoDB)

## Folder Structure

```text
whatsapp-clone/
├─ backend/
│  ├─ src/
│  │  ├─ config/
│  │  ├─ controllers/
│  │  ├─ models/
│  │  ├─ routes/
│  │  ├─ sockets/
│  │  └─ server.js
│  ├─ .env
│  ├─ .env.example
│  └─ package.json
├─ frontend/
│  ├─ src/
│  │  ├─ components/
│  │  ├─ pages/
│  │  ├─ services/
│  │  ├─ socket/
│  │  ├─ App.jsx
│  │  └─ main.jsx
│  └─ package.json
└─ README.md
```

## Backend Environment Variables

Create `backend/.env`:

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/whatsapp_clone
```

## Setup Instructions

### 1) Clone and open project

```bash
git clone <your-repo-url>
cd whatsapp-clone
```

### 2) Install backend dependencies

```bash
cd backend
npm install
```

### 3) Install frontend dependencies

```bash
cd ../frontend
npm install
```

## Run Locally

Open two terminals:

### Terminal 1 (Backend)

```bash
cd backend
npm run dev
```

### Terminal 2 (Frontend)

```bash
cd frontend
npm run dev
```

Frontend runs on Vite default port and talks to backend at `http://localhost:5000`.

## API Overview

- `POST /api/users` -> create-or-get user by username
- `GET /api/users` -> list all users
- `POST /api/messages` -> send a message
- `GET /api/messages/:user1/:user2` -> fetch chat history between two users

## Real-Time Events

- Client emits: `send_message`
- Server broadcasts: `receive_message`

## Optional Screenshots

Add screenshots here:

- Chat list panel
- Chat window with sent/received bubbles
- Real-time update demo

## Notes

- This version intentionally keeps architecture simple and clean.
- Authentication, rooms, delivery/read receipts, and typing indicators are not included.
