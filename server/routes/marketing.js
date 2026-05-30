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

    // Sceglie casualmente la strategia per forzare varietà nelle offerte generate
    const strategies = [
      'SCONTO PERCENTUALE: usa discountType "percentage", scegli un valore tra 10% e 20%, e imposta una soglia minima di spesa tra 100€ e 200€.',
      'SCONTO FISSO IN EURO: usa discountType "fixed", scegli un valore tra 10€ e 25€, e imposta una soglia minima di spesa tra 100€ e 200€.',
      'BUNDLE (OMAGGIO): usa discountType "bundle", offri un prodotto omaggio fisico (es. palline, overgrip, fascia) se acquistano insieme due categorie specifiche.',
    ];
    const chosenStrategy = strategies[Math.floor(Math.random() * strategies.length)];

    const prompt = `
      Sei il Direttore Marketing (copywriter esperto) di un E-Commerce di Padel.
      Analizza questo storico di ricerche di un nostro utente:
      ${userProfile}

      Scrivi una campagna di marketing 1-to-1 ALTAMENTE PERSONALIZZATA per lui.
      REGOLE BUSINESS TASSATIVE:
      Non offrire MAI sconti incondizionati. Devi usare OBBLIGATORIAMENTE questa strategia specifica:
      ${chosenStrategy}
      Le categorie valide nel nostro database sono: 'Racchette', 'Calzature', 'Accessori', 'Abbigliamento', 'Borse'.

      RISPONDI ESATTAMENTE CON UN OGGETTO JSON VALIDO CON QUESTA STRUTTURA:
      {
        "subject": "Oggetto dell'email accattivante",
        "greeting": "Formula di apertura personalizzata",
        "body": "Il testo persuasivo che spiega chiaramente l'offerta e la CONDIZIONE (soglia minima o bundle)",
        "promoCode": "Codice promozionale univoco tutto maiuscolo (es. VIP150, BUNDLEVIP, VIPDEAL)",
        "condition": "La regola esatta in poche parole (es. 'Valido su ordini > 150€' o 'Valido acquistando Racchetta + Scarpe')",
        "callToAction": "Testo del bottone",
        "discountType": "tipo di sconto, inserire esattamente una di queste tre stringhe: 'percentage' (sconto percentuale), 'fixed' (sconto fisso in euro) o 'bundle' (regalo omaggio)",
        "discountValue": "numero intero che rappresenta il valore dello sconto (es. 10 per 10% o 15 per 15€). Se il tipo è 'bundle', metti 0",
        "minSpend": "soglia minima di spesa intera come numero (es. 150 o 200). Se non c'è una soglia minima di spesa, metti 0",
        "requiredCategories": "un array con le categorie esatte del database richieste per sbloccare l'offerta bundle (es. ['Racchette', 'Calzature']). Se non è un bundle, metti un array vuoto []",
        "bundleGift": "il nome del regalo omaggio se si tratta di un bundle (es. 'Tubo di palline Star Padel Pro' o 'Overgrip Babolat Tour'). Se non è un bundle, lascia stringa vuota ''"
      }
    `;

    const model = getGeminiModel();
    const result = await model.generateContent(prompt);
    const responseText = result.response.text();

    let campaignData;
    try {
      const cleanedText = responseText
        .replace(/```json/gi, "")
        .replace(/```/g, "")
        .trim();
      campaignData = JSON.parse(cleanedText);
    } catch (e) {
      console.error("Errore parsing JSON marketing:", e, responseText);
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
