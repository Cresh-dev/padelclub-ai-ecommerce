import { useState } from "react";
import api from "../services/api";
import { Link } from "react-router-dom";
import { useGlobal } from "../context/GlobalContext";

export default function MarketingCampaign() {
  const { user } = useGlobal();
  const [campaign, setCampaign] = useState(() => {
    const saved = localStorage.getItem("activeVipCampaign");
    try {
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const isPremium = localStorage.getItem("isPremiumUser") === "true";

  const generateCampaign = async () => {
    setLoading(true);
    setError("");
    try {
      const { data } = await api.get("/marketing/generate");
      setCampaign(data);
      localStorage.setItem("activeVipCampaign", JSON.stringify(data));
    } catch (err) {
      setError(
        err.response?.data?.error ||
          "C'è stato un problema. Riprova più tardi.",
      );
    } finally {
      setLoading(false);
    }
  };

  if (!isPremium) {
    return (
      <div className="min-h-screen bg-slate-900 pt-28 pb-20 px-4 flex justify-center items-center">
        <div className="w-full max-w-lg bg-white rounded-3xl p-8 md:p-12 text-center shadow-2xl relative overflow-hidden border-t-8 border-yellow-400">
          <div className="text-6xl mb-6">🔒</div>
          <h1 className="text-3xl font-black text-slate-900 mb-4">
            Area Riservata VIP
          </h1>
          <p className="text-slate-600 font-medium mb-8">
            Questa sezione è riservata ai membri del{" "}
            <strong className="text-slate-900">PadelClub Premium</strong>.
            Sblocca l'accesso al tuo Personal Shopper IA e ricevi sconti su
            bundle e spese minime generati su misura per il tuo stile di gioco.
          </p>

          <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 mb-8">
            <p className="text-slate-500 font-bold uppercase text-xs tracking-widest mb-2">
              Abbonamento Mensile
            </p>
            <p className="text-5xl font-black text-slate-900">
              €9.99
              <span className="text-lg text-slate-400 font-medium">/mese</span>
            </p>
          </div>

          <Link
            to="/profile"
            className="block w-full bg-gradient-to-r from-yellow-400 to-orange-500 text-slate-900 font-black text-lg px-8 py-4 rounded-xl shadow-lg hover:scale-105 transition-all"
          >
            Vai al Profilo per Abbonarti
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 pt-28 pb-20 px-4 flex justify-center items-center">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight mb-4 flex items-center justify-center gap-3">
            <span className="text-yellow-400">👑</span> PadelClub VIP
          </h1>
          <p className="text-lg text-slate-400 font-medium">
            Bentornato, {user?.name}. La tua IA ha preparato nuove offerte per
            te.
          </p>
        </div>

        {!campaign && !loading && (
          <div className="text-center">
            <button
              onClick={generateCampaign}
              className="bg-gradient-to-r from-yellow-400 to-orange-500 text-slate-900 font-black text-lg px-8 py-4 rounded-full shadow-[0_0_30px_rgba(250,204,21,0.3)] hover:scale-105 transition-transform"
            >
              Genera la mia Offerta Segreta ✨
            </button>
            {error && <p className="text-red-400 mt-6 font-medium">{error}</p>}
          </div>
        )}

        {loading && (
          <div className="flex flex-col items-center justify-center py-10">
            <div className="w-16 h-16 border-4 border-slate-700 border-t-yellow-400 rounded-full animate-spin mb-6"></div>
            <p className="text-yellow-400 font-bold animate-pulse text-xl">
              Calcolo margini e creazione bundle...
            </p>
          </div>
        )}

        {campaign && (
          <div className="bg-white rounded-3xl p-8 md:p-10 shadow-2xl relative border-4 border-yellow-400">
            <div className="mb-8 border-b border-slate-200 pb-6">
              <span className="bg-yellow-100 text-yellow-800 text-xs font-black uppercase tracking-widest px-3 py-1 rounded-full mb-4 inline-block">
                Offerta Personalizzata
              </span>
              <h2 className="text-3xl font-black text-slate-900 leading-tight">
                {campaign.subject}
              </h2>
            </div>

            <div className="prose prose-lg text-slate-700 mb-8">
              <p className="font-bold text-xl text-slate-900">
                {campaign.greeting}
              </p>
              <p className="leading-relaxed">{campaign.body}</p>
            </div>

            <div className="bg-slate-900 p-6 rounded-2xl text-center mb-8">
              <p className="text-sm text-slate-400 font-bold uppercase mb-2">
                Il tuo codice esclusivo:
              </p>
              <p className="text-4xl font-black text-yellow-400 tracking-widest font-mono mb-4">
                {campaign.promoCode}
              </p>
              <div className="inline-block bg-white/10 px-4 py-2 rounded-lg border border-white/20 text-white font-medium text-sm">
                ⚠️ {campaign.condition || "Condizioni applicate al carrello"}
              </div>
            </div>

            <Link
              to="/shop"
              className="block w-full text-center bg-orange-500 text-white font-bold text-lg px-8 py-4 rounded-xl hover:bg-orange-600 transition-colors shadow-lg hover:shadow-orange-500/30 hover:-translate-y-0.5 transform"
            >
              {campaign.callToAction}
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
