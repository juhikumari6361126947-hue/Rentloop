const express = require("express");
const {
  createRequest,
  getRequests,
  updateRequest
} = require("../controllers/requestController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", protect, createRequest);
router.get("/", protect, getRequests);
router.put("/:id", protect, updateRequest);

module.exports = router;
