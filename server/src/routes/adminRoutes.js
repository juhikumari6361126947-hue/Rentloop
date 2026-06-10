const express = require("express");
const { getUsers, removeUser, getStats } = require("../controllers/adminController");
const { protect, adminOnly } = require("../middleware/authMiddleware");

const router = express.Router();

router.use(protect, adminOnly);
router.get("/stats", getStats);
router.get("/users", getUsers);
router.delete("/users/:id", removeUser);

module.exports = router;
