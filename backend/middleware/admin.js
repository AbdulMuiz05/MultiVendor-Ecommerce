const jwt = require("jsonwebtoken");
const ErrorHandler = require("../utils/ErrorHandler");

const isAdmin = async (req, res, next) => {
  try {
    const { admin_token } = req.cookies;

    if (!admin_token) {
      return next(new ErrorHandler("Please login as admin to continue", 401));
    }

    if (!process.env.ADMIN_JWT_SECRET) {
      return next(new ErrorHandler("Admin authentication is not configured", 503));
    }

    const decoded = jwt.verify(admin_token, process.env.ADMIN_JWT_SECRET);

    if (decoded.role !== "admin") {
      return next(new ErrorHandler("Admin authorization required", 403));
    }

    req.admin = {
      email: decoded.email,
      role: decoded.role,
    };

    next();
  } catch (error) {
    return next(new ErrorHandler("Invalid or expired admin session", 401));
  }
};

module.exports = { isAdmin };
