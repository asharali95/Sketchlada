const mongoose = require("mongoose");

const artSchema = new mongoose.Schema({
  title: String, // my first art
  description: String, //abc...
  cost: Number, //350
  resolution: String, //1920x1080
  likes: Number,  //54
  reviews: [
    {
      content: String,  //nice art!
      reviewedBy: String, //123
      rating: Number, //5
    },
  ],
  gallery: Array, //abc.com, xyz.com
  orientation: String,   // landscape, portrait
  subject: String,  //"nature"
  formats: Array, //[png","ai","psd"]
},{
  timestamps: true
});

const Art = new mongoose.model("Art", artSchema);

module.exports = Art;
