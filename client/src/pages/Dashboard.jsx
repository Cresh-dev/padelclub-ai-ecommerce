import { useState, useEffect } from "react";
import api from "../services/api";
import ProductModal from "../components/ProductModal";

export default function Dashboard() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const { data } = await api.get("/recommendations");
      setHistory(data);
    } catch (error) {
      console.error("Errore nel recupero dello storico:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const isConfirmed = window.confirm(
      "Sei sicuro di voler eliminare questa ricerca?",
    );
    if (!isConfirmed) return;

    try {
      await api.delete(`/recommendations/${id}`);
      setHistory(history.filter((item) => item._id !== id));
    } catch (error) {
      console.error("Errore durante l'eliminazione:", error);
      alert("Errore durante l'eliminazione della ricerca.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-28 flex justify-center font-bold text-slate-500">
        Caricamento in corso...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pt-28 pb-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <h1 className="text-4xl font-black text-slate-900 mb-2">
          I tuoi Suggerimenti
        </h1>
        <p className="text-slate-500 mb-10">
          Storico delle raccomandazioni generate per te.
        </p>

        {history.length === 0 ? (
          <div className="bg-white rounded-3xl p-8 text-center border border-slate-200 shadow-sm">
            <p className="text-slate-500 font-bold">
              Non hai ancora generato raccomandazioni.
            </p>
          </div>
        ) : (
          <div className="space-y-8">
            {history.map((rec, i) => (
              <div
                key={rec._id}
                className="bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-sm transition-all hover:shadow-md"
              >
                <div className="bg-slate-900 p-6 flex justify-between items-start sm:items-center flex-col sm:flex-row gap-4 text-white">
                  <div>
                    <h3 className="text-xl font-bold">
                      Ricerca #{history.length - i}
                    </h3>
                    <p className="text-slate-400 text-sm mt-1">
                      {new Date(rec.createdAt).toLocaleDateString("it-IT", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="px-3 py-1.5 bg-white/10 rounded-lg text-xs font-bold whitespace-nowrap">
                      BUDGET: €{rec.preferences?.budget?.max || "N/A"}
                    </span>

                    <button
                      onClick={() => handleDelete(rec._id)}
                      className="p-2 bg-red-500/20 text-red-400 hover:bg-red-500 hover:text-white rounded-lg transition-colors ml-2"
                      title="Elimina questa ricerca"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                  </div>
                </div>

                <div className="p-6">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">
                    Prodotti Consigliati
                  </h4>

                  {!rec.recommendedProducts ||
                  rec.recommendedProducts.length === 0 ? (
                    <p className="text-slate-500 text-sm">
                      Nessun prodotto salvato per questa ricerca.
                    </p>
                  ) : (
                    <div className="space-y-4">
                      {rec.recommendedProducts.map((item, j) => {
                        const product = item.productId;
                        if (!product) return null;

                        return (
                          <div
                            key={j}
                            onClick={() => {
                              setSelectedProduct(product);
                              setIsModalOpen(true);
                            }}
                            className="flex flex-col sm:flex-row gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100 hover:border-orange-300 hover:shadow-md cursor-pointer transition-all"
                          >
                            <img
                              src={
                                product.image ||
                                "https://images.unsplash.com/photo-1622279457486-62dcc4a631d6?w=400&q=80"
                              }
                              alt={product.name}
                              className="w-24 h-24 sm:w-20 sm:h-20 object-cover rounded-xl bg-white border border-slate-200 shrink-0 mx-auto sm:mx-0"
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src =
                                  "https://images.unsplash.com/photo-1622279457486-62dcc4a631d6?w=400&q=80";
                              }}
                            />

                            <div className="flex-1 text-center sm:text-left">
                              <div className="flex flex-col sm:flex-row justify-between items-center sm:items-start">
                                <h5 className="font-bold text-slate-900">
                                  {product.name}
                                </h5>
                                <span className="text-orange-500 font-black sm:ml-2 mt-1 sm:mt-0">
                                  €{product.price.toFixed(2)}
                                </span>
                              </div>
                              <p className="text-sm text-slate-600 mt-2 leading-relaxed">
                                <span className="font-bold text-teal-600 text-xs uppercase tracking-wider block mb-1">
                                  Perché per te:
                                </span>
                                {item.reasoning}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <ProductModal
        product={selectedProduct}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
