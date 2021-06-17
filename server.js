const dotenv = require("dotenv").config();
const app = require("./app");
const mongoose = require("mongoose");
const Art = require("./models/artModel");
const DB = process.env.MONGO_STRING.replace(
  "<PASSWORD>",
  process.env.MONGO_PASSWORD
);
mongoose
  .connect(DB, { useNewUrlParser: true, useUnifiedTopology: true })
  .then((connection) => {
    console.log("connected to mongoDB");
  });

app.listen(8000, () => {
  console.log("server running at 8000");
});
