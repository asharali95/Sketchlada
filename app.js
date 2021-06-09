const express = require("express");
const Art = require("./models/artModel");

const app = express();

app.use(express.json()); //middleware

app.post("/api/v1/art", async (req, res) => {
  try {
    console.log("art called");
    var art = await Art.create(req.body);
    console.log(art);
    res.status(200).json({
      status:"success",
      data:{
          art
      }
    });
  } catch (error) {
    console.log(error);
  }
});
module.exports = app;
