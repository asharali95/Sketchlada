const express = require("express");
const { pushNotifications } = require("../controllers/notificationController");
const router = express.Router();

router.post("/", pushNotifications);

module.exports = router;
