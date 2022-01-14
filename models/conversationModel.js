const mongoose = require("mongoose");
const {
  Schema: { ObjectId },
} = require("mongoose");

const conversationSchema = new mongoose.Schema(
  {
    members: {
      type: [ObjectId],
      required: true,
    },
    conversationType: {
      type: String,
      enum: ["simple_order", "custom_order", "direct"],
    },
    orderId: {
      type: ObjectId,
    },
  },
  { timestamps: true }
);

const Conversation = new mongoose.model("Conversation", conversationSchema);

module.exports = Conversation;
