const express = require("express");
const router = express.Router();
const User = require("../models/User");
const authMiddleware = require("../middleware/auth");

router.get("/me", authMiddleware, async (req, res) => {
  try {
    const player = await User.findById(req.userId).populate("gear");
    res.json(player);
  } catch (error) {
    res.status(500).json({ error: "Errore caricamento dati giocatore" });
  }
});

router.put("/update", authMiddleware, async (req, res) => {
  try {
    const { username, playStyle, position, skillLevel, gear } = req.body;

    if (username) {
      const existingUser = await User.findOne({
        username: username.toLowerCase(),
      });
      if (existingUser && existingUser._id.toString() !== req.userId) {
        return res.status(400).json({ error: "Questo username è già in uso." });
      }
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.userId,
      {
        $set: {
          username: username
            ? username.toLowerCase().replace(/\s+/g, "")
            : undefined,
          playStyle,
          position,
          skillLevel,
          gear,
        },
      },
      { returnDocument: "after" },
    )
      .select("-password")
      .populate("gear");

    res.json(updatedUser);
  } catch (error) {
    console.error("Errore aggiornamento:", error);
    res.status(500).json({ error: "Errore durante il salvataggio." });
  }
});

router.get("/:username", async (req, res) => {
  try {
    const player = await User.findOne({
      username: req.params.username.toLowerCase(),
    })
      .select("name username playStyle position skillLevel gear createdAt")
      .populate("gear");

    if (!player) {
      return res.status(404).json({ error: "Giocatore non trovato." });
    }

    res.json(player);
  } catch (error) {
    res.status(500).json({ error: "Errore server." });
  }
});

module.exports = router;
