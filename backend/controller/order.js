const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();

const Order = require("../model/order");
const Product = require("../model/product");
const { isAuthenticated, isSeller } = require("../middleware/auth");

const normalizeQuantity = (value) => {
  const qty = Number(value);
  return Number.isInteger(qty) && qty > 0 ? qty : null;
};

router.post("/create-order", isAuthenticated, async (req, res) => {
  const session = await mongoose.startSession();

  try {
    const { cart, shippingAddress, paymentInfo = {} } = req.body;

    if (!Array.isArray(cart) || cart.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Cart is empty",
      });
    }

    if (!shippingAddress || typeof shippingAddress !== "object") {
      return res.status(400).json({
        success: false,
        message: "Shipping address is required",
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
      requestedItems.set(
        key,
        (requestedItems.get(key) || 0) + qty
      );
    }

    const productIds = [...requestedItems.keys()];
    const products = await Product.find({
      _id: { $in: productIds },
    }).session(session);

    if (products.length !== productIds.length) {
      return res.status(400).json({
        success: false,
        message: "One or more products no longer exist",
      });
    }

    const productMap = new Map(
      products.map((product) => [String(product._id), product])
    );

    const shopItemsMap = new Map();

    for (const [productId, qty] of requestedItems) {
      const product = productMap.get(productId);

      if (!product) {
        return res.status(404).json({
          success: false,
          message: "Product not found",
        });
      }

      if (!Number.isInteger(product.stock) || product.stock < qty) {
        return res.status(409).json({
          success: false,
          message: `Insufficient stock for ${product.name}`,
        });
      }

      const shopId = String(product.shopId);

      if (!shopItemsMap.has(shopId)) {
        shopItemsMap.set(shopId, []);
      }

      shopItemsMap.get(shopId).push({
        product,
        qty,
      });
    }

    const allItems = [...shopItemsMap.values()].flat();

    for (const { product } of allItems) {
      const unitPrice = Number(product.discountPrice);
      if (!Number.isFinite(unitPrice) || unitPrice < 0) {
        return res.status(400).json({
          success: false,
          message: `Invalid price for ${product.name}`,
        });
      }
    }

    const grandTotal = allItems.reduce(
      (sum, item) =>
        sum + Number(item.product.discountPrice) * Number(item.qty),
      0
    );

    const paymentType = String(paymentInfo.type || "COD").toUpperCase();

    if (!["COD", "STRIPE"].includes(paymentType)) {
      return res.status(400).json({
        success: false,
        message: "Invalid payment method",
      });
    }

    if (paymentType === "STRIPE") {
      if (!paymentInfo.id) {
        return res.status(400).json({
          success: false,
          message: "Stripe payment ID is required",
        });
      }

      const existingPaidOrder = await Order.findOne({
        "paymentInfo.id": paymentInfo.id,
        "user._id": req.user._id,
      }).session(session);

      if (existingPaidOrder) {
        return res.status(409).json({
          success: false,
          message: "This payment has already been used for an order",
        });
      }

      if (!process.env.STRIPE_SECRET_KEY) {
        return res.status(503).json({
          success: false,
          message: "Stripe is not configured",
        });
      }

      const Stripe = require("stripe");
      const stripe = Stripe(process.env.STRIPE_SECRET_KEY);
      const paymentIntent = await stripe.paymentIntents.retrieve(
        paymentInfo.id
      );

      const expectedAmount = Math.round(grandTotal * 100);

      if (
        paymentIntent.metadata?.userId !== String(req.user._id) ||
        paymentIntent.status !== "succeeded" ||
        paymentIntent.amount !== expectedAmount ||
        paymentIntent.currency !== "inr"
      ) {
        return res.status(400).json({
          success: false,
          message: "Stripe payment could not be verified",
        });
      }
    }

    let createdOrders = [];

    await session.withTransaction(async () => {
      for (const [shopId, items] of shopItemsMap) {
        const orderItems = [];
        let shopTotal = 0;

        for (const { product, qty } of items) {
          const updatedProduct = await Product.findOneAndUpdate(
            {
              _id: product._id,
              stock: { $gte: qty },
            },
            {
              $inc: {
                stock: -qty,
                sold_out: qty,
              },
            },
            {
              new: true,
              session,
            }
          );

          if (!updatedProduct) {
            throw new Error(`Insufficient stock for ${product.name}`);
          }

          const unitPrice = Number(updatedProduct.discountPrice);

          if (!Number.isFinite(unitPrice) || unitPrice < 0) {
            throw new Error(`Invalid price for ${updatedProduct.name}`);
          }

          shopTotal += unitPrice * qty;

          orderItems.push({
            _id: updatedProduct._id,
            name: updatedProduct.name,
            price: updatedProduct.discountPrice,
            originalPrice: updatedProduct.originalPrice,
            discountPrice: updatedProduct.discountPrice,
            qty,
            images: updatedProduct.images,
            shopId: updatedProduct.shopId,
            shop: updatedProduct.shop,
          });
        }

        const isPaid = paymentType === "STRIPE";

        const order = await Order.create(
          [
            {
              cart: orderItems,
              shopId,
              shippingAddress,
              user: {
                _id: req.user._id,
                name: req.user.name,
                email: req.user.email,
              },
              totalPrice: shopTotal,
              paymentInfo: {
                id: paymentInfo.id || undefined,
                status: paymentType === "STRIPE" ? "Paid" : "Pending",
                type: paymentType === "STRIPE" ? "Stripe" : "COD",
              },
              ...(isPaid ? { paidAt: new Date() } : {}),
            },
          ],
          { session }
        );

        createdOrders.push(order[0]);
      }
    });

    return res.status(201).json({
      success: true,
      orders: createdOrders,
      totalPrice: createdOrders.reduce(
        (sum, order) => sum + order.totalPrice,
        0
      ),
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  } finally {
    await session.endSession();
  }
});



router.post("/request-refund/:id", isAuthenticated, async (req, res) => {
  try {
    const order = await Order.findOne({
      _id: req.params.id,
      "user._id": req.user._id,
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    if (order.status !== "Delivered") {
      return res.status(400).json({
        success: false,
        message: "Refunds can only be requested for delivered orders",
      });
    }

    if (order.refundStatus !== "None") {
      return res.status(409).json({
        success: false,
        message: "A refund has already been requested for this order",
      });
    }

    const reason = String(req.body.reason || "").trim();

    if (!reason) {
      return res.status(400).json({
        success: false,
        message: "Refund reason is required",
      });
    }

    order.refundStatus = "Requested";
    order.refundReason = reason;
    order.refundRequestedAt = new Date();

    await order.save();

    res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

router.get("/get-all-orders/:userId", isAuthenticated, async (req, res) => {
  try {
    if (req.user._id.toString() !== req.params.userId) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to view these orders",
      });
    }

    const orders = await Order.find({
      "user._id": req.user._id,
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      orders,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

router.get("/get-order/:id", isAuthenticated, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    if (order.user?._id?.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to view this order",
      });
    }

    res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

router.get("/get-order-shop/:id", isSeller, async (req, res) => {
  try {
    const order = await Order.findOne({
      _id: req.params.id,
      shopId: req.seller._id.toString(),
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

router.get("/get-all-orders-shop/:shopId", isSeller, async (req, res) => {
  try {
    if (String(req.seller._id) !== String(req.params.shopId)) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to view these orders",
      });
    }

    const orders = await Order.find({
      shopId: req.seller._id.toString(),
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      orders,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

router.put("/update-order-status/:id", isSeller, async (req, res) => {
  try {
    const allowedStatuses = [
      "Processing",
      "Transferred to delivery partner",
      "Shipping",
      "Received",
      "On the way",
      "Delivered",
      "Cancelled",
    ];

    const transitions = {
      Processing: ["Transferred to delivery partner", "Cancelled"],
      "Transferred to delivery partner": ["Shipping", "Cancelled"],
      Shipping: ["On the way", "Cancelled"],
      "On the way": ["Received", "Delivered"],
      Received: ["Delivered"],
      Delivered: [],
      Cancelled: [],
    };

    const { status } = req.body;

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid order status",
      });
    }

    const order = await Order.findOne({
      _id: req.params.id,
      shopId: req.seller._id.toString(),
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found or not owned by this seller",
      });
    }

    if (!transitions[order.status]?.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Cannot change order status from ${order.status} to ${status}`,
      });
    }

    if (status === "Cancelled" && order.inventoryRestored) {
      return res.status(400).json({
        success: false,
        message: "Order inventory has already been restored",
      });
    }

    if (status === "Cancelled") {
      for (const item of order.cart) {
        await Product.updateOne(
          { _id: item._id },
          {
            $inc: {
              stock: item.qty,
              sold_out: -item.qty,
            },
          }
        );
      }
      order.inventoryRestored = true;
    }

    order.status = status;

    if (status === "Delivered") {
      order.deliveredAt = new Date();
      if (String(order.paymentInfo?.type || "").toUpperCase() === "COD") {
        order.paymentInfo.status = "Paid";
        order.paidAt = new Date();
      }
    }

    await order.save();

    res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

module.exports = router;
