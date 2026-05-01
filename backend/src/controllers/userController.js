const User = require("../models/User");

const createOrGetUser = async (req, res) => {
  try {
    const { username } = req.body;

    if (!username || !username.trim()) {
      return res.status(400).json({ message: "Username is required" });
    }

    const trimmedUsername = username.trim();

    let user = await User.findOne({ username: trimmedUsername });

    if (user) {
      return res.status(200).json(user);
    }

    user = await User.create({ username: trimmedUsername });
    return res.status(201).json(user);
  } catch (error) {
    return res.status(500).json({ message: "Failed to create or get user" });
  }
};

const getAllUsers = async (_req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    return res.status(200).json(users);
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch users" });
  }
};

module.exports = {
  createOrGetUser,
  getAllUsers,
};
