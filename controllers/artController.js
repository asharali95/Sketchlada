const Art = require("../models/artModel");
const APIFeatures = require("../utility/commonUtility");
const multer = require("multer");
const { v4: uuid } = require("uuid");
const { shapeArtData } = require("../utility/arts");
const { awsImageUploader } = require("../utility/AWS");

// multer- memory storage! (buffer)
var storage = multer.memoryStorage();
exports.artUpload = multer({ storage: storage }).any();

exports.processArtImages = async (req, res, next) => {
  try {
    var gallery = [];
    var files = req.files;
    var promises = files.map(async (file) => {
      var extension = file.mimetype.split("/")[1];
      var fileName = `art-${req.user._id}-${
        file.originalname.split(".")[0]
      }-${uuid()}-${Date.now()}.${extension}`;
      var { Location } = await awsImageUploader(file, fileName);
      gallery.push(Location);
      if (file.fieldname === "coverphoto") req.body.coverPhoto = Location;
    });
    await Promise.all(promises);

    // for (var file of files) {
    //   // bad for performance
    //   var extension = file.mimetype.split("/")[1];
    //   var fileName = `art-${req.user._id}-${
    //     file.originalname.split(".")[0]
    //   }-${uuid()}-${Date.now()}.${extension}`;
    //   var { Location } = await awsImageUploader(file, fileName);
    //   gallery.push(Location);
    // }
    req.body.gallery = gallery;

    next();
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: error.message });
  }
};

// multer - disk storage!
// const storage = multer.diskStorage({
//   destination: (req, file, callback) => {
//     // callback (error, destination)
//     callback(null, "public/images/");
//   },
//   filename: (req, file, callback) => {
//     var extension = file.mimetype.split("/")[1];
//     callback(
//       null,
//       `art-${req.user._id}-${
//         file.originalname.split(".")[0]
//       }-${uuid()}-${Date.now()}.${extension}`
//     );
//   },
// });

// exports.artUpload = multer({ storage: storage }).any();

exports.addArt = async (req, res) => {
  try {
    req.body.artist = req.user._id; // art belong to this artist
    console.log(req.body);
    var art = await Art.create(req.body);
    res.status(200).json({
      status: "success",
      data: {
        art,
      },
    });
  } catch (error) {
    res.status(404).json({
      error: error.message,
    });
  }
};

exports.getArts = async (req, res) => {
  try {
    var { limit = 2 } = req.query;
    var query = new APIFeatures(Art, { ...req.query, status: "active" })
      .filter()
      .sort()
      .limitFields();
    // .paginate();
    //finding total number of pages
    var totalPages = Math.ceil((await Art.countDocuments()) / limit);
    //get
    var arts = await query.get();

    res.status(200).json({
      status: "success",
      pages: totalPages,
      results: arts.length,
      data: {
        arts,
      },
    });
  } catch (error) {
    res.status(404).json({
      error: error.message,
    });
  }
};

exports.getSpecificArt = async (req, res) => {
  try {
    var art = await Art.findById(req.params.artId).populate("reviews");
    res.status(200).json({
      status: "success",
      data: {
        art,
      },
    });
  } catch (error) {
    res.status(404).json({
      error: error.message,
    });
  }
};

exports.likeArt = async (req, res) => {
  try {
    var { artId } = req.params;
    var { _id: userId } = req.user;
    var art = await Art.findOneAndUpdate(
      {
        _id: artId,
        likes: { $ne: userId },
      },
      {
        $inc: { likesCount: 1 },
        $push: { likes: userId },
      },
      {
        new: true,
      }
    );
    console.log(req.params.artId);
    res.status(200).json({
      status: "success",
      data: {
        art,
      },
    });
  } catch (error) {
    res.status(404).json({
      error: error.message,
    });
  }
};
exports.dislikeArt = async (req, res) => {
  try {
    var { artId } = req.params;
    var { _id: userId } = req.user;
    var art = await Art.findOneAndUpdate(
      {
        _id: artId,
        likes: userId,
      },
      {
        $inc: { likesCount: -1 },
        $pull: { likes: userId },
      },
      {
        new: true,
      }
    );
    console.log(req.params.artId);
    res.status(200).json({
      status: "success",
      data: {
        art,
      },
    });
  } catch (error) {
    res.status(404).json({
      error: error.message,
    });
  }
};
