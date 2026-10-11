const express = require("express");
const router = express.Router();
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const { isAuthenticated } = require("../middleware/auth");

const Stripe = require("stripe");
const Product = require("../model/product");

const normalizeQuantity = (value) => {
  const qty = Number(value);
  return Number.isInteger(qty) && qty > 0 ? qty : null;
};

router.post(
  "/process",
  isAuthenticated,
  catchAsyncErrors(async (req, res) => {
    const { cart } = req.body;

    if (!Array.isArray(cart) || cart.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Cart is empty",
      });
    }

    const requestedItems = new Map();

    for (const item of cart) {
      if (!item?._id) {
        return res.status(400).json({
          success: false,
          message: "Invalid product in cart",
        });
      }

      const qty = normalizeQuantity(item.qty || 1);

      if (!qty) {
        return res.status(400).json({
          success: false,
          message: "Invalid product quantity",
        });
      }

      const key = String(item._id);
      requestedItems.set(key, (requestedItems.get(key) || 0) + qty);
    }

    const productIds = [...requestedItems.keys()];
    const products = await Product.find({ _id: { $in: productIds } }).select(
      "name discountPrice stock"
    );

    if (products.length !== productIds.length) {
      return res.status(400).json({
        success: false,
        message: "One or more products no longer exist",
      });
    }

    const productMap = new Map(
      products.map((product) => [String(product._id), product])
    );

    let total = 0;

    for (const [productId, qty] of requestedItems) {
      const product = productMap.get(productId);

      if (!product || !Number.isInteger(product.stock) || product.stock < qty) {
        return res.status(409).json({
          success: false,
          message: `Insufficient stock for ${product?.name || "product"}`,
        });
      }

      const unitPrice = Number(product.discountPrice);

      if (!Number.isFinite(unitPrice) || unitPrice < 0) {
        return res.status(400).json({
          success: false,
          message: `Invalid price for ${product.name}`,
        });
      }

      total += unitPrice * qty;
    }

    const amount = Math.round(total * 100);

    if (!Number.isInteger(amount) || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: "Cart total must be greater than zero",
      });
    }

    if (!process.env.STRIPE_SECRET_KEY) {
      return res.status(503).json({
        success: false,
        message: "Stripe is not configured",
      });
    }

    const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

    const myPayment = await stripe.paymentIntents.create({
      amount,
      currency: "inr",
      metadata: {
        company: "Eshop",
        userId: String(req.user._id),
      },
    });

    res.status(200).json({
      success: true,
      client_secret: myPayment.client_secret,
      amount,
      displayAmount: total,
    });
  })
);

router.get(
  "/stripeapikey",
  catchAsyncErrors(async (req, res) => {
    if (!process.env.STRIPE_API_KEY) {
      return res.status(503).json({
        success: false,
        message: "Stripe is not configured",
      });
    }

    res.status(200).json({
      success: true,
      stripeApikey: process.env.STRIPE_API_KEY,
    });
  })
);

module.exports = router;
