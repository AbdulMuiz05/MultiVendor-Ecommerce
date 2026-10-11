const mongoose = require("mongoose");

const withdrawSchema = new mongoose.Schema(
  {
    seller: {
      _id: {
        type: String,
        required: true,
        index: true,
      },
      name: String,
      email: String,
    },
    amount: {
      type: Number,
      required: true,
      min: 0.01,
    },
    status: {
      type: String,
      enum: ["Processing", "Approved", "Rejected", "Completed"],
      default: "Processing",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Withdraw", withdrawSchema);
