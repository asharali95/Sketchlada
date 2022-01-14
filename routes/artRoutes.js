const express = require("express");
const {
  addArt,
  getArts,
  getSpecificArt,
  likeArt,
  dislikeArt,
  artUpload,
  processArtImages,
} = require("../controllers/artController");
const { protect, restrictTo } = require("../controllers/authController");
const reviewRouter = require("../routes/reviewRoutes");

const router = express.Router();

router.use("/:artId/reviews", reviewRouter);
router
  .route("/")
  .get(getArts)
  .post(protect, artUpload, processArtImages, restrictTo("artist"), addArt);
router.route("/:artId").get(getSpecificArt);
router.route("/:artId/like").post(protect, likeArt);
router.route("/:artId/dislike").post(protect, dislikeArt);
module.exports = router;

//, restrictTo("artist"), artUpload
