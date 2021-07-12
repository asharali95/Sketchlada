const Review = require("../models/reviewModel");

exports.postReview = async (req, res) => {
  try {
    var { artId } = req.params;
    var { _id: userId } = req.user;
    req.body.art = artId;
    req.body.reviewedBy = userId;

    var review = await Review.create(req.body);
    res.status(200).json({
      status: "success",
      data: {
        review,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: error.message,
    });
  }
};
// exports.getReview = async (req, res) => {
//   try {
//     res.status(200).json({
//       status: "success",
//       message: "get review",
//     });
//   } catch (error) {
//     res.status(400).json({
//       status: "error",
//       message: error.message,
//     });
//   }
// };
