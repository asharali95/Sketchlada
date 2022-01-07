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
    gallery: Array, //abc.com, xyz.com
    coverPhoto: String,
    orientation: String, // landscape, portrait
    subject: String, //"nature"
    formats: Array, //[png","ai","psd"]
    likes: [ObjectId],
    likesCount: {
      type: Number,
      default: 0,
    },
    viewCount: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      default: "active",
      enum: ["pending", "active", "sold"],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    timestamps: true,
  }
);

artSchema.virtual("reviews", {
  ref: "Review",
  foreignField: "art",
  localField: "_id",
});

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
