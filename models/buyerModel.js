const mongoose = require("mongoose");

const buyerSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "username is required"],
      unique: true,
    },
    displayPicture: {
      type: String,
      default: "default.png",
    },
    email: {
      type: String,
      unique: true, // indexing
      required: true, //TODO: Check Email Pattern // validation
      lower: true, // data modification eg. User@gmail.com & user@gmail.com
    },
    role: {
      type: String,
      default: "buyer",
    },
    userId: {
      type: mongoose.Schema.ObjectId,
      required: [true, "user id is required"],
    },
    address: {
      country: String,
      city: String,
      street: String,
      state: String,
      zipcode: String,
    },
    //TODO:
    //address info
  },
  {
    timestamps: true,
  }
);

var Buyer = new mongoose.model("Buyer", buyerSchema);

module.exports = Buyer;
