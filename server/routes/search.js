const express = require("express");
const Product = require("../models/Product");
const { getGeminiModel } = require("../config/gemini");
const router = express.Router();

router.post("/multimodal", async (req, res) => {
  try {
    const { textQuery, imageBase64 } = req.body;

    if (!textQuery && !imageBase64) {
      return res
        .status(400)
        .json({ error: "Fornisci un testo o un'immagine per cercare." });
    }

    const prompt = `
      Sei il motore di ricerca intelligente di un E-Commerce di Padel.
      Analizza la richiesta dell'utente.
      - Testo dell'utente (che può derivare da voce o tastiera): "${textQuery || "Nessun testo fornito"}"
      - Immagine: se allegata, analizzala per capire di che prodotto si tratta (es. colore, forma, categoria).
      
      Estrai l'intento di ricerca e restituisci ESATTAMENTE un oggetto JSON valido con questi campi (usa null se l'informazione non c'è):
      {
        "category": "Stringa (solo se capisci che cerca 'Racchette', 'Scarpe', 'Abbigliamento' o 'Accessori')",
        "maxPrice": "Numero (es. se dice 'sotto i 100 euro' scrivi 100)",
        "racketStyle": "Stringa (es. 'Potenza', 'Controllo' o 'Equilibrato')",
        "searchTerms": ["Array di stringhe con le parole chiave principali, es. 'rosso', 'Babolat', 'leggera'"]
      }
    `;

    const model = getGeminiModel();
    let result;

    if (imageBase64) {
      const mimeType = imageBase64.split(";")[0].split(":")[1];
      const base64Data = imageBase64.split(",")[1];

      const imagePart = {
        inlineData: { data: base64Data, mimeType },
      };

      result = await model.generateContent([prompt, imagePart]);
    } else {
      result = await model.generateContent(prompt);
    }

    const responseText = result.response.text();
    let aiAnalysis;
    try {
      aiAnalysis = JSON.parse(responseText);
    } catch (e) {
      console.error("Errore nel parsing JSON di Gemini:", responseText);
      return res
        .status(500)
        .json({ error: "Errore di interpretazione dell'IA." });
    }

    let dbQuery = {};

    if (aiAnalysis.category) {
      dbQuery.category = { $regex: new RegExp(aiAnalysis.category, "i") };
    }

    if (aiAnalysis.maxPrice) {
      dbQuery.price = { $lte: aiAnalysis.maxPrice };
    }

    if (aiAnalysis.searchTerms && aiAnalysis.searchTerms.length > 0) {
      const regexArray = aiAnalysis.searchTerms.map(
        (term) => new RegExp(term, "i"),
      );
      dbQuery.$or = [
        { name: { $in: regexArray } },
        { style: { $in: regexArray } },
      ];
    }

    const products = await Product.find(dbQuery).limit(12);

    res.json({
      success: true,
      aiAnalysis,
      results: products,
    });
  } catch (error) {
    console.error("Errore ricerca multimodale:", error);
    res.status(500).json({ error: "Errore interno durante la ricerca." });
  }
});

module.exports = router;
