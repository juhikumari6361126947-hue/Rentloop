const RentalRequest = require("../models/RentalRequest");
const Item = require("../models/Item");
const User = require("../models/User");
const asyncHandler = require("../utils/asyncHandler");
const notifyUser = require("../utils/notify");

const populateRequest = (query) =>
  query
    .populate("itemId", "title imageUrl price location pickupLat pickupLng")
    .populate("requesterId", "name email phone address")
    .populate("ownerId", "name email phone address");

const toNumber = (value) => {
  if (value === undefined || value === null || value === "") return null;
  const number = Number(value);
  return Number.isFinite(number) ? number : null;
};

const createRequest = asyncHandler(async (req, res) => {
  const { itemId, message, deliveryLocation } = req.body;
  const requesterPhone = req.body.requesterPhone || "";
  const duration = toNumber(req.body.duration) || 1;
  const deliveryLat = toNumber(req.body.deliveryLat);
  const deliveryLng = toNumber(req.body.deliveryLng);
  const item = await Item.findOne({ _id: itemId, status: "approved", isDeleted: false }).populate(
    "owner",
    "name email"
  );

  if (!item) {
    res.status(404);
    throw new Error("Approved item not found");
  }

  if (item.owner._id.toString() === req.user._id.toString()) {
    res.status(400);
    throw new Error("You cannot rent your own item");
  }

  const existing = await RentalRequest.findOne({
    itemId: item._id,
    requesterId: req.user._id,
    status: "Pending"
  });

  if (existing) {
    res.status(409);
    throw new Error("You already have a pending request for this item");
  }

  const totalPrice = item.price * duration;
  
  const rentalRequest = await RentalRequest.create({
    itemId: item._id,
    requesterId: req.user._id,
    ownerId: item.owner._id,
    message,
    deliveryLocation,
    deliveryLat,
    deliveryLng,
    requesterPhone,
    ownerPhone: item.phone || item.owner.phone || "",
    duration,
    pricePerDay: item.price,
    totalPrice
  });

  await notifyUser({
    user: item.owner,
    title: "New rental request",
    message: `${req.user.name} requested to rent ${item.title}.`,
    type: "request_created"
  });

  const populated = await populateRequest(RentalRequest.findById(rentalRequest._id));
  res.status(201).json({ request: populated });
});

const getRequests = asyncHandler(async (req, res) => {
  const { type = "incoming" } = req.query;
  const filter =
    req.user.role === "admin"
      ? {}
      : type === "outgoing"
        ? { requesterId: req.user._id }
        : { ownerId: req.user._id };

  const requests = await populateRequest(RentalRequest.find(filter).sort({ createdAt: -1 }));
  res.json({ requests });
});

const updateRequest = asyncHandler(async (req, res) => {
  const { status, ownerUPI, paymentStatus } = req.body;

  // Handle status updates (Accepted / Rejected)
  if (status) {
    if (!["Accepted", "Rejected"].includes(status)) {
      res.status(400);
      throw new Error("Status must be Accepted or Rejected");
    }

    const rentalRequest = await RentalRequest.findById(req.params.id).populate("itemId", "title");
    if (!rentalRequest) {
      res.status(404);
      throw new Error("Request not found");
    }

    // Only owner (or admin) can accept/reject
    if (
      req.user.role !== "admin" &&
      rentalRequest.ownerId.toString() !== req.user._id.toString()
    ) {
      res.status(403);
      throw new Error("Only the owner can accept or reject this request");
    }

    rentalRequest.status = status;
    // If owner is accepting, capture their UPI if provided
    if (status === "Accepted" && ownerUPI) {
      rentalRequest.ownerUPI = ownerUPI;
    }
    await rentalRequest.save();

    const requester = await User.findById(rentalRequest.requesterId).select("name email");
    // Notify requester; include UPI when accepted
    await notifyUser({
      user: requester,
      title: `Rental request ${status.toLowerCase()}`,
      message: `Your request for ${rentalRequest.itemId.title} was ${status.toLowerCase()}.` + (status === "Accepted" && ownerUPI ? ` Owner UPI: ${ownerUPI}` : ""),
      type: "request_updated"
    });

    const populated = await populateRequest(RentalRequest.findById(rentalRequest._id));
    return res.json({ request: populated });
  }

  // Handle payment status update by renter
  if (paymentStatus) {
    if (!["paid", "unpaid"].includes(paymentStatus)) {
      res.status(400);
      throw new Error("Invalid paymentStatus value");
    }
    const rentalRequest = await RentalRequest.findById(req.params.id);
    if (!rentalRequest) {
      res.status(404);
      throw new Error("Request not found");
    }
    // Only the requester can mark payment as paid and only after acceptance
    if (rentalRequest.requesterId.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error("Only the requester can update payment status");
    }
    if (rentalRequest.status !== "Accepted") {
      res.status(400);
      throw new Error("Payment can be made only after request is accepted");
    }
    rentalRequest.paymentStatus = paymentStatus;
    await rentalRequest.save();
    const populated = await populateRequest(RentalRequest.findById(rentalRequest._id));
    return res.json({ request: populated });
  }

  // If neither status nor paymentStatus provided
  res.status(400);
  throw new Error("No valid fields to update");
});

module.exports = { createRequest, getRequests, updateRequest };
