const express = require("express");
const { signup, login, adminLogin, me } = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/signup", signup);
router.post("/register", signup);
router.post("/login", login);
router.post("/admin/login", adminLogin);
router.get("/me", protect, me);

module.exports = router;
