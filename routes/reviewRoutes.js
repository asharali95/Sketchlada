const express = require("express");
const { protect } = require("../controllers/authController");
const { postReview } = require("../controllers/reviewController");
const router = express.Router({ mergeParams: true });

router.route("/").post(protect, postReview);

module.exports = router;
