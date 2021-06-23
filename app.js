const express = require("express");
const artRouter = require("./routes/artRoutes");
const authRouter = require("./routes/authRoutes");
const app = express();

//middleware
app.use(express.json());

//routers
app.use("/api/v1/arts", artRouter);
app.use("/api/v1/auth", authRouter);

module.exports = app;
