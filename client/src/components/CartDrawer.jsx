import { useGlobal } from "../context/GlobalContext";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function CartDrawer() {
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    removeFromCart,
    updateQuantity,
    cartTotal,
    appliedPromo,
    promoDiscount,
    promoGift,
    applyPromoCode,
    removePromoCode,
  } = useGlobal();

  const navigate = useNavigate();
  const [promoCodeInput, setPromoCodeInput] = useState("");
  const [promoError, setPromoError] = useState("");

  if (!isCartOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[100] transition-opacity"
        onClick={() => setIsCartOpen(false)}
      ></div>

      <div className="fixed top-0 right-0 h-full w-full sm:w-[400px] bg-white shadow-2xl z-[101] flex flex-col animate-slide-in-right">
        {/* Header Carrello */}
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-white">
          <h2 className="text-2xl font-black text-slate-900">
            Il tuo Carrello
          </h2>
          <button
            onClick={() => setIsCartOpen(false)}
            className="w-10 h-10 bg-slate-50 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-full font-bold flex items-center justify-center transition-colors"
          >
            ✕
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-slate-500 space-y-4">
              <span className="text-6xl">🛒</span>
              <p className="font-medium text-lg">Il tuo carrello è vuoto.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {cart.map((item) => (
                <div
                  key={item._id}
                  className="flex gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-100"
                >
                  <img
                    src={item.image || "https://via.placeholder.com/100"}
                    alt={item.name}
                    className="w-20 h-20 object-cover rounded-xl bg-white border border-slate-200"
                  />

                  <div className="flex-1 flex flex-col justify-center">
                    <div className="flex justify-between items-start mb-1">
                      <h4 className="font-bold text-slate-900 text-sm leading-tight pr-4">
                        {item.name}
                      </h4>
                      <button
                        onClick={() => removeFromCart(item._id)}
                        className="text-slate-400 hover:text-red-500"
                      >
                        ✕
                      </button>
                    </div>
                    <p className="text-orange-500 font-black mb-3">
                      €{item.price.toFixed(2)}
                    </p>

                    <div className="flex items-center gap-3 bg-white w-max px-2 py-1 rounded-lg border border-slate-200">
                      <button
                        onClick={() => updateQuantity(item._id, -1)}
                        className="w-6 h-6 flex items-center justify-center font-bold text-slate-600 hover:text-orange-500"
                      >
                        -
                      </button>
                      <span className="text-xs font-bold w-4 text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item._id, 1)}
                        className="w-6 h-6 flex items-center justify-center font-bold text-slate-600 hover:text-orange-500"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {cart.length > 0 && (
          <div className="p-6 border-t border-slate-100 bg-white">
            {/* Promo Code Input */}
            <div className="mb-6 pb-4 border-b border-slate-100">
              {!appliedPromo ? (
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                    Codice Promozionale
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Inserisci codice (es. VIP150)"
                      value={promoCodeInput}
                      onChange={(e) => {
                        setPromoCodeInput(e.target.value);
                        setPromoError("");
                      }}
                      className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-orange-500 outline-none font-medium uppercase font-mono text-slate-800"
                    />
                    <button
                      onClick={() => {
                        const res = applyPromoCode(promoCodeInput);
                        if (res && !res.success) {
                          setPromoError(res.message);
                        } else {
                          setPromoCodeInput("");
                          setPromoError("");
                        }
                      }}
                      className="px-4 py-2 bg-slate-900 text-white font-bold text-sm rounded-xl hover:bg-orange-500 transition-colors"
                    >
                      Applica
                    </button>
                  </div>
                  {promoError && (
                    <p className="text-red-500 text-xs mt-1.5 font-semibold">
                      ⚠️ {promoError}
                    </p>
                  )}
                </div>
              ) : (
                <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex flex-col gap-1.5 relative">
                  <div className="flex justify-between items-center">
                    <span className="bg-emerald-600 text-white text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full font-mono">
                      {appliedPromo.promoCode}
                    </span>
                    <button
                      onClick={removePromoCode}
                      className="text-slate-400 hover:text-red-500 text-xs font-bold"
                    >
                      Rimuovi ✕
                    </button>
                  </div>
                  <p className="text-slate-700 text-xs font-semibold leading-snug">
                    {appliedPromo.condition || "Sconto applicato al carrello!"}
                  </p>
                  {promoGift && (
                    <div className="mt-1 flex items-center gap-1.5 text-xs text-indigo-700 font-bold">
                      <span>🎁 Omaggio:</span>
                      <span className="bg-indigo-100 px-2 py-0.5 rounded text-indigo-800 font-mono">
                        {promoGift}
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="space-y-2 mb-6">
              {appliedPromo && promoDiscount > 0 && (
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-500 font-bold uppercase tracking-wider">
                    Subtotale
                  </span>
                  <span className="font-semibold text-slate-700">
                    €{cartTotal.toFixed(2)}
                  </span>
                </div>
              )}
              {appliedPromo && promoDiscount > 0 && (
                <div className="flex justify-between items-center text-sm">
                  <span className="text-emerald-600 font-bold uppercase tracking-wider flex items-center gap-1">
                    🏷️ Sconto VIP
                  </span>
                  <span className="font-black text-emerald-600 font-mono">
                    -€{promoDiscount.toFixed(2)}
                  </span>
                </div>
              )}
              <div className="flex justify-between items-center pt-2 border-t border-slate-100">
                <span className="text-slate-500 font-bold uppercase tracking-wider text-sm">
                  Totale
                </span>
                <span className="text-3xl font-black text-slate-900 font-mono">
                  €{(cartTotal - promoDiscount).toFixed(2)}
                </span>
              </div>
            </div>

            <button
              onClick={() => {
                setIsCartOpen(false);
                navigate("/checkout");
              }}
              className="w-full py-4 bg-slate-900 text-white font-black rounded-2xl hover:bg-orange-500 hover:shadow-xl hover:shadow-orange-500/20 transition-all text-lg"
            >
              Procedi al Checkout
            </button>
          </div>
        )}
      </div>
    </>
  );
}
