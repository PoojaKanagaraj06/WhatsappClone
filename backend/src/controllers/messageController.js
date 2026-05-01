const Message = require("../models/Message");

const sendMessage = async (req, res) => {
  try {
    const { sender, receiver, text } = req.body;

    if (!text || !text.trim()) {
      return res.status(400).json({ message: "Message text is required" });
    }

    const message = await Message.create({
      sender,
      receiver,
      text: text.trim(),
    });

    return res.status(201).json(message);
  } catch (error) {
    return res.status(500).json({ message: "Failed to send message" });
  }
};

const getMessages = async (req, res) => {
  try {
    const { user1, user2 } = req.params;

    const messages = await Message.find({
      $or: [
        { sender: user1, receiver: user2 },
        { sender: user2, receiver: user1 },
      ],
    }).sort({ timestamp: 1 });

    return res.status(200).json(messages);
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch messages" });
  }
};

module.exports = {
  sendMessage,
  getMessages,
};
