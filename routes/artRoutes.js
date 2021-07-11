const express = require("express");
const {
  addArt,
  getArts,
  getSpecificArt,
  likeArt,
  dislikeArt,
} = require("../controllers/artController");
const { protect, restrictTo } = require("../controllers/authController");

const router = express.Router();

router.route("/").get(getArts).post(protect, restrictTo("artist"), addArt);
router.route("/:artId").get(getSpecificArt);
router.route("/:artId/like").post(protect, likeArt);
router.route("/:artId/dislike").post(protect, dislikeArt);
module.exports = router;
