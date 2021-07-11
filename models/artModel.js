const mongoose = require("mongoose");
const {
  Schema: { ObjectId },
} = require("mongoose");
const artSchema = new mongoose.Schema(
  {
    artist: {
      type: ObjectId,
      ref: "User", // exists in user collection
      required: [true, "art must belong to an artist"],
    },
    title: String, // my first art
    description: String, //abc...
    cost: Number, //350
    resolutionWidth: Number,
    resolutionHeight: Number,
    reviews: [
      {
        content: String, //nice art!
        reviewedBy: String, //123
        rating: Number, //5
      },
    ],
    gallery: Array, //abc.com, xyz.com
    orientation: String, // landscape, portrait
    subject: String, //"nature"
    formats: Array, //[png","ai","psd"]
    likes: [ObjectId],
    likesCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);
artSchema.pre(/^find/, function (next) {
  //since it is query middleware, "this" represents query
  this.populate({
    path: "artist",
    select: "email username",
  });
  next();
});
const Art = new mongoose.model("Art", artSchema);

module.exports = Art;
