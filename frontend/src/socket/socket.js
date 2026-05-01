import { io } from "socket.io-client";

// Socket event constants
export const SOCKET_EVENTS = {
  SEND_MESSAGE: "send_message",
  RECEIVE_MESSAGE: "receive_message",
};

// Initialize socket connection to backend
export const socket = io("http://localhost:5000", {
  reconnection: true,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
  reconnectionAttempts: 10,
  transports: ["websocket", "polling"],
});

// Connection event handlers
socket.on("connect", () => {
  console.log("✓ Socket connected:", socket.id);
});

socket.on("disconnect", (reason) => {
  console.log("✗ Socket disconnected:", reason);
});

socket.on("connect_error", (error) => {
  console.error("⚠ Socket connection error:", error.message);
});
