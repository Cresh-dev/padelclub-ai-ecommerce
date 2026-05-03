const express = require("express");
const router = express.Router();
const Review = require("../models/Review");

router.get("/product/:productId", async (req, res) => {
  try {
    const reviews = await Review.find({
      productId: req.params.productId,
    }).sort({ createdAt: -1 });
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: "Errore nel caricamento recensioni" });
  }
});

router.get("/stats/:productId", async (req, res) => {
  try {
    const reviews = await Review.find({ productId: req.params.productId });

    if (reviews.length === 0) {
      return res.json({
        averageRating: 0,
        totalReviews: 0,
        distribution: [0, 0, 0, 0, 0],
      });
    }

    const totalRating = reviews.reduce((sum, r) => sum + r.rating, 0);
    const averageRating = (totalRating / reviews.length).toFixed(1);

    const distribution = [0, 0, 0, 0, 0];
    reviews.forEach((r) => {
      distribution[r.rating - 1]++;
    });

    res.json({
      averageRating,
      totalReviews: reviews.length,
      distribution,
    });
  } catch (error) {
    res.status(500).json({ message: "Errore nel calcolo statistiche" });
  }
});

router.post("/", async (req, res) => {
  try {
    const { productId, userName, rating, text } = req.body;

    if (!productId || !userName || !rating || !text) {
      return res.status(400).json({ message: "Campi obbligatori mancanti" });
    }

    const review = new Review({
      productId,
      userName,
      rating,
      text,
      verified: true,
    });

    await review.save();
    res.status(201).json(review);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Errore nella creazione della recensione" });
  }
});

module.exports = router;
