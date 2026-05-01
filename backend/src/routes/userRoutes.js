const express = require("express");
const { createOrGetUser, getAllUsers } = require("../controllers/userController");

const router = express.Router();

router.post("/", createOrGetUser);
router.get("/", getAllUsers);

module.exports = router;
