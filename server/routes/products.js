const express = require("express");
const Product = require("../models/Product");
const authMiddleware = require("../middleware/auth");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    let filter = {};

    if (req.query.category && req.query.category !== "Tutte") {
      filter.category = req.query.category;
    }

    if (req.query.minPrice || req.query.maxPrice) {
      filter.price = {};
      if (req.query.minPrice) {
        filter.price.$gte = parseFloat(req.query.minPrice);
      }
      if (req.query.maxPrice) {
        filter.price.$lte = parseFloat(req.query.maxPrice);
      }
    }

    if (req.query.style && req.query.style !== "Tutte") {
      const styles = req.query.style.split(",").map((s) => s.trim());
      filter.style = { $in: styles };
    }

    if (req.query.inStock !== undefined) {
      filter.inStock = req.query.inStock === "true";
    }

    if (req.query.trending !== undefined) {
      filter.trending = req.query.trending === "true";
    }

    if (req.query.search) {
      filter.$or = [
        { name: { $regex: req.query.search, $options: "i" } },
        { description: { $regex: req.query.search, $options: "i" } },
      ];
    }

    const products = await Product.find(filter);
    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Errore nel recupero dei prodotti" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ error: "Prodotto non trovato" });
    }
    res.json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Errore nel recupero del prodotto" });
  }
});

router.post("/", authMiddleware, async (req, res) => {
  try {
    const { name, category, price, description, tags, style } = req.body;

    if (!name || !category || !price || !description) {
      return res.status(400).json({
        error: "Nome, categoria, prezzo e descrizione sono obbligatori",
      });
    }

    const product = new Product({
      name,
      category,
      price,
      description,
      tags: tags || [],
      style: style || [],
    });

    await product.save();
    res.status(201).json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Errore nella creazione del prodotto" });
  }
});

router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!product) {
      return res.status(404).json({ error: "Prodotto non trovato" });
    }
    res.json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Errore nella modifica del prodotto" });
  }
});

router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ error: "Prodotto non trovato" });
    }
    res.json({ message: "Prodotto eliminato" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Errore nella eliminazione del prodotto" });
  }
});

module.exports = router;
