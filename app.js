const express = require("express");
const artRouter = require("./routes/artRoutes");
const authRouter = require("./routes/authRoutes");
const artistRouter = require("./routes/artistRoutes");
const buyerRouter = require("./routes/buyerRoutes");
const orderRouter = require("./routes/orderRoutes");
const notificationRouter = require("./routes/notificationRoute");
const conversationRouter = require("./routes/conversationRoute");
const messageRouter = require("./routes/messageRoute");
const cors = require("cors");
const rateLimit = require("express-rate-limit"); //to resist brute force attack
const mongoSanitize = require("express-mongo-sanitize"); // to resist noSQLQueryInjection
var xss = require("xss-clean"); // for XSS attack (remove script tags)
const { stripeWebHook } = require("./controllers/orderController");

const limiter = rateLimit({
  windowMs: 60 * 60 * 1000, //
  max: 1000, // limit each IP to 1000 request per windowMS
  message: " you have exceed the number of requests",
});

const app = express();
//implementing CORS
app.use(cors({ origin: true, credentials: true }));
//serving static files
app.use(express.static("public"));
//middleware
app.use(limiter);
// stripe
app.post(
  "/stripe-webhook",
  express.raw({ type: "application/json" }),
  stripeWebHook
);
app.use(express.json());
app.use(mongoSanitize());
app.use(xss());

//routers
app.use("/api/v1/arts", artRouter);
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/artists", artistRouter);
app.use("/api/v1/buyers", buyerRouter);
app.use("/api/v1/orders", orderRouter);
app.use("/api/v1/notifications", notificationRouter);
app.use("/api/v1/conversations", conversationRouter);
app.use("/api/v1/messages", messageRouter);
module.exports = app;
