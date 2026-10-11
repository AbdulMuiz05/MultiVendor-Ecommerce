const CoupounCode = require("../model/coupounCode");

const createCouponCode = async (req, res) => {
  try {
    const { name, value, minAmount, maxAmount } = req.body;
    const normalizedName = String(name || "").trim().toUpperCase();
    const numericValue = Number(value);
    const minimum = minAmount === undefined ? undefined : Number(minAmount);
    const maximum = maxAmount === undefined ? undefined : Number(maxAmount);

    if (!normalizedName || !Number.isFinite(numericValue) || numericValue <= 0) {
      return res.status(400).json({
        success: false,
        message: "Valid coupon name and discount value are required",
      });
    }

    if (
      minimum !== undefined &&
      (!Number.isFinite(minimum) || minimum < 0)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid minimum amount",
      });
    }

    if (
      maximum !== undefined &&
      (!Number.isFinite(maximum) || maximum < 0 || (minimum !== undefined && maximum < minimum))
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid maximum amount",
      });
    }

    const shop = req.seller;

    const existingCoupon = await CoupounCode.findOne({ name: normalizedName });

    if (existingCoupon) {
      return res.status(400).json({
        success: false,
        message: "Coupon code already exists",
      });
    }

    const coupon = await CoupounCode.create({
      name: normalizedName,
      value: numericValue,
      minAmount: minimum,
      maxAmount: maximum,
      shop,
    });

    res.status(201).json({
      success: true,
      coupon,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getCouponCodes = async (req, res) => {
  try {
    const coupons = await CoupounCode.find({
      "shop._id": req.seller._id,
    });

    res.status(200).json({
      success: true,
      coupons,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const deleteCouponCode = async (req, res) => {
  try {
    const coupon = await CoupounCode.findById(req.params.id);

    if (!coupon) {
      return res.status(404).json({
        success: false,
        message: "Coupon code not found",
      });
    }

    if (String(coupon.shop?._id) !== String(req.seller._id)) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to delete this coupon",
      });
    }

    await coupon.deleteOne();

    res.status(200).json({
      success: true,
      message: "Coupon code deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createCouponCode,
  getCouponCodes,
  deleteCouponCode,
};