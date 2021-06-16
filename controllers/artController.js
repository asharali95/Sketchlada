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
    var { sort, fields,...resQueries } = req.query;
    // 1- filtering

    var queryStr = JSON.stringify(resQueries);
    var query = queryStr.replace(
      /\b(gt|lt|gte|lte|in)\b/g,
      (match) => `$${match}`
    );
    var queryObj = JSON.parse(query);
    var query = Art.find(queryObj);
    //2- sorting
      if(sort){
        sort = sort.split(",").join(" ")
        console.log(sort)
        query = query.sort(sort);
      }
      else{
        query = query.sort("createdAt"); // default sort condition
      }
      // field limiting 
      if(fields){
        fields = fields.split(",").join(" ")
        query = query.select(fields)
      }
    //get  
    var arts = await query;

    
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
