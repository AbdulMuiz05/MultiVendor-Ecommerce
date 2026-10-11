const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const errorHandler = require("./middleware/error");
const connectDatabase = require("./db/Database");

const userRoutes = require("./routes/user");
const shopRoutes = require("./controller/shop");
const productRoutes = require("./controller/product");
const eventRoutes = require("./controller/event");
const orderRoutes = require("./controller/order");
const paymentRoutes = require("./controller/payment");
const messageRoutes = require("./controller/message");
const withdrawRoutes = require("./controller/withdraw");
const conversationRoutes = require("./routes/conversation");
const couponRoutes = require("./routes/coupon");
const adminRoutes = require("./controller/admin");

const app = express();

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(async (req, res, next) => {
  try {
    await connectDatabase();
    next();
  } catch (error) {
    next(error);
  }
});

app.use("/uploads", express.static("uploads"));

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Eshop backend is running",
  });
});

app.use("/api/v1/user", userRoutes);
app.use("/api/v1/shop", shopRoutes);
app.use("/api/v1/product", productRoutes);
app.use("/api/v1/event", eventRoutes);
app.use("/api/v1/order", orderRoutes);
app.use("/api/v1/payment", paymentRoutes);
app.use("/api/v1/message", messageRoutes);
app.use("/api/v1/withdraw", withdrawRoutes);
app.use("/api/v1/conversation", conversationRoutes);
app.use("/api/v1/coupon", couponRoutes);
app.use("/api/v1/admin", adminRoutes);

app.use(errorHandler);

module.exports = app;