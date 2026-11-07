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

const canonicalPaymentType = (value) => {
  const type = String(value || "").trim();

  if (/^stripe$/i.test(type)) return "Stripe";
  if (/^cod$/i.test(type)) return "COD";

  return type;
};

const canonicalPaymentStatus = (value) => {
  const status = String(value || "").trim();
  const known = ["Pending", "Processing", "Paid", "Failed", "Refunded"];

  return (
    known.find((item) => item.toLowerCase() === status.toLowerCase()) || status
  );
};

const paymentInfoSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      default: "Pending",
      set: canonicalPaymentStatus,
    },
    type: {
      type: String,
      default: "COD",
      set: canonicalPaymentType,
    },
  },
  { _id: false }
);

const legacyPaymentInfo = (value) => {
  const text = String(value || "").trim();

  if (!text) {
    return { status: "Pending", type: "COD" };
  }

  if (/^pi_[A-Za-z0-9]+$/i.test(text)) {
    return { id: text, status: "Paid", type: "Stripe" };
  }

  const upper = text.toUpperCase();

  if (upper === "COD") {
    return { status: "Pending", type: "COD" };
  }

  if (upper === "STRIPE") {
    return { status: "Pending", type: "Stripe" };
  }

  if (["PENDING", "PROCESSING", "PAID", "FAILED", "REFUNDED"].includes(upper)) {
    return { status: canonicalPaymentStatus(text), type: "Stripe" };
  }

  return { id: text, status: "Paid", type: "Stripe" };
};

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
      type: paymentInfoSchema,
      default: () => ({ status: "Pending", type: "COD" }),
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

// Legacy orders stored paymentInfo as a primitive string because the old
// schema definition was interpreted as a String path.
orderSchema.pre("init", function (doc) {
  if (typeof doc.paymentInfo === "string") {
    doc.paymentInfo = legacyPaymentInfo(doc.paymentInfo);
    return;
  }

  if (doc.paymentInfo && typeof doc.paymentInfo === "object") {
    doc.paymentInfo = {
      ...(doc.paymentInfo.id ? { id: String(doc.paymentInfo.id) } : {}),
      status: canonicalPaymentStatus(doc.paymentInfo.status) || "Pending",
      type: canonicalPaymentType(doc.paymentInfo.type) || "COD",
    };
  }
});

orderSchema.index(
  { "paymentInfo.id": 1, shopId: 1 },
  {
    unique: true,
    partialFilterExpression: { "paymentInfo.id": { $exists: true } },
    name: "unique_payment_per_shop",
  }
);

orderSchema.set("toJSON", {
  transform: (doc, ret) => {
    (ret.cart || []).forEach((item) => {
      if (item.shop) delete item.shop.password;
    });
    return ret;
  },
});

module.exports = mongoose.model("Order", orderSchema);
