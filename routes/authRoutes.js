const express = require("express");
const { signup, fetchUsers } = require("../controllers/authController");
const router = express.Router();

// router.get("/", (req, res) => {
//   res.status(200).json({
//     status: "success",
//     message: "auth home route",
//   });
// });
router.post("/signup", signup);
router.get("/", fetchUsers);
module.exports = router;
