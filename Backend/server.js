import express from "express";
import dotenv from "dotenv";
import axios from "axios";
import cors from "cors";
import http from "http";                // ✅ required for socket.io
import { Server } from "socket.io";     // ✅ socket.io

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

const TRELLO_KEY = process.env.TRELLO_KEY;
const TRELLO_TOKEN = process.env.TRELLO_TOKEN;

/* -----------------------------------------------------
 🟦 Trello Request Wrapper
--------------------------------------------------------*/
const trello = axios.create({
  baseURL: "https://api.trello.com/1",
  params: {
    key: TRELLO_KEY,
    token: TRELLO_TOKEN,
  }
});

/* -----------------------------------------------------
   🟦 Trello Webhook Handler
------------------------------------------------------*/

// Trello verifies webhook with a HEAD request
app.head("/webhook", (req, res) => {
  console.log("🔵 Trello Webhook Verified (HEAD request)");
  res.status(200).send();
});

// Trello sends POST for every card/list event
app.post("/webhook", (req, res) => {
  console.log("🟣 Trello Webhook Event:", req.body);

  // Broadcast event to all clients using socket.io
  io.emit("realtime:event", {
    type: "trello_update",
    data: req.body,
  });

  res.status(200).send("OK");
});


/* -----------------------------------------------------
 🟦 GET ALL BOARDS
--------------------------------------------------------*/
app.get("/api/boards", async (req, res) => {
  try {
    const { data } = await trello.get("/members/me/boards");
    res.json(data);
  } catch (err) {
    console.log("GET BOARDS ERROR:", err?.response?.data || err.message);
    res.status(500).json({ error: "Failed to fetch boards" });
  }
});

/* -----------------------------------------------------
 🟦 GET BOARD DATA
--------------------------------------------------------*/
app.get("/api/boards/:boardId/data", async (req, res) => {
  try {
    const boardId = req.params.boardId;

    const [board, lists, cards] = await Promise.all([
      trello.get(`/boards/${boardId}`),
      trello.get(`/boards/${boardId}/lists`),
      trello.get(`/boards/${boardId}/cards`)
    ]);

    res.json({
      board: board.data,
      lists: lists.data,
      cards: cards.data
    });

  } catch (err) {
    console.log("LOAD BOARD ERROR:", err?.response?.data || err.message);
    res.status(500).json({ error: "Failed to load board" });
  }
});

/* -----------------------------------------------------
 🟦 CREATE CARD
--------------------------------------------------------*/
app.post("/api/tasks", async (req, res) => {
  try {
    const { listId, name, boardId } = req.body;

    const { data } = await trello.post(`/cards`, null, {
      params: { idList: listId, name }
    });

    // 🔥 Emit real time event
    const io = req.app.get("io");
    io.to(`board:${boardId}`).emit("realtime:event", {
      type: "card:created",
      boardId,
      payload: data,
    });

    res.json(data);
  } catch (err) {
    console.log("CREATE CARD ERROR:", err?.response?.data || err.message);
    res.status(500).json({ error: "Failed to create card" });
  }
});

/* -----------------------------------------------------
 🟦 UPDATE CARD
--------------------------------------------------------*/
app.put("/api/tasks/:cardId", async (req, res) => {
  try {
    const cardId = req.params.cardId;
    const updates = req.body;

    const { data } = await trello.put(`/cards/${cardId}`, null, {
      params: updates
    });

    const io = req.app.get("io");
    io.to(`board:${data.idBoard}`).emit("realtime:event", {
      type: "card:updated",
      boardId: data.idBoard,
      payload: data,
    });

    res.json(data);
  } catch (err) {
    console.log("UPDATE CARD ERROR:", err?.response?.data || err.message);
    res.status(500).json({ error: "Failed to update card" });
  }
});

/* -----------------------------------------------------
 🟦 DELETE CARD
--------------------------------------------------------*/
app.delete("/api/tasks/:cardId", async (req, res) => {
  try {
    const cardId = req.params.cardId;

    const { data } = await trello.put(`/cards/${cardId}`, null, {
      params: { closed: true }
    });

    const io = req.app.get("io");
    io.to(`board:${data.idBoard}`).emit("realtime:event", {
      type: "card:deleted",
      boardId: data.idBoard,
      payload: { id: cardId },
    });

    res.json({ message: "Card deleted", card: data });
  } catch (err) {
    console.log("DELETE CARD ERROR:", err?.response?.data || err.message);
    res.status(500).json({ error: "Failed to delete card" });
  }
});

/* -----------------------------------------------------
 🟦 CREATE LIST
--------------------------------------------------------*/
app.post("/api/lists", async (req, res) => {
  try {
    const { name, boardId } = req.body;

    const { data } = await trello.post(`/lists`, null, {
      params: { name, idBoard: boardId, pos: "bottom" }
    });

    const io = req.app.get("io");
    io.to(`board:${boardId}`).emit("realtime:event", {
      type: "list:created",
      boardId,
      payload: data,
    });

    res.json(data);
  } catch (err) {
    console.log("CREATE LIST ERROR:", err?.response?.data || err.message);
    res.status(500).json({ error: "Failed to create list" });
  }
});

/* -----------------------------------------------------
 🟦 CREATE BOARD
--------------------------------------------------------*/
app.post("/api/boards", async (req, res) => {
  try {
    const { name } = req.body;

    const { data } = await trello.post(`/boards`, null, {
      params: { name }
    });

    res.json(data);
  } catch (err) {
    console.log("CREATE BOARD ERROR:", err?.response?.data || err.message);
    res.status(500).json({ error: "Failed to create board" });
  }
});

/* -----------------------------------------------------
 🟦 UPDATE BOARD NAME
--------------------------------------------------------*/
app.put("/api/boards/:boardId", async (req, res) => {
  try {
    const boardId = req.params.boardId;
    const { name } = req.body;

    const { data } = await trello.put(`/boards/${boardId}`, null, {
      params: { name }
    });

    res.json(data);
  } catch (err) {
    console.log("UPDATE BOARD ERROR:", err?.response?.data || err.message);
    res.status(500).json({ error: "Failed to rename board" });
  }
});

/* -----------------------------------------------------
 🟦 SOCKET.IO SETUP
--------------------------------------------------------*/
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*", // change to your frontend URL in production
    methods: ["GET", "POST"]
  }
});

io.on("connection", (socket) => {
  console.log("⚡ Client connected:", socket.id);

  socket.on("joinBoard", ({ boardId }) => {
    socket.join(`board:${boardId}`);
    console.log(`➡️ Joined room board:${boardId}`);
  });

  socket.on("leaveBoard", ({ boardId }) => {
    socket.leave(`board:${boardId}`);
  });

  socket.on("disconnect", () => {
    console.log(`❌ Client disconnected: ${socket.id}`);
  });
});

app.set("io", io);

/* -----------------------------------------------------
 🟧 TRELLLO WEBHOOK VERIFICATION (REQUIRED)
--------------------------------------------------------*/
app.head("/webhook", (req, res) => {
  console.log("🔵 Trello pinged webhook verification");
  return res.status(200).send();
});

/* -----------------------------------------------------
 🟧 TRELLLO WEBHOOK RECEIVER
--------------------------------------------------------*/
app.post("/webhook", (req, res) => {
  const io = req.app.get("io");

  const event = req.body;
  const action = event?.action;

  console.log("📩 Incoming Trello Webhook:", action?.type);

  // Extract Board ID
  const boardId = action?.data?.board?.id;

  if (!boardId) {
    return res.status(200).send("No board ID");
  }

  /* NORMALIZED EVENT FORMAT */
  const normalized = {
    boardId,
    type: action.type, // e.g. "updateCard", "createCard"
    trelloEvent: action,
  };

  // 🔥 Broadcast to board room
  io.to(`board:${boardId}`).emit("realtime:event", {
    type: `trello:${action.type}`,
    boardId,
    payload: action.data,
  });

  return res.status(200).send("OK");
});


/* -----------------------------------------------------
 🟦 START SERVER
--------------------------------------------------------*/
server.listen(4000, () => {
  console.log("🚀 Server with WebSockets running on 4000");
});
