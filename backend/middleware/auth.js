const jwt = require("jsonwebtoken");

const User = require("../model/user");
const Shop = require("../model/shop");
const ErrorHandler = require("../utils/ErrorHandler");

const isAuthenticated = async (req, res, next) => {
  try {
    const { token } = req.cookies;

    if (!token) {
      return next(new ErrorHandler("Please login to continue", 401));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

    const user = await User.findById(decoded.id);

    if (!user) {
      return next(new ErrorHandler("User no longer exists", 401));
    }

    if (user.isActive === false) {
      return next(new ErrorHandler("Account is not activated", 403));
    }

    req.user = user;

    next();
  } catch (error) {
    return next(new ErrorHandler("Invalid or expired token", 401));
  }
};

const isSeller = async (req, res, next) => {
  try {
    const { seller_token } = req.cookies;

    if (!seller_token) {
      return next(new ErrorHandler("Please login as a seller to continue", 401));
    }

    const decoded = jwt.verify(
      seller_token,
      process.env.JWT_SECRET_KEY
    );

    const seller = await Shop.findById(decoded.id);

    if (!seller) {
      return next(new ErrorHandler("Seller no longer exists", 401));
    }

    if (seller.isActive === false) {
      return next(new ErrorHandler("Shop is not activated", 403));
    }

    req.seller = seller;

    next();
  } catch (error) {
    return next(new ErrorHandler("Invalid or expired seller token", 401));
  }
};


const isAuthenticatedOrSeller = async (req, res, next) => {
  try {
    if (req.cookies?.token) {
      const decoded = jwt.verify(req.cookies.token, process.env.JWT_SECRET_KEY);
      const user = await User.findById(decoded.id);

      if (!user) {
        return next(new ErrorHandler("User no longer exists", 401));
      }

      if (user.isActive === false) {
        return next(new ErrorHandler("Account is not activated", 403));
      }

      req.user = user;
      req.authType = "user";
      return next();
    }

    if (req.cookies?.seller_token) {
      const decoded = jwt.verify(
        req.cookies.seller_token,
        process.env.JWT_SECRET_KEY
      );
      const seller = await Shop.findById(decoded.id);

      if (!seller) {
        return next(new ErrorHandler("Seller no longer exists", 401));
      }

      if (seller.isActive === false) {
        return next(new ErrorHandler("Shop is not activated", 403));
      }

      req.seller = seller;
      req.authType = "seller";
      return next();
    }

    return next(new ErrorHandler("Please login to continue", 401));
  } catch (error) {
    return next(new ErrorHandler("Invalid or expired token", 401));
  }
};

module.exports = {
  isAuthenticated,
  isSeller,
  isAuthenticatedOrSeller,
};