const express = require("express");
const { protect, restrictTo } = require("../controllers/authController");
const {
  addArtist,
  updateArtistProfile,
  uploadProfilePicture,
  processProfilePicture,
} = require("../controllers/artistController");
const router = express.Router();

router
  .route("/")
  .post(addArtist)
  .patch(
    protect,
    restrictTo("artist"),
    uploadProfilePicture,
    processProfilePicture,
    updateArtistProfile
  );

module.exports = router;
