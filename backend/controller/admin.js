const express = require("express");
const jwt = require("jsonwebtoken");

const User = require("../model/user");
const Shop = require("../model/shop");
const Product = require("../model/product");
const Event = require("../model/event");
const Order = require("../model/order");
const Withdraw = require("../model/withdraw");
const { isAdmin } = require("../middleware/admin");

const router = express.Router();

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    if (
      !process.env.ADMIN_EMAIL ||
      !process.env.ADMIN_PASSWORD ||
      !process.env.ADMIN_JWT_SECRET
    ) {
      return res.status(503).json({
        success: false,
        message: "Admin authentication is not configured",
      });
    }

    if (
      email.trim().toLowerCase() !==
        process.env.ADMIN_EMAIL.trim().toLowerCase() ||
      password !== process.env.ADMIN_PASSWORD
    ) {
      return res.status(401).json({
        success: false,
        message: "Invalid admin credentials",
      });
    }

    const token = jwt.sign(
      {
        email: process.env.ADMIN_EMAIL,
        role: "admin",
      },
      process.env.ADMIN_JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.cookie("admin_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite:
        process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      success: true,
      admin: {
        email: process.env.ADMIN_EMAIL,
        role: "admin",
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

router.get("/me", isAdmin, async (req, res) => {
  res.status(200).json({
    success: true,
    admin: req.admin,
  });
});

router.post("/logout", isAdmin, async (req, res) => {
  res.cookie("admin_token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite:
      process.env.NODE_ENV === "production" ? "none" : "lax",
  });

  res.status(200).json({
    success: true,
    message: "Admin logged out successfully",
  });
});

router.get("/users", isAdmin, async (req, res) => {
  const users = await User.find().select("-password").sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    users,
  });
});

router.get("/sellers", isAdmin, async (req, res) => {
  const sellers = await Shop.find().select("-password").sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    sellers,
  });
});

router.get("/products", isAdmin, async (req, res) => {
  const products = await Product.find().sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    products,
  });
});

router.get("/events", isAdmin, async (req, res) => {
  const events = await Event.find().sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    events,
  });
});

router.get("/orders", isAdmin, async (req, res) => {
  const orders = await Order.find().sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    orders,
  });
});



router.put("/orders/:id/refund", isAdmin, async (req, res) => {
  try {
    const { decision } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    if (order.refundStatus !== "Requested") {
      return res.status(400).json({
        success: false,
        message: "Order does not have a pending refund request",
      });
    }

    if (decision === "reject") {
      order.refundStatus = "Rejected";
      await order.save();

      return res.status(200).json({
        success: true,
        order,
      });
    }

    if (decision !== "approve") {
      return res.status(400).json({
        success: false,
        message: "Decision must be approve or reject",
      });
    }

    order.refundStatus = "Processing";
    await order.save();

    if (
      String(order.paymentInfo?.type || "").toLowerCase() === "stripe"
    ) {
      if (!process.env.STRIPE_SECRET_KEY || !order.paymentInfo?.id) {
        order.refundStatus = "Rejected";
        await order.save();

        return res.status(503).json({
          success: false,
          message: "Stripe refund cannot be processed",
        });
      }

      const Stripe = require("stripe");
      const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

      await stripe.refunds.create({
        payment_intent: order.paymentInfo.id,
        amount: Math.round(order.totalPrice * 100),
      });
    }

    order.refundStatus = "Completed";
    order.refundedAt = new Date();
    order.paymentInfo.status = "Refunded";
    await order.save();

    res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    const order = await Order.findById(req.params.id).catch(() => null);

    if (order && order.refundStatus === "Processing") {
      order.refundStatus = "Requested";
      await order.save().catch(() => {});
    }

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

router.get("/withdraws", isAdmin, async (req, res) => {
  const withdraws = await Withdraw.find().sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    withdraws,
  });
});

router.put("/withdraws/:id", isAdmin, async (req, res) => {
  const allowedStatuses = ["Processing", "Approved", "Rejected", "Completed"];
  const { status } = req.body;

  if (!allowedStatuses.includes(status)) {
    return res.status(400).json({
      success: false,
      message: "Invalid withdrawal status",
    });
  }

  const withdraw = await Withdraw.findById(req.params.id);

  if (!withdraw) {
    return res.status(404).json({
      success: false,
      message: "Withdrawal request not found",
    });
  }

  const withdrawalTransitions = {
    Processing: ["Approved", "Rejected"],
    Approved: ["Completed"],
    Rejected: [],
    Completed: [],
  };

  if (!withdrawalTransitions[withdraw.status]?.includes(status)) {
    return res.status(400).json({
      success: false,
      message: `Cannot change withdrawal status from ${withdraw.status} to ${status}`,
    });
  }

  withdraw.status = status;
  await withdraw.save();

  res.status(200).json({
    success: true,
    withdraw,
  });
});

module.exports = router;
