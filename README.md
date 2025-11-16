🚀 TaskFlow – Trello-Style Realtime Task Management App
Full-Stack Assignment | Realtime Sync | WebSockets | Trello API | Webhooks

TaskFlow is a Trello-inspired task management application built using:

React + Vite + Tailwind CSS

Node.js + Express

Socket.io Realtime Sync

Trello API Integration

Trello Webhooks for server-side realtime events

This project implements all required features of a collaborative Trello-style board system including realtime syncing of cards and lists across multiple clients.

🔗 Live Links
✅ Frontend (Vercel):

https://task-flow-jade-five.vercel.app/

🟦 Backend (Render):

https://taskflow-backend-mw2u.onrender.com/

✨ Features Implemented (Assignment Requirements)
🔹 1. Create a new Board

Users can create unlimited boards.
Boards are created directly in Trello using Trello API.

🔹 2. Create / Read All Boards

All user boards automatically load using Trello’s REST API.

🔹 3. View Board Details (Lists + Cards)

Each board displays:

Lists

Cards inside lists

Card order using Trello POS sorting

🔹 4. Create List

New lists can be created inside any board.

UI updates instantly & lists disappear.

🔹 7. Card Features

➕ Create Card

📝 Rename Card

❌ Delete Card

🔄 Drag & Drop Between Lists

📌 Drag & Drop Inside List (reorder)

🔹 8. Realtime Sync (Mandatory Requirement)

Implemented using:

✔ Socket.io (Client ↔ Server)

Used for:

Card Create / Update / Delete

List Create

Live board updates between multiple users

✔ Trello Webhook → Backend → Socket Broadcast

Whenever something changes inside Trello, backend webhook receives the event and syncs all clients.

⚙️ Tech Stack
Frontend

React (Vite)

Tailwind CSS

React Router

Socket.io Client

Hello-Pangea DnD (Drag & Drop)

Backend

Node.js + Express

Socket.io

Axios for Trello API

Trello Webhooks

CORS

Render (Hosting)

🔧 How Real-Time System Works
1. Client joins a board room
socket.emit("joinBoard", { boardId });

2. Any action (create/update/delete) → Socket.io Broadcast

Backend emits:

io.to(`board:${boardId}`).emit("realtime:event", {...});

3. Trello Webhook → Backend → Socket.io

When user updates board inside Trello website:

Trello sends POST to /webhook

Backend normalizes event

Broadcasts to all connected clients

This ensures:

🔥 Full bidirectional realtime sync (client ↔ backend ↔ Trello)
🧪 Testing Steps
✔ Open frontend in 2 browser windows

https://task-flow-jade-five.vercel.app/

Try:

Creating a card

Dragging cards

Renaming cards

Archiving cards

➡ Both windows update instantly.

✔ Make changes directly in Trello

https://trello.com/

➡ Frontend updates via webhook.

📁 Folder Structure
/Frontend
   ├── src
   │   ├── context/BoardContext.js
   │   ├── hooks/useSocket.js
   │   ├── pages/BoardDetails.jsx
   │   ├── components/
   │   └── ...

/Backend
   ├── server.js
   ├── package.json
   └── .env

🔐 Environment Variables
Backend
TRELLO_KEY=yourKey
TRELLO_TOKEN=yourToken

Frontend
VITE_API_BASE=https://taskflow-backend-mw2u.onrender.com

📦 Deployment
Frontend: Vercel

Auto-build using npm run build

Environment variable VITE_API_BASE

Backend: Render

Node service

Auto deploy on push

Port: 4000

CORS enabled

Webhook URL:

https://taskflow-backend-mw2u.onrender.com/webhook

📝 Assignment Deliverables Checklist
Task	Status
Create Board	✅
List All Boards	✅
Create List	✅
Create Card	✅
Update Card	✅
Delete Card	✅
Drag + Drop	✅
Realtime Sync with Socket.io	✅
Trello Webhook Integration	✅
Full Deployment	✔️ Frontend + Backend
