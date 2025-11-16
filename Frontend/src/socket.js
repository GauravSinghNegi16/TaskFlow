import { io } from "socket.io-client";

export const socket = io("https://taskflow-backend-mw2u.onrender.com", {
    transports: ["websocket"],
    autoConnect: true
});

// Log connection status
socket.on("connect", () => {
    console.log("Connected to WebSocket:", socket.id);
});

socket.on("disconnect", () => {
    console.log("Disconnected from WebSocket");
});
