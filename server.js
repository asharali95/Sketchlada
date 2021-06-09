const dotenv = require("dotenv").config();
const app = require("./app");
const mongoose = require("mongoose");
const Art = require("./models/artModel");
const DB = process.env.MONGO_STRING.replace(
  "<PASSWORD>",
  process.env.MONGO_PASSWORD
);
console.log(DB);
mongoose
  .connect(DB, { useNewUrlParser: true, useUnifiedTopology: true })
  .then((connection) => {
    console.log("connected to mongoDB");
  });

// Art.create({
//   title: "my first art",
//   rate: 4,
//   cost: 45,
// });

app.listen(8000, () => {
  console.log("server running at 8000");
});
