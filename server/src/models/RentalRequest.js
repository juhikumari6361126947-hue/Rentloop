const mongoose = require("mongoose");

const rentalRequestSchema = new mongoose.Schema(
  {
    itemId: { type: mongoose.Schema.Types.ObjectId, ref: "Item", required: true },
    requesterId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    ownerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    requesterPhone: { type: String, trim: true, default: "" },
    ownerPhone: { type: String, trim: true, default: "" },
    duration: { type: Number, default: 1, min: 1 },
    totalPrice: { type: Number, default: 0 },
    pricePerDay: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ["Pending", "Accepted", "Rejected"],
      default: "Pending"
    },
    message: { type: String, trim: true, default: "" },
    deliveryLocation: { type: String, trim: true, default: "" },
    deliveryLat: { type: Number },
    deliveryLng: { type: Number },
    ownerUPI: { type: String, default: "" },
    paymentStatus: { type: String, enum: ["unpaid", "paid"], default: "unpaid" }
  },
  { timestamps: true }
);

rentalRequestSchema.index({ itemId: 1, requesterId: 1, status: 1 });

module.exports = mongoose.model("RentalRequest", rentalRequestSchema);
