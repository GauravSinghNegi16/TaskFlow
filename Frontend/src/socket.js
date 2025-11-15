// src/socket.js
import { io } from "socket.io-client";

export const socket = io("http://localhost:4000", {
    transports: ["websocket"],
    autoConnect: true
});

// Log connection status
socket.on("connect", () => {
    console.log("🟢 Connected to WebSocket:", socket.id);
});

socket.on("disconnect", () => {
    console.log("🔴 Disconnected from WebSocket");
});
