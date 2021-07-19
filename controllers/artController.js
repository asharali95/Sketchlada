const Art = require("../models/artModel");
const APIFeatures = require("../utility/commonUtility");

exports.addArt = async (req, res) => {
  try {
    // req.body.artist = req.user._id;
    // var art = await Art.create(req.body);
    console.log(req.body)
    res.status(200).json({
      status: "success",
      data: {
        // art,
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
    var query = new APIFeatures(Art, req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();
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
