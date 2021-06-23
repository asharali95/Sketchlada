const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, "this is my custom error message"],
  },
  email: {
    type: String,
    unique: true, // indexing
    required: true, //TODO: Check Email Pattern // validation
    lower: true, // data modification eg. User@gmail.com & user@gmail.com
  },
  password: {
    type: String,
    required: true,
    minLength: 8,
  },
  confirmPassword: {
    type: String,
    required: true,
    validate: [
      function (val) {
        //here, "this" pointout document
        return val === this.password;
      },
      "password doesnot match",
    ],
  },
});

var User = new mongoose.model("User", userSchema);

module.exports = User;
