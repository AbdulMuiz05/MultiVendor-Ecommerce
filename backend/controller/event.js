const express = require("express");
const router = express.Router();

const Event = require("../model/event");
const Shop = require("../model/shop");
const upload = require("../utils/upload");
const { uploadImages } = require("../utils/cloudinaryUpload");
const { isSeller } = require("../middleware/auth");

const parseNonNegativeNumber = (value) => {
  const number = Number(value);
  return Number.isFinite(number) && number >= 0 ? number : null;
};

const parseStock = (value) => {
  const stock = Number(value);
  return Number.isInteger(stock) && stock >= 0 ? stock : null;
};

router.post(
  "/create-event",
  isSeller,
  upload.array("images"),
  async (req, res) => {
    try {
      const {
        shopId,
        name,
        description,
        category,
        originalPrice,
        discountPrice,
        stock,
        start_Date,
        Finish_Date,
      } = req.body;

      if (
        !shopId ||
        !name ||
        !description ||
        !category ||
        !start_Date ||
        !Finish_Date
      ) {
        return res.status(400).json({
          success: false,
          message: "All required event fields must be provided",
        });
      }

      if (String(shopId) !== String(req.seller._id)) {
        return res.status(403).json({
          success: false,
          message: "You can only manage your own shop",
        });
      }

      const original = parseNonNegativeNumber(originalPrice);
      const discount = parseNonNegativeNumber(discountPrice);
      const stockValue = parseStock(stock);
      const startDate = new Date(start_Date);
      const finishDate = new Date(Finish_Date);

      if (
        discount === null ||
        stockValue === null ||
        Number.isNaN(startDate.getTime()) ||
        Number.isNaN(finishDate.getTime()) ||
        finishDate <= startDate
      ) {
        return res.status(400).json({
          success: false,
          message: "Invalid event price, stock or dates",
        });
      }

      if (original !== null && original < discount) {
        return res.status(400).json({
          success: false,
          message: "Original price cannot be lower than discount price",
        });
      }

      const shop = await Shop.findById(shopId);

      if (!shop) {
        return res.status(404).json({
          success: false,
          message: "Shop not found",
        });
      }

      const uploadedImages = await uploadImages(req.files || [], "eshop/events");
      const images = uploadedImages.map((image) => image.url);

      if (images.length === 0) {
        return res.status(400).json({
          success: false,
          message: "Please upload at least one event image",
        });
      }

      const event = await Event.create({
        name: String(name).trim(),
        description: String(description).trim(),
        category: String(category).trim(),
        originalPrice: original === null ? undefined : original,
        discountPrice: discount,
        stock: stockValue,
        shopId: String(shopId),
        shop,
        images,
        start_Date: startDate,
        Finish_Date: finishDate,
        status: "Running",
      });

      res.status(201).json({
        success: true,
        event,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }
);

router.get("/get-all-events-shop/:id", async (req, res) => {
  try {
    const events = await Event.find({
      shopId: req.params.id,
    }).sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      events,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

router.get("/get-all-events", async (req, res) => {
  try {
    const events = await Event.find().sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      events,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

router.delete(
  "/delete-shop-event/:id",
  isSeller,
  async (req, res) => {
    try {
      const event = await Event.findById(req.params.id);

      if (!event) {
        return res.status(404).json({
          success: false,
          message: "Event not found with this ID",
        });
      }

      if (String(event.shopId) !== String(req.seller._id)) {
        return res.status(403).json({
          success: false,
          message: "You can only delete your own items",
        });
      }

      await event.deleteOne();

      res.status(200).json({
        success: true,
        message: "Event deleted successfully",
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }
);

module.exports = router;
