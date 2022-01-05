const express = require("express");
const { generateCheckoutSession } = require("../controllers/orderController");
const { protect } = require("./../controllers/authController");
const router = express.Router();

router.get("/checkout-session/:artId", protect, generateCheckoutSession);

module.exports = router;
