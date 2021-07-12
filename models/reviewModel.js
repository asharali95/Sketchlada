const mongoose = require("mongoose");
const {
  Schema: { ObjectId },
} = require("mongoose");
const reviewSchema = new mongoose.Schema(
  {
    review: String,
    rating: {
      type: Number,
      min: 0,
      max: 5,
    },
    reviewedBy: {
      type: ObjectId,
      ref: "User",
    },
    art: ObjectId,
  },
  {
    timestamps: true,
  }
);
reviewSchema.pre(/^find/, function (next) {
  this.populate({
    path: "reviewedBy",
    select: "username email",
  });
  next();
});
const Review = new mongoose.model("Review", reviewSchema);

module.exports = Review;
