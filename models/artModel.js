const mongoose = require("mongoose");

const artSchema = new mongoose.Schema({
  title: String,
  rating: Number,
  cost: Number,
});

const Art = new mongoose.model("Art", artSchema);

module.exports = Art;
