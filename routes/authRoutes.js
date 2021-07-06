const express = require("express");
const {
  signup,
  fetchUsers,
  login,
  forgotPassword,
  resetPassword,
  updatePassword,
} = require("../controllers/authController");
const router = express.Router();

router.post("/signup", signup);
router.get("/", fetchUsers);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);
router.post("/update-password/:id", updatePassword);
module.exports = router;
