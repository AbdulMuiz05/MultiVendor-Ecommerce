const express = require("express");
const jwt = require("jsonwebtoken");

const Shop = require("../model/shop");
const sendMail = require("../utils/sendMail");
const sendShopToken = require("../utils/shopToken");
const ErrorHandler = require("../utils/ErrorHandler");
const { isSeller } = require("../middleware/auth");

const router = express.Router();

const createActivationToken = (shopId) => {
  return jwt.sign(
    { id: shopId, purpose: "shop-activation" },
    process.env.ACTIVATION_SECRET,
    { expiresIn: "5m" }
  );
};

router.post("/create-shop", async (req, res, next) => {
  try {
    const {
      name,
      email,
      password,
      phoneNumber,
      address,
      zipCode,
      avatar,
    } = req.body;

    if (!name || !email || !password) {
      return next(
        new ErrorHandler("Please provide all required fields", 400)
      );
    }

    const existingShop = await Shop.findOne({ email });

    if (existingShop) {
      return next(new ErrorHandler("Shop already exists", 400));
    }

    const shop = await Shop.create({
      name,
      email,
      password,
      phoneNumber,
      address,
      zipCode,
      avatar,
      isActive: false,
    });

    const activationToken = createActivationToken(shop._id);

    const activationUrl = `${process.env.FRONTEND_URL}/seller/activation/${activationToken}`;

    await sendMail({
      email: shop.email,
      subject: "Activate your shop",
      message: `
        <h1>Hello ${shop.name}</h1>
        <p>Please click on the link below to activate your shop:</p>
        <a href="${activationUrl}">${activationUrl}</a>
      `,
    });

    res.status(201).json({
      success: true,
      message: `Please check your email: ${shop.email} to activate your shop.`,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
});

router.post("/activate-shop", async (req, res, next) => {
  try {
    const { activation_token } = req.body;

    if (!activation_token) {
      return next(new ErrorHandler("Activation token is required", 400));
    }

    const decoded = jwt.verify(
      activation_token,
      process.env.ACTIVATION_SECRET
    );

    if (decoded.purpose !== "shop-activation" || !decoded.id) {
      return next(new ErrorHandler("Invalid activation token", 400));
    }

    const shop = await Shop.findById(decoded.id);

    if (!shop) {
      return next(new ErrorHandler("Shop not found", 404));
    }

    if (shop.isActive) {
      return next(new ErrorHandler("Shop is already activated", 400));
    }

    shop.isActive = true;
    await shop.save();

    sendShopToken(shop, 201, res);
  } catch (error) {
    return next(new ErrorHandler(error.message, 400));
  }
});

router.post("/login-shop", async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return next(
        new ErrorHandler("Please provide email and password", 400)
      );
    }

    const shop = await Shop.findOne({ email }).select("+password");

    if (!shop) {
      return next(new ErrorHandler("Shop not found", 400));
    }

    if (!shop.isActive) {
      return next(new ErrorHandler("Please activate your shop first", 403));
    }

    const isPasswordValid = await shop.comparePassword(password);

    if (!isPasswordValid) {
      return next(new ErrorHandler("Invalid email or password", 400));
    }

    sendShopToken(shop, 200, res);
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
});

router.get("/get-seller", isSeller, async (req, res) => {
  res.status(200).json({
    success: true,
    seller: req.seller,
  });
});

router.put("/update-shop-info", isSeller, async (req, res, next) => {
  try {
    const shop = await Shop.findById(req.seller._id);

    if (!shop) {
      return next(new ErrorHandler("Shop not found", 404));
    }

    const {
      name,
      email,
      phoneNumber,
      address,
      zipCode,
      description,
      avatar,
    } = req.body;

    if (name !== undefined) shop.name = name;
    if (email !== undefined) shop.email = email;
    if (phoneNumber !== undefined) shop.phoneNumber = phoneNumber;
    if (address !== undefined) shop.address = address;
    if (zipCode !== undefined) shop.zipCode = zipCode;
    if (description !== undefined) shop.description = description;
    if (avatar !== undefined) shop.avatar = avatar;

    await shop.save();

    res.status(200).json({
      success: true,
      shop,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
});

router.post("/logout", isSeller, async (req, res) => {
  res.cookie("seller_token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });

  res.status(200).json({
    success: true,
    message: "Logged out successfully",
  });
});

module.exports = router;