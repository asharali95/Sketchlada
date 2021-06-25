const User = require("../models/userModel");
const JWT = require("jsonwebtoken");

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
    var {password, ...modifiedUser} = user.toObject() //simple object
    //generate JWT
    var token = JWT.sign({ id: user._id }, process.env.JWT_WEB_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });
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
