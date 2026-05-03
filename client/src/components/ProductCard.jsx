import { useGlobal } from "../context/GlobalContext";

export default function ProductCard({ product, onViewClick }) {
  const { toggleFavorite, isFavorite } = useGlobal();
  const isFav = isFavorite(product._id);

  return (
    <div
      onClick={() => onViewClick(product)}
      className="group relative flex flex-col bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-xl hover:border-orange-500/50 transition-all duration-300 cursor-pointer"
    >
      <div className="relative aspect-square overflow-hidden bg-slate-50">
        <img
          src={product.image || "https://via.placeholder.com/400"}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />

        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleFavorite(product);
          }}
          className="absolute top-3 left-3 z-10 w-9 h-9 bg-white/90 backdrop-blur text-lg rounded-full flex items-center justify-center shadow-sm hover:scale-110 transition-transform"
        >
          {isFav ? "❤️" : "🤍"}
        </button>

        {product.trending && (
          <div className="absolute top-3 right-3 bg-gradient-to-r from-orange-500 to-red-500 text-white px-3 py-1 rounded-full text-[10px] font-black tracking-wider shadow-md">
            🔥 TRENDING
          </div>
        )}
      </div>

      <div className="p-5 flex flex-col flex-grow">
        <p className="text-xs font-bold text-orange-500 uppercase tracking-wider mb-1">
          {product.category}
        </p>
        <h3 className="text-lg font-bold text-slate-900 leading-tight mb-3 line-clamp-2">
          {product.name}
        </h3>

        {product.style?.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4 mt-auto">
            {product.style.slice(0, 2).map((s, i) => (
              <span
                key={i}
                className="text-[11px] font-bold bg-orange-50 text-orange-700 px-2.5 py-1 rounded-md"
              >
                {s}
              </span>
            ))}
          </div>
        )}

        <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-100">
          <p className="text-xl font-black text-slate-900">
            €{product.price.toFixed(2)}
          </p>
          {!product.inStock ? (
            <span className="text-[11px] font-bold text-red-500 bg-red-50 px-2 py-1 rounded-md">
              ESAURITO
            </span>
          ) : (
            <span className="text-sm font-bold text-orange-500 group-hover:text-orange-600 transition-colors">
              Scopri →
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
