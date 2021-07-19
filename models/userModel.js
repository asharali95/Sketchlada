const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");

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
  passwordResetToken: String,
  passwordResetTokenExpiredAt: Date,
});

//model instance method -> this method will be available for all the documents created via this model
userSchema.methods.passwordVerification = async (password, hashedPassword) => {
  return await bcrypt.compare(password, hashedPassword);
};
// password reset token generator
userSchema.methods.passwordResetTokenGenerator = function () {
  //generate random string of 32 bits
  var resetToken = crypto.randomBytes(32).toString("hex");
  //encrypt reset token
  var encryptedResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  //save encrypted resettoken in user document
  this.passwordResetToken = encryptedResetToken;
  //set token expiry(10 min)
  this.passwordResetTokenExpiredAt = Date.now() + 10 * 60 * 1000;
  //return non encrypted reset token
  return resetToken;
};
// encrypting password before saving in database
userSchema.pre("save", async function (next) {
  //TODO: check if password change then do the following
  if (!this.isModified("password")) return next();
  var encryptedPassword = await bcrypt.hash(this.password, 12); //number for brute force attack
  this.password = encryptedPassword;
  this.confirmPassword = undefined;
  this.passwordChangedAt = Date.now() - 1000; //This is because JWT signing process takes time so we minus 1 second from actual time to prevent conflicts
  next();
});
var User = new mongoose.model("User", userSchema);

module.exports = User;
