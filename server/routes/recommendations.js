const express = require("express");
const Recommendation = require("../models/Recommendation");
const {
  generateRecommendations,
} = require("../controllers/recommendationController");
const authMiddleware = require("../middleware/auth");
const router = express.Router();

router.get("/", authMiddleware, async (req, res) => {
  try {
    const recommendations = await Recommendation.find({
      userId: req.userId,
    }).populate("recommendedProducts.productId");
    res.json(recommendations);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "Errore nel recupero delle raccomandazioni" });
  }
});

router.get("/:id", authMiddleware, async (req, res) => {
  try {
    const recommendation = await Recommendation.findById(
      req.params.id,
    ).populate("recommendedProducts.productId");
    if (!recommendation)
      return res.status(404).json({ error: "Raccomandazione non trovata" });
    if (recommendation.userId.toString() !== req.userId)
      return res.status(403).json({ error: "Non autorizzato" });
    res.json(recommendation);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Errore nel recupero" });
  }
});

router.post("/", authMiddleware, async (req, res) => {
  try {
    console.log("NUOVA ROTTA CHIAMATA! Dati ricevuti:", req.body);

    const { budget, skillLevel, racketType, objectives, specialRequests } =
      req.body;

    if (!budget || !skillLevel || !racketType || !objectives) {
      return res.status(400).json({
        error: "Errore nell'inserimento delle informazioni",
      });
    }

    const result = await generateRecommendations(req.userId, {
      budget,
      skillLevel,
      racketType,
      objectives,
      specialRequests,
    });

    res.status(201).json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Errore nella generazione delle raccomandazioni: " + error.message,
    });
  }
});

router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const deletedRec = await Recommendation.findOneAndDelete({
      _id: req.params.id,
      userId: req.userId,
    });

    if (!deletedRec) {
      return res
        .status(404)
        .json({ error: "Ricerca non trovata o non autorizzata." });
    }

    res.json({ success: true, message: "Ricerca eliminata con successo" });
  } catch (error) {
    console.error("Errore eliminazione:", error);
    res.status(500).json({ error: "Errore durante l'eliminazione." });
  }
});

module.exports = router;
