import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../services/api";
import ProductModal from "../components/ProductModal";

export default function PublicProfile() {
  const { username } = useParams();
  const [player, setPlayer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchPlayer = async () => {
      try {
        const { data } = await api.get(`/player/${username}`);
        setPlayer(data);
      } catch (err) {
        setError(err.response?.data?.error || "Giocatore non trovato.");
      } finally {
        setLoading(false);
      }
    };

    fetchPlayer();
  }, [username]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 pt-32 flex flex-col items-center">
        <div className="w-16 h-16 border-4 border-slate-700 border-t-orange-500 rounded-full animate-spin mb-4"></div>
        <p className="text-orange-500 font-bold animate-pulse text-xl">
          Ricerca giocatore in corso...
        </p>
      </div>
    );
  }

  if (error || !player) {
    return (
      <div className="min-h-screen bg-slate-50 pt-32 px-4 text-center">
        <div className="max-w-md mx-auto bg-white p-8 rounded-3xl shadow-sm border border-slate-200">
          <div className="text-6xl mb-4">🕵️‍♂️</div>
          <h2 className="text-2xl font-black text-slate-900 mb-2">
            Giocatore non trovato
          </h2>
          <p className="text-slate-500 mb-6">{error}</p>
          <Link
            to="/"
            className="inline-block bg-orange-500 text-white font-bold px-6 py-3 rounded-xl hover:bg-orange-600 transition-colors"
          >
            Torna alla Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 pt-28 pb-20 px-4 flex justify-center items-start">
      <div className="w-full max-w-2xl">
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border-4 border-orange-500 relative">
          <div className="bg-slate-900 p-8 text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/10 rounded-bl-full"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-teal-500/10 rounded-tr-full"></div>

            <div className="w-28 h-28 mx-auto bg-orange-500 text-white rounded-full flex items-center justify-center text-5xl font-black shadow-[0_0_30px_rgba(249,115,22,0.4)] relative z-10 border-4 border-slate-900">
              {player.name.charAt(0).toUpperCase()}
            </div>

            <h1 className="text-3xl font-black text-white mt-4 relative z-10">
              {player.name}
            </h1>
            <p className="text-orange-400 font-bold text-lg tracking-widest uppercase relative z-10">
              @{player.username}
            </p>
          </div>

          <div className="p-8 bg-slate-50 border-b border-slate-200">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-6 text-center">
              Specifiche Tecniche
            </h3>
            <div className="grid grid-cols-3 gap-4 text-center mb-2">
              <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
                <div className="text-2xl mb-1">⭐</div>
                <p className="text-xs text-slate-400 font-bold uppercase mb-1">
                  Livello
                </p>
                <p className="font-black text-slate-900">{player.skillLevel}</p>
              </div>
              <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
                <div className="text-2xl mb-1">👟</div>
                <p className="text-xs text-slate-400 font-bold uppercase mb-1">
                  Posizione
                </p>
                <p className="font-black text-slate-900">{player.position}</p>
              </div>
              <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
                <div className="text-2xl mb-1">🔥</div>
                <p className="text-xs text-slate-400 font-bold uppercase mb-1">
                  Stile
                </p>
                <p className="font-black text-slate-900">{player.playStyle}</p>
              </div>
            </div>
          </div>

          <div className="p-8">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-6 text-center">
              L'Armeria (Gear)
            </h3>

            {!player.gear || player.gear.length === 0 ? (
              <div className="text-center bg-slate-50 p-6 rounded-2xl border border-dashed border-slate-300">
                <p className="text-slate-500 font-medium">
                  Questo giocatore mantiene segreta la sua attrezzatura... per
                  ora! 🕵️‍♂️
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {player.gear.map((item, index) => (
                  <div
                    key={index}
                    onClick={() => {
                      setSelectedProduct(item);
                      setIsModalOpen(true);
                    }}
                    className="flex items-center gap-4 p-4 rounded-2xl bg-white border border-slate-200 hover:border-orange-500 hover:shadow-md transition-all group cursor-pointer"
                  >
                    <img
                      src={
                        item.image ||
                        "https://images.unsplash.com/photo-1622279457486-62dcc4a631d6?w=200&q=80"
                      }
                      alt={item.name}
                      className="w-16 h-16 rounded-xl object-cover bg-slate-50 border border-slate-100"
                    />
                    <div className="flex-1">
                      <p className="text-xs font-bold text-orange-500 uppercase">
                        {item.category}
                      </p>
                      <h4 className="font-black text-slate-900 group-hover:text-orange-500 transition-colors">
                        {item.name}
                      </h4>
                    </div>
                    <div className="text-slate-300 group-hover:text-orange-500 transition-colors pr-2">
                      ➔
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="mt-8 text-center">
          <p className="text-slate-400 mb-4 font-medium">
            Vuoi creare anche tu la tua Player Card personalizzata?
          </p>
          <Link
            to="/auth"
            className="inline-block bg-white text-slate-900 font-black px-8 py-4 rounded-xl hover:bg-slate-100 transition-colors shadow-lg"
          >
            Iscriviti a PadelClub
          </Link>
        </div>
      </div>

      <ProductModal
        product={selectedProduct}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
