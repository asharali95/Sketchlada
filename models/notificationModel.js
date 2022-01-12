const mongoose = require("mongoose");
const {
  Schema: { ObjectId },
} = require("mongoose");
const notificationSchema = new mongoose.Schema(
  {
    user: {
      type: ObjectId,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Notification = new mongoose.model("Notification", notificationSchema);

module.exports = Notification;
