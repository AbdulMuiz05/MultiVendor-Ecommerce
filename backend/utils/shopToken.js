const jwt = require("jsonwebtoken");

const sendShopToken = (shop, statusCode, res) => {
  const token = jwt.sign(
    {
      id: shop._id,
    },
    process.env.JWT_SECRET_KEY,
    {
      expiresIn: process.env.JWT_EXPIRE,
    }
  );

  res.cookie("seller_token", token, {
    expires: new Date(
      Date.now() + 90 * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  });

  res.status(statusCode).json({
    success: true,
    shop,
  });
};

module.exports = sendShopToken;