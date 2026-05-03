const express = require("express");
const router = express.Router();
const { getGeminiModel } = require("../config/gemini");
const Product = require("../models/Product");
const Recommendation = require("../models/Recommendation");
const authMiddleware = require("../middleware/auth");

router.post("/", authMiddleware, async (req, res) => {
  try {
    const { messages } = req.body;

    const chatHistory = messages
      .map((m) => `${m.sender === "user" ? "Utente" : "PadelBot"}: ${m.text}`)
      .join("\n");

    const prompt = `
      Sei PadelBot, il personal shopper amichevole e super esperto di un E-Commerce di Padel.
      Il tuo obiettivo è consigliare i prodotti perfetti all'utente. 
      Per farlo, DEVI capire 3 cose:
      1. Il suo livello di gioco (Principiante, Intermedio, Avanzato, Pro)
      2. Il suo budget massimo in euro
      3. Il suo stile o cosa sta cercando (Potenza, Controllo, Scarpe leggere, ecc.)

      Ecco lo storico della conversazione fino ad ora:
      ${chatHistory}

      REGOLE:
      - Sii molto breve, amichevole e fai UNA SOLA domanda alla volta. Non fare elenchi lunghi.
      - Se mancano delle informazioni, fai una domanda mirata per scoprirle.
      - Se hai capito TUTTO (livello, budget e cosa cerca), imposta "isComplete": true.

      RISPONDI ESATTAMENTE CON UN OGGETTO JSON VALIDO CON QUESTA STRUTTURA:
      {
        "isComplete": booleano,
        "reply": "La tua risposta",
        "preferences": {
          "maxPrice": numero,
          "skillLevel": "stringa",
          "searchTerms": ["parola1", "parola2"]
        }
      }
    `;

    const model = getGeminiModel();
    const result = await model.generateContent(prompt);

    let aiResponse;
    try {
      aiResponse = JSON.parse(result.response.text());
    } catch (e) {
      return res
        .status(500)
        .json({ error: "Errore di interpretazione dell'IA" });
    }

    let recommendedProducts = [];

    if (aiResponse.isComplete) {
      const dbQuery = {};
      if (aiResponse.preferences.maxPrice) {
        dbQuery.price = { $lte: aiResponse.preferences.maxPrice };
      }

      if (
        aiResponse.preferences.searchTerms &&
        aiResponse.preferences.searchTerms.length > 0
      ) {
        const regexTerms = aiResponse.preferences.searchTerms.map(
          (t) => new RegExp(t, "i"),
        );
        dbQuery.$or = [
          { name: { $in: regexTerms } },
          { category: { $in: regexTerms } },
          { style: { $in: regexTerms } },
        ];
      }

      recommendedProducts = await Product.find(dbQuery).limit(3);

      if (recommendedProducts.length > 0 && req.userId) {
        const newRec = new Recommendation({
          userId: req.userId,
          preferences: {
            budget: { min: 0, max: aiResponse.preferences.maxPrice || 0 },
            skillLevel: aiResponse.preferences.skillLevel || "N/A",
            racketType:
              aiResponse.preferences.searchTerms?.join(", ") || "Chatbot",
            objectives: "Consigliato da PadelBot",
          },
          recommendedProducts: recommendedProducts.map((p) => ({
            productId: p._id,
            reasoning: aiResponse.reply,
          })),
        });
        await newRec.save();
      }
    }

    res.json({
      reply: aiResponse.reply,
      isComplete: aiResponse.isComplete,
      products: recommendedProducts,
    });
  } catch (error) {
    console.error("Errore Chatbot:", error);
    res.status(500).json({ error: "Errore interno." });
  }
});

module.exports = router;
