const Notification = require("../models/Notification");

const notifyUser = async ({ user, title, message, type = "system" }) => {
  await Notification.create({
    user: user._id || user,
    title,
    message,
    type
  });
};

module.exports = notifyUser;
