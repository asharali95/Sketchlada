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
    var { sort, fields, page, limit, ...resQueries } = req.query;
    // 1- filtering

    var queryStr = JSON.stringify(resQueries);
    var query = queryStr.replace(
      /\b(gt|lt|gte|lte|in)\b/g,
      (match) => `$${match}`
    );
    var queryObj = JSON.parse(query);
    var query = Art.find(queryObj);
    //2- sorting
    if (sort) {
      sort = sort.split(",").join(" ");

      query = query.sort(sort);
    } else {
      query = query.sort("createdAt"); // default sort condition
    }
    // field limiting
    if (fields) {
      fields = fields.split(",").join(" ");
      query = query.select(fields);
    } else {
      query = query.select("-__v");
    }
    // Pagination
    page = parseInt(page) || 1;
    limit = parseInt(limit) || 2;

    // formula for document skipping -> skip = ( page - 1 ) * limit
    var skip = (page - 1) * limit;
    query = query.skip(skip).limit(limit);
   
    //finding total number of pages
    var totalPages = Math.ceil((await Art.countDocuments()) / limit);
    
    //get
    var arts = await query;

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
