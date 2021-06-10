const Art = require("../models/artModel");

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
    // modelled query
    var queryStr = JSON.stringify(req.query);
    var query = queryStr.replace(
      /\b(gt|lt|gte|lte)\b/g,
      (match) => `$${match}`
    );
    var queryObj = JSON.parse(query)
    //passed query
    var arts = await Art.find(queryObj);

    res.status(200).json({
      status: "success",
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
