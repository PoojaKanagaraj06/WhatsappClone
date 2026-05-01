const setupSocket = (io) => {
  io.on("connection", (socket) => {
    console.log("✓ Client connected:", socket.id);

    socket.on("send_message", (message) => {
      if (!message || !message._id) {
        console.error("✗ Invalid message format:", message);
        return;
      }
      
      console.log("📨 Broadcasting message:", {
        from: socket.id,
        messageId: message._id,
        text: message.text,
      });

      // Broadcast to all connected clients (including sender)
      io.emit("receive_message", message);
    });

    socket.on("disconnect", (reason) => {
      console.log("✗ Client disconnected:", socket.id, "Reason:", reason);
    });

    socket.on("error", (error) => {
      console.error("✗ Socket error:", socket.id, error);
    });
  });
};

module.exports = setupSocket;
