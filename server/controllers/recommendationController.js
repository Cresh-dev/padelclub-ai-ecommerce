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

    const prompt = `Sei un severo algoritmo tecnico di raccomandazione. NON sei un assistente vocale.

    DATI RICEVUTI:
    - Livello: ${preferences.skillLevel}
    - Stile: ${preferences.racketType}
    - Input Utente: ${preferences.objectives}
    - Altro: ${preferences.specialRequests || "Nessuna"}

    ATTENZIONE FONDAMENTALE: I "Dati Ricevuti" qui sopra potrebbero contenere frasi generate da un chatbot o dall'utente (es. "Fantastico!", "Ho capito", "Cerchi una..."). DEVI IGNORARE TUTTE QUESTE FRASI CONVERSAZIONALI. Non copiarle e non ripeterle MAI nell'output.

    CATALOGO DISPONIBILE:
    ${JSON.stringify(productList)}

    ISTRUZIONI: Seleziona i 3 prodotti migliori dal catalogo. Restituisci ESCLUSIVAMENTE un array JSON.
    Nel campo "reasoning" scrivi SOLO le specifiche tecniche reali del prodotto (peso, forma, materiali) e come aiutano il giocatore.
    - VIETATO usare parole come "Fantastico", "Perfetto", "Ecco", "Ho trovato".
    - VIETATO copiare o ripetere il testo dell'Input Utente. 
    - Ogni "reasoning" DEVE essere diverso e specifico per le caratteristiche di quel singolo prodotto.

    ESEMPIO DI OUTPUT OBBLIGATORIO (copia questa esatta struttura JSON):
    [
      {
        "productId": "id_del_prodotto_1",
        "reasoning": "La forma a diamante e la schiuma EVA rigida garantiscono l'esplosività necessaria per i tuoi smash, mantenendo la precisione richiesta dal tuo livello avanzato."
      },
      {
        "productId": "id_del_prodotto_2",
        "reasoning": "Questo modello rientra nel budget e offre un piatto ruvido in carbonio 12K, ottimo per massimizzare gli effetti e il controllo sui colpi lenti."
      }
    ]`;

    const model = getGeminiModel();
    const result = await model.generateContent(prompt);
    const responseText = result.response.text();

    let recommendations = [];
    try {
      const cleanedText = responseText
        .replace(/```json/gi, "")
        .replace(/```/g, "")
        .trim();

      recommendations = JSON.parse(cleanedText);
    } catch (parseError) {
      console.error(
        "Errore nel parsing JSON di Gemini. Testo ricevuto originale:",
        responseText,
      );
      throw new Error("L'IA ha restituito un formato non valido. Riprova.");
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
