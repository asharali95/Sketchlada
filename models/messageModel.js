const mongoose = require("mongoose");
const {
  Schema: { ObjectId },
} = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      default: "",
    },
    contentType: {
      type: String,
      enum: ["text", "img", "video", "audio"],
      default: "text",
    },
    sender: {
      type: ObjectId,
      required: true,
    },
    reciever: {
      type: ObjectId,
      required: true,
    },
    conversationId: {
      type: ObjectId,
      required: true,
    },
    seen: {
      type: Boolean,
      default: false,
    },
    recieved: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const Message = new mongoose.model("Message", messageSchema);

module.exports = Message;
