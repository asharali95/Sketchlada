const Art = require("../models/artModel");

exports.addArt = async (req, res) => {
  try {
    console.log("art called");
    var art = await Art.create(req.body);
    console.log(art);
    res.status(200).json({
      status: "success",
      data: {
        art,
      },
    });
  } catch (error) {
    console.log(error);
  }
};
