const express = require("express");
const authMiddleware = require("../middleware/auth");
const adminMiddleware = require("../middleware/adminMiddleware");
const User = require("../models/User");
const Product = require("../models/Product");
const Review = require("../models/Review");
const Recommendation = require("../models/Recommendation");

const router = express.Router();

// All routes require auth + admin
router.use(authMiddleware, adminMiddleware);

// GET /stats - Aggregated dashboard statistics
router.get("/stats", async (req, res) => {
  try {
    const [
      totalUsers,
      totalProducts,
      totalReviews,
      totalRecommendations,
      outOfStockProducts,
      avgRatingResult,
      productsByCategory,
    ] = await Promise.all([
      User.countDocuments(),
      Product.countDocuments(),
      Review.countDocuments(),
      Recommendation.countDocuments(),
      Product.countDocuments({ inStock: false }),
      Review.aggregate([
        { $group: { _id: null, avg: { $avg: "$rating" } } },
      ]),
      Product.aggregate([
        { $group: { _id: "$category", count: { $sum: 1 } } },
      ]),
    ]);

    const averageRating =
      avgRatingResult.length > 0
        ? Math.round(avgRatingResult[0].avg * 100) / 100
        : 0;

    res.json({
      totalUsers,
      totalProducts,
      totalReviews,
      totalRecommendations,
      averageRating,
      outOfStockProducts,
      productsByCategory,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Errore nel recupero delle statistiche." });
  }
});

// GET /users - All users (without passwords)
router.get("/users", async (req, res) => {
  try {
    const users = await User.find()
      .select("_id name email role skillLevel playStyle createdAt")
      .select("-password")
      .sort({ createdAt: -1 });

    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Errore nel recupero degli utenti." });
  }
});

// GET /products - All products with review stats
router.get("/products", async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 }).lean();

    // Get review stats for all products in one aggregation
    const reviewStats = await Review.aggregate([
      {
        $group: {
          _id: "$productId",
          reviewCount: { $sum: 1 },
          averageRating: { $avg: "$rating" },
        },
      },
    ]);

    // Map review stats by product ID for quick lookup
    const statsMap = {};
    reviewStats.forEach((stat) => {
      statsMap[stat._id.toString()] = {
        reviewCount: stat.reviewCount,
        averageRating: Math.round(stat.averageRating * 100) / 100,
      };
    });

    // Attach review stats to each product
    const productsWithStats = products.map((product) => ({
      ...product,
      reviewCount: statsMap[product._id.toString()]?.reviewCount || 0,
      averageRating: statsMap[product._id.toString()]?.averageRating || 0,
    }));

    res.json(productsWithStats);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Errore nel recupero dei prodotti." });
  }
});

// PUT /products/:id/trending - Toggle trending status
router.put("/products/:id/trending", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ error: "Prodotto non trovato." });
    }

    product.trending = !product.trending;
    await product.save();

    res.json(product);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "Errore nell'aggiornamento del trending." });
  }
});

// PUT /products/:id/stock - Toggle inStock status
router.put("/products/:id/stock", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ error: "Prodotto non trovato." });
    }

    product.inStock = !product.inStock;
    await product.save();

    res.json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Errore nell'aggiornamento dello stock." });
  }
});

// GET /reviews - All reviews with product info
router.get("/reviews", async (req, res) => {
  try {
    const reviews = await Review.find()
      .populate("productId", "name category")
      .sort({ createdAt: -1 });

    res.json(reviews);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Errore nel recupero delle recensioni." });
  }
});

// DELETE /reviews/:id - Delete a review
router.delete("/reviews/:id", async (req, res) => {
  try {
    const review = await Review.findByIdAndDelete(req.params.id);
    if (!review) {
      return res.status(404).json({ error: "Recensione non trovata." });
    }

    res.json({ success: true, message: "Recensione eliminata." });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "Errore nell'eliminazione della recensione." });
  }
});

// GET /analytics - Time-series data for charts (last 12 months)
router.get("/analytics", async (req, res) => {
  try {
    const twelveMonthsAgo = new Date();
    twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12);

    const [usersByMonth, reviewsByMonth, recommendationsByMonth] =
      await Promise.all([
        User.aggregate([
          { $match: { createdAt: { $gte: twelveMonthsAgo } } },
          {
            $group: {
              _id: {
                $dateToString: { format: "%Y-%m", date: "$createdAt" },
              },
              count: { $sum: 1 },
            },
          },
          { $sort: { _id: 1 } },
        ]),
        Review.aggregate([
          { $match: { createdAt: { $gte: twelveMonthsAgo } } },
          {
            $group: {
              _id: {
                $dateToString: { format: "%Y-%m", date: "$createdAt" },
              },
              count: { $sum: 1 },
            },
          },
          { $sort: { _id: 1 } },
        ]),
        Recommendation.aggregate([
          { $match: { createdAt: { $gte: twelveMonthsAgo } } },
          {
            $group: {
              _id: {
                $dateToString: { format: "%Y-%m", date: "$createdAt" },
              },
              count: { $sum: 1 },
            },
          },
          { $sort: { _id: 1 } },
        ]),
      ]);

    res.json({ usersByMonth, reviewsByMonth, recommendationsByMonth });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "Errore nel recupero dei dati analitici." });
  }
});

module.exports = router;
