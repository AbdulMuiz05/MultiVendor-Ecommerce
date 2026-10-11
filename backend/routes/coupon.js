const express = require("express");

const {
  createCouponCode,
  getCouponCodes,
  deleteCouponCode,
} = require("../controller/coupounCode");

const { isSeller } = require("../middleware/auth");

const router = express.Router();

router.post("/create-coupon-code", isSeller, createCouponCode);
router.get("/get-all-coupons", isSeller, getCouponCodes);
router.delete("/delete-coupon-code/:id", isSeller, deleteCouponCode);

module.exports = router;