const User = require("../models/userModel");
const JWT = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { promisify } = require("util");
const signJWT = (userId) => {
  return JWT.sign({ id: userId }, process.env.JWT_WEB_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
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
    var { password, ...modifiedUser } = user.toObject(); //simple object
    //generate JWT
    var token = signJWT(user._id);
    console.log(token);
    res.status(200).json({
      status: "success",
      token,
      data: {
        modifiedUser,
      },
    });
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

    //generate token
    var token = signJWT(user._id);
    //send response
    var { password, ...modifiedUser } = user.toObject(); // removing password

    res.status(200).json({
      status: "sucess",
      token,
      data: {
        user: modifiedUser,
      },
    });
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
    if (!passwordChangedAt) {
      var isPasswordChangedAfter =
        passwordChangedAt.getTime() > tokenIssuedAt * 1000;
      if (isPasswordChangedAfter) {
        return res.status(404).json({
          status: "error",
          error: "password changed!",
        });
      }
    }
    next();

    //5- check if user doesnt change password after signing token
  } catch (error) {
    res.status(404).json({
      status: "error",
      error: error.message,
    });
  }
};
