const express = require("express");
const router = express.Router();
const { sendMessage } = require("../controllers/messageController");
const { protect } = require("../controllers/authController");

router.post("/:conversationId", protect, sendMessage);

module.exports = router;
