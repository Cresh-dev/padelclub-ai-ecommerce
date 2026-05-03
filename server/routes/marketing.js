const express = require("express");
const router = express.Router();
const { getGeminiModel } = require("../config/gemini");
const Recommendation = require("../models/Recommendation");
const authMiddleware = require("../middleware/auth");

router.get("/generate", authMiddleware, async (req, res) => {
  try {
    const history = await Recommendation.find({ userId: req.userId });

    if (!history || history.length === 0) {
      return res.status(400).json({
        error:
          "Non abbiamo ancora abbastanza dati su di te! Chatta un po' con PadelBot per farti conoscere meglio.",
      });
    }

    const userProfile = history
      .map(
        (h, index) =>
          `Ricerca ${index + 1}: Livello ${h.preferences.skillLevel}, Budget max €${h.preferences.budget.max}, Cerca: ${h.preferences.racketType}`,
      )
      .join(" | ");

    const prompt = `
      Sei il Direttore Marketing (copywriter esperto) di un E-Commerce di Padel.
      Analizza questo storico di ricerche di un nostro utente:
      ${userProfile}

      Scrivi una campagna di marketing 1-to-1 ALTAMENTE PERSONALIZZATA per lui.
      REGOLE BUSINESS TASSATIVE:
      Non offrire MAI sconti incondizionati. Devi scegliere UNA di queste due strategie per garantire profitto:
      1. SCONTO CON SOGLIA: Offri un codice sconto (es. 10% o 15€) valido SOLO per ordini superiori a una certa cifra (es. 150€ o 200€).
      2. BUNDLE (PACCHETTO): Offri un vantaggio (es. un omaggio o uno sconto extra) SOLO se acquista due prodotti combinati (es. "Acquista la racchetta e le scarpe insieme e ti regaliamo il tubo di palline").

      RISPONDI ESATTAMENTE CON UN OGGETTO JSON VALIDO CON QUESTA STRUTTURA:
      {
        "subject": "Oggetto dell'email accattivante",
        "greeting": "Formula di apertura personalizzata",
        "body": "Il testo persuasivo che spiega chiaramente l'offerta e la CONDIZIONE (soglia minima o bundle)",
        "promoCode": "Codice (es. VIP150 o BUNDLEVIP)",
        "condition": "La regola esatta in poche parole (es. 'Valido su ordini > 150€' o 'Valido acquistando Racchetta + Scarpe')",
        "callToAction": "Testo del bottone"
      }
    `;

    const model = getGeminiModel();
    const result = await model.generateContent(prompt);

    let campaignData;
    try {
      campaignData = JSON.parse(result.response.text());
    } catch (e) {
      return res
        .status(500)
        .json({ error: "Errore di generazione marketing." });
    }

    res.json(campaignData);
  } catch (error) {
    console.error("Errore Marketing:", error);
    res
      .status(500)
      .json({ error: "Errore durante la creazione della campagna." });
  }
});

module.exports = router;
