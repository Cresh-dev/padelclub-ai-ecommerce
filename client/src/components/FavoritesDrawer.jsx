import { useGlobal } from "../context/GlobalContext";

export default function FavoritesDrawer() {
  const {
    favorites,
    isFavoritesOpen,
    setIsFavoritesOpen,
    toggleFavorite,
    addToCart,
  } = useGlobal();

  if (!isFavoritesOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[100] transition-opacity"
        onClick={() => setIsFavoritesOpen(false)}
      ></div>

      <div className="fixed top-0 right-0 h-full w-full sm:w-[400px] bg-white shadow-2xl z-[101] flex flex-col animate-slide-in-right">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-white">
          <h2 className="text-2xl font-black text-slate-900">
            La tua Lista Desideri
          </h2>
          <button
            onClick={() => setIsFavoritesOpen(false)}
            className="w-10 h-10 bg-slate-50 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-full font-bold flex items-center justify-center transition-colors"
          >
            ✕
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {favorites.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-slate-500 space-y-4">
              <span className="text-6xl opacity-50">🤍</span>
              <p className="font-medium text-lg text-center">
                Nessun prodotto tra i preferiti.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {favorites.map((item) => (
                <div
                  key={item._id}
                  className="flex flex-col bg-slate-50 p-4 rounded-2xl border border-slate-100"
                >
                  <div className="flex gap-4">
                    <img
                      src={item.image || "https://via.placeholder.com/100"}
                      alt={item.name}
                      className="w-20 h-20 object-cover rounded-xl bg-white border border-slate-200"
                    />
                    <div className="flex-1">
                      <h4 className="font-bold text-slate-900 text-sm leading-tight mb-1">
                        {item.name}
                      </h4>
                      <p className="text-orange-500 font-black">
                        €{item.price.toFixed(2)}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-2 mt-4 pt-4 border-t border-slate-200">
                    <button
                      onClick={() => toggleFavorite(item)}
                      className="px-4 py-2 text-xs font-bold text-red-500 bg-white border border-slate-200 rounded-xl hover:bg-red-50 transition-colors"
                    >
                      Rimuovi
                    </button>
                    <button
                      onClick={() => {
                        addToCart(item);
                        toggleFavorite(item);
                      }}
                      disabled={!item.inStock}
                      className="flex-1 px-4 py-2 text-xs font-bold text-white bg-slate-900 rounded-xl hover:bg-orange-500 transition-colors disabled:opacity-50"
                    >
                      {item.inStock ? "Sposta nel Carrello" : "Esaurito"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
