const mongoose = require("mongoose");
const {
  Schema: { ObjectId },
} = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    art: { type: ObjectId, ref: "art", required: true },
    buyer: { type: ObjectId, ref: "buyer", required: true },
    artist: { type: ObjectId, ref: "artist", required: true },
  },
  {
    timestamps: true,
  }
);

var Order = new mongoose.model("Order", orderSchema);

module.exports = Order;
