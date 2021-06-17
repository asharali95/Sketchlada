const Art = require("../models/artModel");
const APIFeatures = require("../utility/commonUtility");

exports.addArt = async (req, res) => {
  try {
    var art = await Art.create(req.body);
    console.log(art);
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
