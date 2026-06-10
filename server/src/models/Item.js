const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    category: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 1 },
    location: { type: String, required: true, trim: true },
    pickupLat: { type: Number },
    pickupLng: { type: Number },
    phone: { type: String, trim: true, default: "" },
    imageUrl: { type: String, required: true },
    imagePublicId: { type: String },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending"
    },
    isDeleted: { type: Boolean, default: false }
  },
  { timestamps: true }
);

itemSchema.index({ title: "text", description: "text", location: "text" });

module.exports = mongoose.model("Item", itemSchema);
