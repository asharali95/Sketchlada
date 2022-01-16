const Conversation = require("../models/conversationModel");
const Order = require("../models/orderModel");
const Message = require("../models/messageModel");
exports.getMessage = (req, res) => {
  try {
    res.status(200).json({ message: "testing api" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.fetchConversation = async (req, res) => {
  try {
    //fetch convoId based on orderId and member
    //--- fetch convo msgs
    //--- return convo and messages
    //if no convo found
    //---create convo
    //--- return convo and messages

    var { orderId } = req.params;
    var { conversationType } = req.body;
    var convo = await Conversation.findOne({
      members: req.user._id,
      orderId,
    });
    if (!convo) {
      var { buyer, artist } = await Order.findOne({
        _id: orderId,
        $or: [{ artist: req.user._id }, { buyer: req.user._id }],
      });
      var members = [buyer, artist];
      convo = await Conversation.create({
        members,
        conversationType,
        orderId,
      });
      console.log(convo);
    }
    var messages = await Message.find({
      conversationId: convo._id,
      $or: [{ sender: req.user._id }, { reciever: req.user._id }],
    });
    console.log(messages);

    res
      .status(200)
      .json({ status: "success", data: { conversation: convo, messages } });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.fetchConversations = async (req, res) => {
  try {
    var conversations = await Conversation.find({
      members: req.user._id,
    });
    res.status(200).json({ status: "sucess", data: { conversations } });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
