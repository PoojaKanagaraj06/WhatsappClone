# WhatsApp Web Clone (MERN + Socket.IO)

## Project Overview

This is a simplified WhatsApp Web clone built using the MERN stack and Socket.IO.
It allows users to chat in real-time with message persistence and a clean user interface.

---

## Features

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

---

## Tech Stack

### Frontend

* React.js
* Tailwind CSS
* Axios
* React Router
* Socket.IO Client

### Backend

* Node.js
* Express.js
* MongoDB (Mongoose)
* Socket.IO

---

## Project Structure

WhatsappClone/
├── backend/
│   ├── models/
│   ├── routes/
│   ├── controllers/
│   ├── config/
│   └── server.js
├── frontend/
│   ├── components/
│   ├── pages/
│   ├── services/
│   ├── socket/
│   └── App.jsx
├── screenshots/
├── README.md
└── .gitignore

---

## Setup Instructions

### Clone Repository

git clone https://github.com/PoojaKanagaraj06/WhatsappClone.git
cd WhatsappClone

---

### Backend Setup

cd backend
npm install
npm start

---

### Frontend Setup

cd frontend
npm install
npm run dev

---

## Environment Variables

Create a `.env` file inside the backend folder:

PORT=5000
MONGO_URI=your_mongodb_connection_string

---

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

Messages should appear instantly without refresh

---

## Author

Pooja Kanagaraj
https://github.com/PoojaKanagaraj06




