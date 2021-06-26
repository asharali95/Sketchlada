const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, "this is my custom error message"],
    unique: true,
  },
  role: {
    type: String,
    required: [true, "role is required!"],
    enum: ["artist", "buyer"],
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
    select: false, // ab yeh kisi bhi API request pe data k sath ni fetch hoga
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
  passwordChangedAt: Date,
});

//model instance method -> this method will be available for all the documents created via this model
userSchema.methods.passwordVerification = async (password, hashedPassword) => {
  return await bcrypt.compare(password, hashedPassword);
};

// encrypting password before saving in database
userSchema.pre("save", async function (next) {
  //TODO: check if password change then do the following
  if (!this.isModified("password")) return next();
  var encryptedPassword = await bcrypt.hash(this.password, 12); //number for brute force attack
  this.password = encryptedPassword;
  this.confirmPassword = undefined;
  next();
});
var User = new mongoose.model("User", userSchema);

module.exports = User;
