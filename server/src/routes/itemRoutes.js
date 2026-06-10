const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const {
  getItems,
  getItemById,
  createItem,
  deleteItem,
  updateItemStatus
} = require("../controllers/itemController");
const { protect, adminOnly } = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

const router = express.Router();

router.get("/", protectOptional, getItems);
router.get("/:id", protectOptional, getItemById);
router.post("/", protect, upload.single("image"), createItem);
router.delete("/:id", protect, deleteItem);
router.put("/:id/status", protect, adminOnly, updateItemStatus);

async function protectOptional(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return next();
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password");
    if (user) {
      req.user = user;
    }
  } catch (error) {
    // Ignore invalid or expired tokens for optional auth, treat as guest
  }
  next();
}

module.exports = router;
