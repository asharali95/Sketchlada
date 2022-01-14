const JWT = require("jsonwebtoken");
const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const User = require("../models/userModel");
const { promisify } = require("util");
const sendEmail = require("../utility/email");
const { addArtist, fetchArtist } = require("./artistController");
const { addBuyer, fetchBuyer } = require("./buyerController");

const signJWT = (userId) => {
  return JWT.sign({ id: userId }, process.env.JWT_WEB_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const createAndSendToken = (user, res) => {
  //generate JWT
  var token = signJWT(user.userId);

  res.cookie("jwt", token, {
    expires: new Date(
      Date.now() + parseInt(process.env.COOKIE_EXPIRES_IN) * 24 * 60 * 60 * 1000
    ),
    secure: process.env.NODE_ENV === "development" ? false : true, // this will only valid for HTTPS connection
    httpOnly: process.env.NODE_ENV === "development" ? false : true, // transfer only in http/https protocols
  });

  res.status(200).json({
    status: "success",
    token,
    data: {
      user,
    },
  });
};
exports.fetchUsers = async (req, res) => {
  // for admins only
  try {
    var users = await User.find();
    res.status(200).json({
      status: "sucess",
      data: {
        users,
      },
    });
  } catch (error) {
    res.status(404).json({
      status: "error",
      error: error.message,
    });
  }
};

exports.signup = async (req, res) => {
  try {
    var user = await User.create(req.body); // bson
    //profile creation
    var profile = {
      username: user.username,
      email: user.email,
      userId: user._id,
    };
    var userProfile = null;
    if (user.role === "artist") var userProfile = await addArtist(profile);
    if (user.role === "buyer") var userProfile = await addBuyer(profile);
    createAndSendToken(userProfile, res);
  } catch (error) {
    res.status(404).json({
      status: "error",
      error: error.message,
    });
  }
};

exports.login = async (req, res) => {
  try {
    var { email, password } = req.body;
    //check if user & email exists
    if (!email || !password) {
      res.status(404).json({
        status: "error",
        error: "please enter email and password",
      });
    }
    // fetch user whose email is given
    var user = await User.findOne({ email }).select("+password"); //zabardasti password lekr aane k lye
    // verify password
    var passwordVerified = await user.passwordVerification(
      password,
      user.password
    ); //.compare("pass123pass123","asiajsfiasjd")
    if (!passwordVerified || !user) {
      res.status(401).json({
        status: "error",
        error: "Invalid email or password",
      });
    }

    //fetching profile
    var userProfile = null;
    if (user.role === "artist") userProfile = await fetchArtist(user._id);
    if (user.role === "buyer") userProfile = await fetchBuyer(user._id);
    createAndSendToken(userProfile, res);
  } catch (error) {
    res.status(404).json({
      status: "error",
      error: error.message,
    });
  }
};

exports.protect = async (req, res, next) => {
  try {
    var token = null;
    //1- fetch token from request header
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }
    //2- if no token exists
    if (!token) {
      return res.status(401).json({
        status: "error",
        message: "please sign in!",
      });
    }
    //3- verify
    var { id: userId, iat: tokenIssuedAt } = await promisify(JWT.verify)(
      token,
      process.env.JWT_WEB_SECRET
    );
    //4- check if user exists in DB
    var user = await User.findById(userId);
    if (!user) {
      return res.status(401).json({
        status: "error",
        message: "user does not exist",
      });
    }
    var passwordChangedAt = user.passwordChangedAt;
    if (passwordChangedAt) {
      var isPasswordChangedAfter =
        passwordChangedAt.getTime() > tokenIssuedAt * 1000;
      if (isPasswordChangedAfter) {
        return res.status(404).json({
          status: "error",
          error: "password changed!",
        });
      }
    }
    req.user = user;
    next();
    //5- check if user doesnt change password after signing token
  } catch (error) {
    res.status(404).json({
      status: "error",
      error: error.message,
    });
  }
};

exports.restrictTo =
  (...roles) =>
  async (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(401).json({
        status: "error",
        error: "you donot have access to perform this action",
      });
    }
    next();
  };

exports.forgotPassword = async (req, res) => {
  try {
    var { email } = req.body;
    //1 - fetch user on the basis of email
    var user = await User.findOne({ email });
    if (!user) {
      res.status(400).json({
        status: "error",
        msg: "No user found!",
      });
    }
    //2- generate reset token
    var resetToken = user.passwordResetTokenGenerator();
    await user.save({ validateBeforeSave: false }); //saving already existing doc

    var message = `please click to below provided link for changing password. Note that the provided link will expire within 10 mins - localhost:8000/api/v1/auth/forgot-password/${resetToken}`;
    //3- send to user's email
    await sendEmail({
      to: email,
      subject: "password reset token",
      body: message,
    });
    res.status(200).json({
      status: "success",
      message: `reset token has been sent successfully to ${email}`,
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      msg: error.message,
    });
  }
};
exports.resetPassword = async (req, res) => {
  try {
    var { token } = req.params;
    var { password, confirmPassword } = req.body;
    var encryptedResetToken = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");
    var user = await User.findOne({
      passwordResetToken: encryptedResetToken,
      passwordResetTokenExpiredAt: { $gt: Date.now() },
    });

    if (!user) {
      res.status(400).json({
        status: "error",
        msg: "token doesnt exist or has been expired!",
      });
    }
    //set user new password
    user.password = password;
    user.confirmPassword = confirmPassword;
    user.passwordResetToken = undefined;

    await user.save();

    //login user again(generating JWT token again)
    createAndSendToken(user, res);
  } catch (error) {
    user.passwordResetToken = undefined;
    user.passwordResetTokenExpiredAt = undefined;
    await user.save({ validateBeforeSave: false });
    res.status(400).json({
      status: "error",
      msg: error.message,
    });
  }
};

//this api is still to work on:
exports.updatePassword = async (req, res) => {
  try {
    var { currentPassword, newPassword, confirmPassword } = req.body;
    var { id } = req.params;
    var user = await User.findOne({ _id: id }).select("+password");
    if (!user) {
      res.status(400).json({
        status: "error",
        msg: "user doest not exist",
      });
    }

    var { password, ...modifiedUser } = user.toObject();
    // verify if current password does match
    var passwordVerified = await user.passwordVerification(
      currentPassword,
      user.password
    );

    if (!passwordVerified) {
      res.status(400).json({
        status: "error",
        msg: "current password does not match",
      });
    }
    //check if current pass is equal to new password
    if (currentPassword === newPassword) {
      res.status(400).json({
        status: "error",
        msg: "password should be different from current one",
      });
    }
    user.password = newPassword;
    user.confirmPassword = confirmPassword;
    await user.save();

    //login user again(generating JWT token again)
    createAndSendToken(user, res);

    res.status(200).json({
      status: "success",
      msg: "update password",
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      msg: error.message,
    });
  }
};
