# WhatsApp Web Clone (MERN + Socket.IO)

A simple real-time one-to-one chat application inspired by WhatsApp Web.

## Tech Stack

- Frontend: React, Tailwind CSS, Axios, React Router, Socket.IO Client, Vite
- Backend: Node.js, Express, Mongoose, Socket.IO
- Database: MongoDB

## Features Implemented
* Real-time messaging using Socket.IO
* Simple username-based login
* Multiple users support
* Search and add contacts
* One-to-one chat system
* Message persistence (MongoDB)
* Chat switching between users
* Auto-scroll to latest message
* Prevent sending empty messages
* Clean WhatsApp-style UI

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

## Notes

- This version intentionally keeps architecture simple and clean.
- Authentication, rooms, delivery/read receipts, and typing indicators are not included.

## Screenshots

<img width="1919" height="899" alt="image" src="https://github.com/user-attachments/assets/2d1d1d1f-617a-431d-b5fc-ca9c06c14aff" />
<img width="1919" height="899" alt="image" src="https://github.com/user-attachments/assets/75045084-c538-4aab-bf8b-55ccc1937e67" />
<img width="1919" height="903" alt="image" src="https://github.com/user-attachments/assets/b254e428-1217-49cf-9fb0-786a7299cee3" />
<img width="1919" height="899" alt="image" src="https://github.com/user-attachments/assets/f3ce2ae6-ea13-4b28-be36-5727a6de7e90" />
<img width="1919" height="900" alt="image" src="https://github.com/user-attachments/assets/41528829-09e1-492b-9dff-b43dcd7ccbc7" />

## How to Test

1. Open the app in two browser tabs
2. Login as two different users
3. Send messages

---

## Author

Pooja Kanagaraj
https://github.com/PoojaKanagaraj06




