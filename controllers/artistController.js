var Artist = require("../models/artistModel");
const multer = require("multer");
const { v4: uuid } = require("uuid");
const { awsImageUploader } = require("../utility/AWS");

var storage = multer.memoryStorage();
exports.uploadProfilePicture = multer({ storage: storage }).single(
  "displayPicture"
);

exports.processProfilePicture = async (req, res, next) => {
  try {
    if (req.file) {
      var file = req.file;
      var extension = file.mimetype.split("/")[1];
      var fileName = `art-${req.user._id}-${
        file.originalname.split(".")[0]
      }-${uuid()}-${Date.now()}.${extension}`;
      var { Location } = await awsImageUploader(file, fileName);
      req.body.displayPicture = Location;
    }
    next();
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: error.message });
  }
};

exports.fetchArtist = async (artistId) => {
  try {
    var artist = await Artist.findOne({ userId: artistId });
    return artist;
  } catch (error) {
    return new Error(error.message);
  }
};

exports.addArtist = async (artistProfile) => {
  try {
    var artist = await Artist.create(artistProfile);
    return artist;
  } catch (error) {
    return new Error(error.message);
  }
};

exports.updateArtistProfile = async (req, res) => {
  try {
    var { role, _id, userId, email, ...restProfileData } = req.body;
    var artist = await Artist.findOneAndUpdate(
      { userId: req.user._id },
      restProfileData,
      {
        new: true, // return new updated data
        runValidators: true, // validate fields before updating
      }
    );
    res.status(200).json({
      status: "success",
      data: {
        artist,
      },
    });
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};
