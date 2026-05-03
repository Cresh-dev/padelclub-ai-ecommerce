import { useState, useEffect } from "react";
import { productsAPI } from "../services/api";
import ProductCard from "../components/ProductCard";
import ProductModal from "../components/ProductModal";
import CatalogFilters from "../components/CatalogFilters";
import Footer from "../components/Footer";
import MultimodalSearch from "../components/MultimodalSearch";

export default function ProductsCatalog() {
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [currentFilters, setCurrentFilters] = useState({});
  const [aiAnalysis, setAiAnalysis] = useState(null);

  useEffect(() => {
    applyFilters();
  }, [currentFilters]);

  const applyFilters = async () => {
    try {
      setIsLoading(true);
      setAiAnalysis(null);
      const response = await productsAPI.getAll(currentFilters);
      setFilteredProducts(response.data);
    } catch (err) {
      console.error("Errore:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAiSearch = (aiProducts, analysisData) => {
    setFilteredProducts(aiProducts);
    setAiAnalysis(analysisData);
  };

  return (
    <div className="min-h-screen bg-slate-50 pt-20">
      <div className="bg-slate-900 py-16 px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight mb-4">
          Catalogo <span className="text-orange-500">Completo</span>
        </h1>
        <p className="text-lg text-slate-400 max-w-2xl mx-auto font-medium">
          Esplora la nostra selezione di racchette, scarpe e accessori. Usa i
          filtri o chiedi alla nostra IA l'attrezzatura perfetta per te.
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          <aside className="w-full lg:w-1/4">
            <div className="sticky top-28">
              <CatalogFilters onFiltersChange={setCurrentFilters} />
            </div>
          </aside>

          <main className="w-full lg:w-3/4">
            <MultimodalSearch onSearchResults={handleAiSearch} />

            {aiAnalysis && (
              <div className="mb-8 p-6 bg-teal-50 border border-teal-200 rounded-3xl text-teal-900 shadow-sm">
                <h4 className="font-black text-teal-800 uppercase tracking-wider text-xs mb-3 flex items-center gap-2">
                  <span>✨</span> Interpretazione IA
                </h4>
                <div className="flex flex-wrap gap-3">
                  {aiAnalysis.category && (
                    <span className="bg-white px-3 py-1 rounded-full text-sm font-bold border border-teal-100">
                      Categoria:{" "}
                      <span className="text-teal-600">
                        {aiAnalysis.category}
                      </span>
                    </span>
                  )}
                  {aiAnalysis.maxPrice && (
                    <span className="bg-white px-3 py-1 rounded-full text-sm font-bold border border-teal-100">
                      Budget Max:{" "}
                      <span className="text-teal-600">
                        €{aiAnalysis.maxPrice}
                      </span>
                    </span>
                  )}
                  {aiAnalysis.racketStyle && (
                    <span className="bg-white px-3 py-1 rounded-full text-sm font-bold border border-teal-100">
                      Stile:{" "}
                      <span className="text-teal-600">
                        {aiAnalysis.racketStyle}
                      </span>
                    </span>
                  )}
                  {aiAnalysis.searchTerms?.length > 0 && (
                    <span className="bg-white px-3 py-1 rounded-full text-sm font-bold border border-teal-100">
                      Keywords:{" "}
                      <span className="text-teal-600">
                        {aiAnalysis.searchTerms.join(", ")}
                      </span>
                    </span>
                  )}
                </div>
              </div>
            )}

            <div className="mb-6 flex justify-between items-center mt-2">
              <p className="text-sm font-bold text-slate-500 uppercase tracking-wider">
                {filteredProducts.length}{" "}
                {filteredProducts.length === 1
                  ? "Prodotto Trovato"
                  : "Prodotti Trovati"}
              </p>
            </div>

            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-20 text-slate-500">
                <div className="w-12 h-12 border-4 border-slate-200 border-t-orange-500 rounded-full animate-spin mb-4"></div>
                <p className="font-medium text-lg">Caricamento prodotti...</p>
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-sm">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-2xl font-bold text-slate-900 mb-2">
                  Nessun prodotto trovato
                </h3>
                <p className="text-slate-500">
                  Prova a modificare i termini di ricerca o i filtri.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product._id}
                    product={product}
                    onViewClick={(p) => {
                      setSelectedProduct(p);
                      setIsModalOpen(true);
                    }}
                  />
                ))}
              </div>
            )}
          </main>
        </div>
      </div>

      <Footer />
      <ProductModal
        product={selectedProduct}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
