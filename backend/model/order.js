const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema(
  {
    _id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    originalPrice: {
      type: Number,
      min: 0,
    },
    discountPrice: {
      type: Number,
      required: true,
      min: 0,
    },
    qty: {
      type: Number,
      required: true,
      min: 1,
      validate: Number.isInteger,
    },
    images: [String],
    shopId: {
      type: String,
      required: true,
      index: true,
    },
    shop: {
      type: Object,
      required: true,
    },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    cart: {
      type: [orderItemSchema],
      required: true,
      validate: {
        validator: (items) => items.length > 0,
        message: "Order must contain at least one item",
      },
    },
    shopId: {
      type: String,
      required: true,
      index: true,
    },
    shippingAddress: {
      type: Object,
      required: true,
    },
    user: {
      type: Object,
      required: true,
    },
    totalPrice: {
      type: Number,
      required: true,
      min: 0,
    },
    status: {
      type: String,
      enum: [
        "Processing",
        "Transferred to delivery partner",
        "Shipping",
        "Received",
        "On the way",
        "Delivered",
        "Cancelled",
      ],
      default: "Processing",
    },
    paymentInfo: {
      id: String,
      status: String,
      type: String,
    },
    paidAt: {
      type: Date,
    },
    deliveredAt: {
      type: Date,
    },
    inventoryRestored: {
      type: Boolean,
      default: false,
    },
    refundStatus: {
      type: String,
      enum: ["None", "Requested", "Processing", "Completed", "Rejected"],
      default: "None",
    },
    refundReason: {
      type: String,
      trim: true,
      maxlength: 1000,
    },
    refundRequestedAt: {
      type: Date,
    },
    refundedAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
