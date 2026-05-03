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

    const prompt = `Sei un esperto di attrezzatura da Padel. 
    Analizza questo profilo utente:
    - Livello: ${preferences.skillLevel}
    - Stile preferito: ${preferences.racketType}
    - Esigenze: ${preferences.objectives}
    - Richieste speciali: ${preferences.specialRequests || "Nessuna"}

    Ecco i prodotti disponibili nel catalogo:
    ${JSON.stringify(productList)}

    Seleziona i 3 migliori prodotti per questo utente. 
    DEVI rispondere ESATTAMENTE con un Array JSON valido, dove ogni oggetto ha due proprietà:
    "productId" (stringa, l'ID esatto del prodotto) e "reasoning" (stringa, una spiegazione accattivante di massimo 2 frasi sul perché è perfetto per l'utente).`;

    const model = getGeminiModel();
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
