import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { productsAPI } from "../services/api";
import ProductCard from "../components/ProductCard";
import ProductModal from "../components/ProductModal";
import Footer from "../components/Footer";

export default function Home({ isAuthenticated }) {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const response = await productsAPI.getAll({ trending: true });
      setProducts(response.data.slice(0, 6));
    } catch (error) {
      console.error("Errore:", error);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 selection:bg-orange-500 selection:text-white">
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden bg-slate-950">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1622279457486-640cae6f4c98?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center opacity-20 mix-blend-overlay"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center z-10">
          <h1 className="text-5xl md:text-7xl font-black text-white tracking-tight mb-6">
            Padel Gear, <br className="md:hidden" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-teal-400">
              AI-Powered.
            </span>
          </h1>
          <p className="mt-4 text-lg md:text-xl text-slate-300 max-w-2xl mx-auto mb-10 font-medium leading-relaxed">
            Smetti di indovinare. Scopri l'attrezzatura padel perfetta per il
            tuo stile di gioco con le nostre raccomandazioni basate
            sull'Intelligenza Artificiale.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/shop"
              className="px-8 py-4 text-base font-bold text-slate-900 bg-white rounded-2xl hover:scale-105 transition-transform shadow-xl"
            >
              Esplora il Catalogo
            </Link>
            <Link
              to="/recommendations"
              className="px-8 py-4 text-base font-bold text-white bg-orange-500 rounded-2xl hover:scale-105 transition-transform shadow-xl shadow-orange-500/20"
            >
              ✨ Prova l'IA Gratis
            </Link>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                emoji: "🤖",
                title: "Consigliati dall'IA",
                desc: "Analizziamo il tuo livello e stile per proporti solo il meglio.",
              },
              {
                emoji: "🎯",
                title: "Filtri Avanzati",
                desc: "Trova la racchetta perfetta in base a bilanciamento, peso e forma.",
              },
              {
                emoji: "⚡️",
                title: "Veloce & Affidabile",
                desc: "Spedizioni rapide e resi gratuiti su tutto il catalogo.",
              },
            ].map((feature, idx) => (
              <div
                key={idx}
                className="bg-slate-50 rounded-3xl p-8 border border-slate-100 hover:border-orange-500/30 transition-colors"
              >
                <div className="text-4xl mb-6 bg-white w-16 h-16 flex items-center justify-center rounded-2xl shadow-sm">
                  {feature.emoji}
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-slate-600 font-medium leading-relaxed">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
                Trending Now 🔥
              </h2>
              <p className="text-slate-500 mt-2 font-medium">
                I prodotti più cercati e acquistati del momento.
              </p>
            </div>
            <Link
              to="/shop"
              className="hidden sm:inline-block font-bold text-orange-500 hover:text-orange-600 transition-colors"
            >
              Vedi tutto il catalogo →
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product) => (
              <ProductCard
                key={product._id}
                product={product}
                onViewClick={() => {
                  setSelectedProduct(product);
                  setIsModalOpen(true);
                }}
              />
            ))}
          </div>

          <div className="mt-10 text-center sm:hidden">
            <Link
              to="/shop"
              className="font-bold text-orange-500 hover:text-orange-600"
            >
              Vedi tutto il catalogo →
            </Link>
          </div>
        </div>
      </section>

      <Footer />
      <ProductModal
        product={selectedProduct}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
