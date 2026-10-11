const express = require("express");
const router = express.Router();

const Product = require("../model/product");
const Shop = require("../model/shop");
const upload = require("../utils/upload");
const { uploadImages } = require("../utils/cloudinaryUpload");
const { isSeller, isAuthenticated } = require("../middleware/auth");

const parseNonNegativeNumber = (value) => {
  const number = Number(value);
  return Number.isFinite(number) && number >= 0 ? number : null;
};

const parseStock = (value) => {
  const stock = Number(value);
  return Number.isInteger(stock) && stock >= 0 ? stock : null;
};

router.post(
  "/create-product",
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
      } = req.body;

      if (!shopId || !name || !description || !category) {
        return res.status(400).json({
          success: false,
          message: "Name, description, category and shop are required",
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

      if (discount === null || stockValue === null) {
        return res.status(400).json({
          success: false,
          message: "Valid price and stock values are required",
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

      const uploadedImages = await uploadImages(req.files || [], "eshop/products");
      const images = uploadedImages.map((image) => image.url);

      if (images.length === 0) {
        return res.status(400).json({
          success: false,
          message: "Please upload at least one product image",
        });
      }

      const product = await Product.create({
        name: String(name).trim(),
        description: String(description).trim(),
        category: String(category).trim(),
        originalPrice: original === null ? undefined : original,
        discountPrice: discount,
        stock: stockValue,
        shopId: String(shopId),
        shop,
        images,
      });

      res.status(201).json({
        success: true,
        product,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }
);


router.post("/add-review/:id", isAuthenticated, async (req, res) => {
  try {
    const rating = Number(req.body.rating);
    const message = String(req.body.message || "").trim();

    if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: "Rating must be an integer from 1 to 5",
      });
    }

    if (!message) {
      return res.status(400).json({
        success: false,
        message: "Review message is required",
      });
    }

    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    const alreadyReviewed = product.reviews.some(
      (review) => String(review.user?._id) === String(req.user._id)
    );

    if (alreadyReviewed) {
      return res.status(409).json({
        success: false,
        message: "You have already reviewed this product",
      });
    }

    product.reviews.push({
      user: {
        _id: req.user._id,
        name: req.user.name,
        avatar: req.user.avatar,
      },
      rating,
      message,
      productId: product._id,
    });

    const total = product.reviews.reduce(
      (sum, review) => sum + Number(review.rating || 0),
      0
    );

    product.ratings =
      product.reviews.length > 0 ? total / product.reviews.length : 0;

    await product.save();

    res.status(201).json({
      success: true,
      product,
      reviews: product.reviews,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

router.delete("/delete-review/:id/:reviewId", isAuthenticated, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    const review = product.reviews.id(req.params.reviewId);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found",
      });
    }

    if (String(review.user?._id) !== String(req.user._id)) {
      return res.status(403).json({
        success: false,
        message: "You can only delete your own review",
      });
    }

    review.deleteOne();

    const total = product.reviews.reduce(
      (sum, item) => sum + Number(item.rating || 0),
      0
    );

    product.ratings =
      product.reviews.length > 0 ? total / product.reviews.length : 0;

    await product.save();

    res.status(200).json({
      success: true,
      product,
      reviews: product.reviews,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

router.get("/get-all-products", async (req, res) => {
  try {
    const filter = {};

    if (req.query.category) {
      filter.category = req.query.category;
    }

    const products = await Product.find(filter).sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      products,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

router.get("/get-product/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

router.get("/get-all-products-shop/:id", async (req, res) => {
  try {
    const products = await Product.find({
      shopId: req.params.id,
    }).sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      products,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

router.delete(
  "/delete-shop-product/:id",
  isSeller,
  async (req, res) => {
    try {
      const product = await Product.findById(req.params.id);

      if (!product) {
        return res.status(404).json({
          success: false,
          message: "Product not found",
        });
      }

      if (String(product.shopId) !== String(req.seller._id)) {
        return res.status(403).json({
          success: false,
          message: "You can only delete your own items",
        });
      }

      await product.deleteOne();

      res.status(200).json({
        success: true,
        message: "Product deleted successfully",
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
