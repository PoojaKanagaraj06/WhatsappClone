const express = require("express");
const { sendMessage, getMessages } = require("../controllers/messageController");

const router = express.Router();

router.post("/", sendMessage);
router.get("/:user1/:user2", getMessages);

module.exports = router;
