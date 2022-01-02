const mongoose = require("mongoose");

const artistSchema = new mongoose.Schema(
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
    userId: {
      type: mongoose.Schema.ObjectId,
      required: [true, "user id is required"],
    },
    role: {
      type: String,
      default: "artist",
    },
    paypal: String,
    address: {
      country: String,
      city: String,
      street: String,
      state: String,
      zipcode: String,
    },
    //TODO:
    //banking info
    //address info
  },
  {
    timestamps: true,
  }
);

var Artist = new mongoose.model("Artist", artistSchema);

module.exports = Artist;
