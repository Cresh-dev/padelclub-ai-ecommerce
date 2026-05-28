import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGlobal } from "../context/GlobalContext";
import toast from "react-hot-toast";

export default function Checkout() {
  const {
    cart,
    cartTotal,
    setIsCartOpen,
    removeFromCart,
    clearCart,
    appliedPromo,
    promoDiscount,
    promoGift,
    applyPromoCode,
    removePromoCode,
  } = useGlobal();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [promoCodeInput, setPromoCodeInput] = useState("");
  const [promoError, setPromoError] = useState("");

  if (cart.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 pt-20">
        <span className="text-6xl mb-4">🛒</span>
        <h2 className="text-2xl font-black text-slate-900 mb-4">
          Il tuo carrello è vuoto
        </h2>
        <button
          onClick={() => navigate("/shop")}
          className="px-8 py-4 bg-orange-500 text-white font-bold rounded-2xl hover:bg-orange-600 transition-colors"
        >
          Torna agli acquisti
        </button>
      </div>
    );
  }

  const handlePayment = (e) => {
    e.preventDefault();
    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);
      alert(
        "🎉 Ordine completato con successo! (A breve metteremo i Toast veri)",
      );
      clearCart();
      navigate("/dashboard");
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-slate-50 pt-28 pb-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-10">
          Checkout
        </h1>

        <div className="flex flex-col lg:flex-row gap-10">
          <div className="w-full lg:w-2/3">
            <form
              onSubmit={handlePayment}
              className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm space-y-8"
            >
              <div>
                <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <span>📍</span> Dati di Spedizione
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Nome"
                    required
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-orange-500 outline-none"
                  />
                  <input
                    type="text"
                    placeholder="Cognome"
                    required
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-orange-500 outline-none"
                  />
                  <input
                    type="text"
                    placeholder="Indirizzo e Numero Civico"
                    required
                    className="w-full md:col-span-2 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-orange-500 outline-none"
                  />
                  <input
                    type="text"
                    placeholder="Città"
                    required
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-orange-500 outline-none"
                  />
                  <input
                    type="text"
                    placeholder="CAP"
                    required
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-orange-500 outline-none"
                  />
                </div>
              </div>

              <div className="pt-8 border-t border-slate-100">
                <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <span>💳</span> Metodo di Pagamento
                </h3>
                <div className="space-y-4">
                  <input
                    type="text"
                    placeholder="Numero Carta (Simulato)"
                    required
                    maxLength="16"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-orange-500 outline-none"
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <input
                      type="text"
                      placeholder="MM/AA"
                      required
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-orange-500 outline-none"
                    />
                    <input
                      type="text"
                      placeholder="CVC"
                      required
                      maxLength="3"
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-orange-500 outline-none"
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={isProcessing}
                className="w-full py-4 bg-slate-900 text-white font-black rounded-2xl hover:bg-orange-500 hover:shadow-xl hover:shadow-orange-500/20 transition-all text-lg disabled:opacity-50"
              >
                {isProcessing
                  ? "Elaborazione in corso..."
                  : `Paga €${(cartTotal - promoDiscount).toFixed(2)}`}
              </button>
            </form>
          </div>

          <div className="w-full lg:w-1/3">
            <div className="bg-slate-900 rounded-3xl p-8 text-white sticky top-28 shadow-xl">
              <h3 className="text-xl font-bold mb-6">Riepilogo Ordine</h3>

              <div className="space-y-4 mb-6 max-h-64 overflow-y-auto pr-2">
                {cart.map((item) => (
                  <div
                    key={item._id}
                    className="flex justify-between items-center gap-4 border-b border-slate-800 pb-4"
                  >
                    <div className="flex-1">
                      <p className="font-bold text-sm leading-tight line-clamp-1">
                        {item.name}
                      </p>
                      <p className="text-slate-400 text-xs">
                        Qtà: {item.quantity}
                      </p>
                    </div>
                    <p className="font-black text-orange-500">
                      €{(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>

              {/* Area Promo Code in Checkout */}
              <div className="border-t border-slate-800 pt-6 pb-2">
                {!appliedPromo ? (
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                      Codice Promozionale
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Codice (es. VIP150)"
                        value={promoCodeInput}
                        onChange={(e) => {
                          setPromoCodeInput(e.target.value);
                          setPromoError("");
                        }}
                        className="flex-1 px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-orange-500 outline-none font-medium uppercase font-mono text-white"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const res = applyPromoCode(promoCodeInput);
                          if (res && !res.success) {
                            setPromoError(res.message);
                          } else {
                            setPromoCodeInput("");
                            setPromoError("");
                          }
                        }}
                        className="px-4 py-2 bg-orange-500 text-white font-bold text-sm rounded-xl hover:bg-orange-600 transition-colors"
                      >
                        Applica
                      </button>
                    </div>
                    {promoError && (
                      <p className="text-red-400 text-xs mt-1.5 font-semibold">
                        ⚠️ {promoError}
                      </p>
                    )}
                  </div>
                ) : (
                  <div className="bg-slate-800 border border-slate-700 rounded-2xl p-4 flex flex-col gap-1.5 relative">
                    <div className="flex justify-between items-center">
                      <span className="bg-emerald-600 text-white text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full font-mono font-semibold">
                        {appliedPromo.promoCode}
                      </span>
                      <button
                        type="button"
                        onClick={removePromoCode}
                        className="text-slate-400 hover:text-red-500 text-xs font-bold"
                      >
                        Rimuovi ✕
                      </button>
                    </div>
                    <p className="text-slate-300 text-xs font-semibold leading-snug">
                      {appliedPromo.condition}
                    </p>
                  </div>
                )}
              </div>

              <div className="space-y-3 text-sm text-slate-300 border-t border-slate-800 pt-6">
                <div className="flex justify-between">
                  <span>Subtotale</span>
                  <span className="font-mono">€{cartTotal.toFixed(2)}</span>
                </div>
                {appliedPromo && promoDiscount > 0 && (
                  <div className="flex justify-between text-emerald-400 font-bold">
                    <span className="flex items-center gap-1">
                      🏷️ Sconto VIP
                    </span>
                    <span className="font-black font-mono">-€{promoDiscount.toFixed(2)}</span>
                  </div>
                )}
                {promoGift && (
                  <div className="flex justify-between text-indigo-400 font-bold">
                    <span>🎁 Omaggio VIP</span>
                    <span>{promoGift}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Spedizione</span>
                  <span className="text-teal-400 font-bold">Gratis</span>
                </div>
              </div>

              <div className="flex justify-between items-center mt-6 pt-6 border-t border-slate-800">
                <span className="font-bold uppercase tracking-wider text-sm">
                  Totale
                </span>
                <span className="text-3xl font-black text-white font-mono">
                  €{(cartTotal - promoDiscount).toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
