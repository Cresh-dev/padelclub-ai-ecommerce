import { useGlobal } from "../context/GlobalContext";

export default function RecommendationResults({
  recommendations,
  products,
  isLoading,
}) {
  const { addToCart } = useGlobal();

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-full min-h-[400px] text-slate-500 bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
        <div className="text-6xl mb-6 animate-bounce">🤖</div>
        <div className="w-12 h-12 border-4 border-slate-200 border-t-teal-500 rounded-full animate-spin mb-4"></div>
        <p className="font-bold text-lg text-slate-900">
          L'IA sta elaborando i dati...
        </p>
        <p className="text-sm">Cerchiamo l'abbinamento perfetto per te.</p>
      </div>
    );
  }

  if (!recommendations || recommendations.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full min-h-[400px] text-slate-500 bg-white rounded-3xl border border-slate-200 p-8 shadow-sm text-center">
        <div className="text-6xl mb-6 opacity-50">✨</div>
        <h3 className="text-2xl font-bold text-slate-900 mb-2">
          Pronto a iniziare?
        </h3>
        <p>
          Compila il modulo a sinistra e scopri i consigli di Google Gemini per
          il tuo equipaggiamento.
        </p>
      </div>
    );
  }

  const getProductDetails = (productId) =>
    products?.find((p) => p._id === productId);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-8">
        <h2 className="text-3xl font-black text-slate-900 tracking-tight">
          I suggerimenti per te
        </h2>
        <span className="bg-teal-100 text-teal-700 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider">
          AI Match
        </span>
      </div>

      <div className="flex flex-col gap-6">
        {recommendations.map((rec, index) => {
          const product = getProductDetails(rec.productId);
          if (!product) return null;

          return (
            <div
              key={index}
              className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl transition-shadow flex flex-col sm:flex-row"
            >
              <div className="w-full sm:w-2/5 bg-slate-50 relative aspect-square sm:aspect-auto">
                {product.image && (
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                )}
                <div className="absolute top-4 left-4 bg-slate-900 text-white w-8 h-8 rounded-full flex items-center justify-center font-black shadow-lg">
                  {index + 1}
                </div>
              </div>

              <div className="p-6 sm:p-8 w-full sm:w-3/5 flex flex-col">
                <p className="text-xs font-bold text-orange-500 uppercase tracking-wider mb-1">
                  {product.category}
                </p>
                <h3 className="text-2xl font-black text-slate-900 leading-tight mb-2">
                  {product.name}
                </h3>
                <p className="text-3xl font-black text-slate-900 mb-6">
                  €{product.price.toFixed(2)}
                </p>

                <div className="bg-teal-50 border border-teal-100 p-5 rounded-2xl mb-6 relative">
                  <span className="absolute -top-3 left-4 bg-teal-500 text-white px-3 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider">
                    Perché te lo consigliamo
                  </span>
                  <p className="text-sm font-medium text-teal-900 leading-relaxed mt-1">
                    {rec.reasoning}
                  </p>
                </div>

                <button
                  onClick={() => addToCart(product)}
                  className="mt-auto w-full py-4 bg-orange-500 text-white font-bold rounded-2xl hover:bg-orange-600 hover:shadow-lg hover:shadow-orange-500/20 transition-all"
                >
                  Aggiungi al Carrello
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
