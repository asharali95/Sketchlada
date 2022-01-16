const Conversation = require("../models/conversationModel");
const Message = require("../models/messageModel");
exports.sendMessage = async (req, res) => {
  try {
    //fetch convo based on convoId
    //if no convo found
    // -> send error
    //else -> shape data and create message
    var { conversationId } = req.params;
    var conversation = await Conversation.findOne({
      _id: conversationId,
      members: req.user._id,
    });
    if (!conversation) {
      return res
        .status(400)
        .json({ status: "error", message: "something went wrong" });
    }
    var { members } = conversation;
    var { content } = req.body;
    var reciever = members.find((member) => `${member}` !== `${req.user._id}`);
    var message = await Message.create({
      conversationId,
      content,
      sender: req.user._id,
      reciever,
    });
    res.status(200).json({
      status: "success",
      data: {
        message,
      },
    });
  } catch (error) {
    res.status(400).json({
      error: error.message,
    });
  }
};
