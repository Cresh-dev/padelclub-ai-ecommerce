const { getGeminiModel } = require("../config/gemini");
const Product = require("../models/Product");
const Recommendation = require("../models/Recommendation");

const generateRecommendations = async (userId, preferences) => {
  try {
    const allProducts = await Product.find({
      price: {
        $gte: preferences.budget.min || 0,
        $lte: preferences.budget.max || 1000,
      },
    });

    if (allProducts.length === 0) {
      throw new Error("Nessun prodotto rientra nel budget selezionato.");
    }

    const productList = allProducts.map((p) => ({
      id: p._id,
      name: p.name,
      category: p.category,
      price: p.price,
      style: p.style,
    }));

    const prompt = `Sei un software algoritmico di raccomandazione tecnica. NON sei un chatbot. Non usare MAI un linguaggio conversazionale.

    DATI UTENTE:
    - Livello: ${preferences.skillLevel}
    - Stile: ${preferences.racketType}
    - Esigenze: ${preferences.objectives}
    - Richieste: ${preferences.specialRequests || "Nessuna"}

    CATALOGO DISPONIBILE:
    ${JSON.stringify(productList)}

    ISTRUZIONI: Seleziona i 3 prodotti migliori. Restituisci ESCLUSIVAMENTE un array JSON in formato testo puro. 
    Nel campo "reasoning" scrivi SOLO i dettagli tecnici che collegano il prodotto alle esigenze dell'utente.

    ESEMPIO DI OUTPUT OBBLIGATORIO:
    [
      {
        "productId": "id_del_prodotto_1",
        "reasoning": "La forma a lacrima e il bilanciamento medio si sposano perfettamente con la tua richiesta di una racchetta equilibrata. Il telaio in carbonio è ideale per un giocatore di livello avanzato."
      },
      {
        "productId": "id_del_prodotto_2",
        "reasoning": "Rientra perfettamente nel tuo budget di 250 euro offrendo un piatto ruvido, ottimo per massimizzare gli effetti come hai richiesto."
      }
    ]

    Genera il JSON per l'utente:`;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();

    let recommendations = [];
    try {
      recommendations = JSON.parse(responseText);
    } catch (parseError) {
      console.error("Errore nel parsing JSON di Gemini:", responseText);
      throw new Error("L'IA ha restituito un formato non valido.");
    }

    const recommendation = new Recommendation({
      userId,
      preferences,
      recommendedProducts: recommendations,
      geminiResponse: responseText,
    });

    await recommendation.save();

    return {
      success: true,
      recommendations: recommendations,
    };
  } catch (error) {
    console.error("Errore nella generazione delle raccomandazioni:", error);
    throw error;
  }
};

module.exports = { generateRecommendations };
