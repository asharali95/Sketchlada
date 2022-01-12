const Notification = require("../models/notificationModel");

exports.pushNotifications = async (req, res) => {
  try {
    var notification = await Notification.create(req.body);

    res.status(200).json({ status: "success", data: { notification } });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
