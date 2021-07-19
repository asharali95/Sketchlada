var Buyer = require("../models/buyerModel");

exports.fetchBuyer = async (buyerId) => {
  try {
    var buyer = await Buyer.findOne({ userId: buyerId });
    return buyer;
  } catch (error) {
    return new Error(error.message);
  }
};
exports.addBuyer = async (buyerProfile) => {
  try {
    var buyer = await Buyer.create(buyerProfile);
    return buyer;
  } catch (error) {
    return new Error(error.message);
  }
};
