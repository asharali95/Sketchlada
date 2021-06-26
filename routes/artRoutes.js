const express = require("express");
const { addArt, getArts } = require("../controllers/artController");
const { protect } = require("../controllers/authController");

const router = express.Router();

router.post("/", protect, addArt);
router.get("/", getArts); 

module.exports = router;
