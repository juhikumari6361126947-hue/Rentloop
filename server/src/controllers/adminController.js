const User = require("../models/User");
const Item = require("../models/Item");
const RentalRequest = require("../models/RentalRequest");
const asyncHandler = require("../utils/asyncHandler");

const getUsers = asyncHandler(async (_req, res) => {
  const users = await User.find().select("-password").sort({ createdAt: -1 });
  res.json({ users });
});

const removeUser = asyncHandler(async (req, res) => {
  if (req.params.id === req.user._id.toString()) {
    res.status(400);
    throw new Error("Admin cannot remove their own account");
  }

  const user = await User.findById(req.params.id);
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  await Item.updateMany({ owner: user._id }, { isDeleted: true });
  await RentalRequest.updateMany(
    { $or: [{ ownerId: user._id }, { requesterId: user._id }], status: "Pending" },
    { status: "Rejected" }
  );
  await user.deleteOne();

  res.json({ message: "User removed" });
});

const getStats = asyncHandler(async (_req, res) => {
  const [users, items, pendingItems, requests] = await Promise.all([
    User.countDocuments({ role: "user" }),
    Item.countDocuments({ isDeleted: false }),
    Item.countDocuments({ isDeleted: false, status: "pending" }),
    RentalRequest.countDocuments()
  ]);

  res.json({ stats: { users, items, pendingItems, requests } });
});

module.exports = { getUsers, removeUser, getStats };
