const streamifier = require("streamifier");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const Item = require("../models/Item");
const RentalRequest = require("../models/RentalRequest");
const Notification = require("../models/Notification");
const User = require("../models/User");
const cloudinary = require("../config/cloudinary");
const asyncHandler = require("../utils/asyncHandler");

const toNumber = (value) => {
  if (value === undefined || value === null || value === "") return null;
  const number = Number(value);
  return Number.isFinite(number) ? number : null;
};

const distanceKm = (startLat, startLng, endLat, endLng) => {
  const earthRadiusKm = 6371;
  const toRad = (degrees) => (degrees * Math.PI) / 180;
  const dLat = toRad(endLat - startLat);
  const dLng = toRad(endLng - startLng);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(startLat)) * Math.cos(toRad(endLat)) * Math.sin(dLng / 2) ** 2;
  return earthRadiusKm * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};

const uploadToCloudinary = (fileBuffer) =>
  new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: "rental-marketplace/items", resource_type: "image" },
      (error, result) => {
        if (result) return resolve(result);
        reject(error);
      }
    );
    streamifier.createReadStream(fileBuffer).pipe(stream);
  });

const hasCloudinaryConfig = () =>
  process.env.CLOUDINARY_CLOUD_NAME &&
  process.env.CLOUDINARY_API_KEY &&
  process.env.CLOUDINARY_API_SECRET &&
  !process.env.CLOUDINARY_CLOUD_NAME.startsWith("your-");

const uploadLocally = async (file) => {
  const uploadDir = path.join(__dirname, "..", "..", "uploads");
  await fs.promises.mkdir(uploadDir, { recursive: true });

  const extension = path.extname(file.originalname) || ".jpg";
  const filename = `${Date.now()}-${crypto.randomBytes(8).toString("hex")}${extension}`;
  const targetPath = path.join(uploadDir, filename);
  await fs.promises.writeFile(targetPath, file.buffer);

  return {
    secure_url: `/uploads/${filename}`,
    public_id: `local/${filename}`
  };
};

const getItems = asyncHandler(async (req, res) => {
  const { location, owner, includePending, category } = req.query;
  const searchLat = toNumber(req.query.lat);
  const searchLng = toNumber(req.query.lng);
  const radiusKm = toNumber(req.query.radiusKm);
  const filter = { isDeleted: false };

  if (req.user?.role === "admin" && includePending === "true") {
    filter.status = { $in: ["pending", "approved", "rejected"] };
  } else if (owner === "me" && req.user) {
    filter.owner = req.user._id;
  } else {
    filter.status = "approved";
  }

  if (location) filter.location = new RegExp(location, "i");
  if (category) filter.category = category;

  let items = await Item.find(filter).populate("owner", "name email phone address").sort({ createdAt: -1 });

  if (searchLat !== null && searchLng !== null && radiusKm !== null) {
    items = items
      .map((item) => {
        if (!Number.isFinite(item.pickupLat) || !Number.isFinite(item.pickupLng)) return null;
        const itemDistance = distanceKm(searchLat, searchLng, item.pickupLat, item.pickupLng);
        return {
          ...item.toObject(),
          distanceKm: Number(itemDistance.toFixed(2))
        };
      })
      .filter((item) => item && item.distanceKm <= radiusKm)
      .sort((a, b) => a.distanceKm - b.distanceKm);
  }

  res.json({ items });
});

const getItemById = asyncHandler(async (req, res) => {
  const item = await Item.findOne({ _id: req.params.id, isDeleted: false }).populate(
    "owner",
    "name email phone address"
  );

  if (!item) {
    res.status(404);
    throw new Error("Item not found");
  }

  const canView =
    item.status === "approved" ||
    req.user?.role === "admin" ||
    item.owner._id.toString() === req.user?._id.toString();

  if (!canView) {
    res.status(403);
    throw new Error("This item is not public yet");
  }

  res.json({ item });
});

const createItem = asyncHandler(async (req, res) => {
  const { title, description, category, price, location, phone } = req.body;
  const pickupLat = toNumber(req.body.pickupLat);
  const pickupLng = toNumber(req.body.pickupLng);

  if (!title || !description || !category || !price || !location || pickupLat === null || pickupLng === null || !req.file) {
    res.status(400);
    throw new Error("Title, description, category, price, pickup location and image are required");
  }

  const uploadResult = hasCloudinaryConfig()
    ? await uploadToCloudinary(req.file.buffer)
    : await uploadLocally(req.file);

  const item = await Item.create({
    title,
    description,
    category,
    price,
    location,
    phone,
    pickupLat,
    pickupLng,
    imageUrl: uploadResult.secure_url,
    imagePublicId: uploadResult.public_id,
    owner: req.user._id
  });

  // Notify admin about new item
  const adminUser = await User.findOne({ role: "admin" });
  if (adminUser) {
    await Notification.create({
      user: adminUser._id,
      title: "New Item Pending Approval",
      message: `${req.user.name} has listed a new item: "${item.title}". Please review it.`,
      type: "admin"
    });
  }

  res.status(201).json({ item });
});

const deleteItem = asyncHandler(async (req, res) => {
  const item = await Item.findById(req.params.id);

  if (!item || item.isDeleted) {
    res.status(404);
    throw new Error("Item not found");
  }

  const isOwner = item.owner.toString() === req.user._id.toString();
  if (!isOwner && req.user.role !== "admin") {
    res.status(403);
    throw new Error("Only the owner or admin can delete this item");
  }

  item.isDeleted = true;
  await item.save();
  await RentalRequest.updateMany({ itemId: item._id, status: "Pending" }, { status: "Rejected" });

  res.json({ message: "Item deleted" });
});

const updateItemStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  if (!["approved", "rejected"].includes(status)) {
    res.status(400);
    throw new Error("Status must be approved or rejected");
  }

  const item = await Item.findById(req.params.id);
  if (!item || item.isDeleted) {
    res.status(404);
    throw new Error("Item not found");
  }

  item.status = status;
  await item.save();

  // Notify the owner
  await Notification.create({
    user: item.owner,
    title: `Listing ${status === "approved" ? "Approved" : "Rejected"}`,
    message: `Your listing for "${item.title}" has been ${status}.`,
    type: "system"
  });

  res.json({ item });
});

module.exports = { getItems, getItemById, createItem, deleteItem, updateItemStatus };
