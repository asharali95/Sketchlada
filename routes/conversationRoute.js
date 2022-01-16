const express = require("express");
const router = express.Router();
const {
  fetchConversation,
  fetchConversations,
} = require("../controllers/conversationController");
const { protect } = require("../controllers/authController");
// router.get("/", getMessage);

router.get("/:orderId", protect, fetchConversation); // fetch conversation with it's messages
router.get("/", protect, fetchConversations); //fetch list of conversations
module.exports = router;
