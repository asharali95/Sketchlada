const express = require("express");
const router = express.Router();
const { fetchConversation } = require("../controllers/conversationController");
const { protect } = require("../controllers/authController");
// router.get("/", getMessage);

router.get("/:orderId", protect, fetchConversation);
module.exports = router;
