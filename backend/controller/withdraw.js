const express = require("express");
const router = express.Router();

const Withdraw = require("../model/withdraw");
const Order = require("../model/order");
const { isSeller } = require("../middleware/auth");

router.post("/create-withdraw-request", isSeller, async (req, res) => {
  try {
    const amount = Number(req.body.amount);

    if (!Number.isFinite(amount) || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: "Withdrawal amount must be greater than zero",
      });
    }

    const deliveredOrders = await Order.find({
      shopId: String(req.seller._id),
      status: "Delivered",
      refundStatus: { $in: ["None", "Rejected"] },
    }).select("totalPrice");

    const grossEarnings = deliveredOrders.reduce(
      (sum, order) => sum + Number(order.totalPrice || 0),
      0
    );

    const withdrawals = await Withdraw.find({
      "seller._id": String(req.seller._id),
      status: { $in: ["Processing", "Approved", "Completed"] },
    }).select("amount");

    const committedWithdrawals = withdrawals.reduce(
      (sum, withdrawal) => sum + Number(withdrawal.amount || 0),
      0
    );

    const availableBalance = grossEarnings - committedWithdrawals;

    if (amount > availableBalance) {
      return res.status(400).json({
        success: false,
        message: `Insufficient withdrawal balance. Available: ${availableBalance.toFixed(2)}`,
      });
    }

    const pendingWithdrawal = await Withdraw.findOne({
      "seller._id": String(req.seller._id),
      status: "Processing",
    });

    if (pendingWithdrawal) {
      return res.status(409).json({
        success: false,
        message: "A withdrawal request is already being processed",
      });
    }

    const withdraw = await Withdraw.create({
      seller: {
        _id: String(req.seller._id),
        name: req.seller.name,
        email: req.seller.email,
      },
      amount,
    });

    res.status(201).json({
      success: true,
      withdraw,
      availableBalance: availableBalance - amount,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

router.get("/get-all-withdraws", isSeller, async (req, res) => {
  try {
    const withdraws = await Withdraw.find({
      "seller._id": String(req.seller._id),
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      withdraws,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

module.exports = router;
