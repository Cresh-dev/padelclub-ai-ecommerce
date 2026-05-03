import ProductReviews from "./ProductReviews";
import { useGlobal } from "../context/GlobalContext";

export default function ProductModal({ product, isOpen, onClose }) {
  const { addToCart } = useGlobal();
  if (!isOpen || !product) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-sm transition-opacity"
      onClick={onClose}
    >
      <div
        className="relative bg-white rounded-3xl w-full max-w-5xl max-h-[95vh] overflow-y-auto shadow-2xl flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-10 h-10 bg-white/80 backdrop-blur border border-slate-200 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-full flex items-center justify-center transition-colors shadow-sm font-bold"
        >
          ✕
        </button>

        <div className="flex flex-col lg:flex-row gap-8 p-6 sm:p-10">
          <div className="w-full lg:w-1/2">
            <div className="aspect-square rounded-2xl bg-slate-50 overflow-hidden relative border border-slate-100">
              <img
                src={product.image || "https://via.placeholder.com/600"}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              {product.trending && (
                <div className="absolute top-4 left-4 bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 py-1.5 rounded-full text-xs font-black tracking-wider shadow-lg">
                  🔥 TRENDING
                </div>
              )}
            </div>
          </div>

          <div className="w-full lg:w-1/2 flex flex-col justify-center">
            <p className="text-sm font-bold text-orange-500 uppercase tracking-wider mb-2">
              {product.category}
            </p>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 leading-tight mb-4">
              {product.name}
            </h2>

            {product.description && (
              <p className="text-base text-slate-600 leading-relaxed mb-8">
                {product.description}
              </p>
            )}

            {product.style?.length > 0 && (
              <div className="mb-8">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                  Caratteristiche
                </p>
                <div className="flex flex-wrap gap-2">
                  {product.style.map((s, i) => (
                    <span
                      key={i}
                      className="bg-slate-100 text-slate-700 px-4 py-2 rounded-xl text-sm font-semibold"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-auto pt-8 border-t border-slate-100">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                Prezzo
              </p>
              <div className="flex items-end justify-between gap-4">
                <p className="text-5xl font-black text-slate-900">
                  €{product.price.toFixed(2)}
                </p>
                <button
                  disabled={!product.inStock}
                  onClick={() => {
                    addToCart(product);
                    onClose();
                  }}
                  className={`px-8 py-4 font-bold rounded-2xl transition-all shadow-lg text-lg ${
                    product.inStock
                      ? "bg-orange-500 text-white hover:bg-orange-600 hover:scale-105 hover:shadow-orange-500/30"
                      : "bg-slate-100 text-slate-400 cursor-not-allowed shadow-none"
                  }`}
                >
                  {product.inStock ? "Aggiungi al Carrello" : "Esaurito"}
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-slate-50 border-t border-slate-100 p-6 sm:p-10">
          <ProductReviews productId={product._id} />
        </div>
      </div>
    </div>
  );
}
