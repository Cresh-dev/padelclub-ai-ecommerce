import { useState, useEffect } from "react";
import { useGlobal } from "../context/GlobalContext";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

export default function Profile() {
  const { user } = useGlobal();
  const navigate = useNavigate();

  const [isPremium, setIsPremium] = useState(
    localStorage.getItem("isPremiumUser") === "true",
  );

  const [username, setUsername] = useState("");
  const [playStyle, setPlayStyle] = useState("Versatile");
  const [position, setPosition] = useState("Entrambe");
  const [skillLevel, setSkillLevel] = useState("Intermedio");

  const [gear, setGear] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [selectedProductToAdd, setSelectedProductToAdd] = useState("");

  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;
      try {
        const { data: playerData } = await api.get("/player/me");
        if (playerData) {
          if (playerData.username) setUsername(playerData.username);
          if (playerData.playStyle) setPlayStyle(playerData.playStyle);
          if (playerData.position) setPosition(playerData.position);
          if (playerData.skillLevel) setSkillLevel(playerData.skillLevel);
          if (playerData.gear) setGear(playerData.gear);
        }

        const { data: productsData } = await api.get("/products");
        setAllProducts(productsData);
      } catch (error) {
        console.error("Errore caricamento dati:", error);
      }
    };
    fetchData();
  }, [user]);

  const addGear = () => {
    if (!selectedProductToAdd) return;
    const productToAdd = allProducts.find(
      (p) => p._id === selectedProductToAdd,
    );

    if (gear.some((g) => g._id === productToAdd._id)) {
      alert("Hai già aggiunto questo prodotto al tuo Gear!");
      return;
    }
    setGear([...gear, productToAdd]);
    setSelectedProductToAdd("");
  };

  const removeGear = (idToRemove) => {
    setGear(gear.filter((g) => g._id !== idToRemove));
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveMessage("");
    try {
      await api.put("/player/update", {
        username,
        playStyle,
        position,
        skillLevel,
        gear: gear.map((g) => g._id),
      });
      setSaveMessage("✅ Player Card salvata con successo!");
    } catch (error) {
      setSaveMessage("❌ " + (error.response?.data?.error || "Errore."));
    } finally {
      setIsSaving(false);
      setTimeout(() => setSaveMessage(""), 3000);
    }
  };

  const copyShareLink = () => {
    if (!username) {
      alert("Devi prima salvare un Username per creare il link!");
      return;
    }
    const link = `${window.location.origin}/player/${username}`;
    navigator.clipboard.writeText(link);
    alert("🔗 Link copiato negli appunti! Mandalo ai tuoi amici.");
  };

  const handleUpgrade = () => {
    localStorage.setItem("isPremiumUser", "true");
    setIsPremium(true);
    alert("Pagamento confermato! Benvenuto nel Club VIP 👑");
  };

  const handleDowngrade = () => {
    localStorage.setItem("isPremiumUser", "false");
    setIsPremium(false);
    alert("Abbonamento annullato.");
  };

  if (!user)
    return (
      <div className="pt-32 text-center font-bold">
        Devi effettuare l'accesso.
      </div>
    );

  return (
    <div className="min-h-screen bg-slate-50 pt-28 pb-20 px-4">
      <div className="max-w-3xl mx-auto space-y-8">
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200 flex items-center gap-6 relative overflow-hidden">
          <div className="w-24 h-24 bg-orange-100 text-orange-500 rounded-full flex items-center justify-center text-4xl font-black shrink-0 z-10">
            {user.name?.charAt(0).toUpperCase()}
          </div>
          <div className="z-10">
            <h1 className="text-3xl font-black text-slate-900">{user.name}</h1>
            <p className="text-slate-500">{user.email}</p>
            {isPremium && (
              <span className="mt-2 inline-flex items-center gap-1 bg-yellow-100 text-yellow-800 text-xs font-black uppercase tracking-widest px-3 py-1 rounded-full shadow-sm">
                👑 Premium
              </span>
            )}
          </div>
        </div>

        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200">
          {/* FIX RESPONSIVE: Intestazione Player Card */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div>
              <h2 className="text-2xl font-black text-slate-900">
                🎾 La tua Player Card
              </h2>
              <p className="text-slate-500 text-sm">
                Crea il tuo profilo pubblico.
              </p>
            </div>
            <button
              onClick={copyShareLink}
              className="bg-teal-50 text-teal-600 hover:bg-teal-100 font-bold px-4 py-2 rounded-xl border border-teal-200 w-full sm:w-auto"
            >
              🔗 Condividi
            </button>
          </div>

          <form onSubmit={handleSaveProfile} className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">
                Username Pubblico
              </label>
              <div className="flex items-center bg-slate-50 border border-slate-200 rounded-xl overflow-hidden">
                <span className="pl-4 pr-2 text-slate-400 font-medium">
                  padelclub.com/player/
                </span>
                <input
                  type="text"
                  value={username}
                  onChange={(e) =>
                    setUsername(
                      e.target.value.toLowerCase().replace(/\s+/g, ""),
                    )
                  }
                  placeholder="tuonome"
                  className="flex-1 bg-transparent py-3 pr-4 outline-none text-slate-900 font-bold"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  Livello
                </label>
                <select
                  value={skillLevel}
                  onChange={(e) => setSkillLevel(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none"
                >
                  <option value="Principiante">Principiante</option>
                  <option value="Intermedio">Intermedio</option>
                  <option value="Avanzato">Avanzato</option>
                  <option value="PRO">PRO</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  Posizione
                </label>
                <select
                  value={position}
                  onChange={(e) => setPosition(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none"
                >
                  <option value="Destra">Destra</option>
                  <option value="Sinistra">Sinistra</option>
                  <option value="Entrambe">Entrambe</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  Stile
                </label>
                <select
                  value={playStyle}
                  onChange={(e) => setPlayStyle(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none"
                >
                  <option value="Attaccante">Attaccante</option>
                  <option value="Difensore">Difensore</option>
                  <option value="Strategico">Strategico</option>
                  <option value="Versatile">Versatile</option>
                </select>
              </div>
            </div>

            <div className="pt-6 border-t border-slate-100">
              <label className="block text-sm font-bold text-slate-700 mb-2">
                Il tuo Equipaggiamento (Gear)
              </label>

              {/* FIX RESPONSIVE: Menu a tendina e bottone Aggiungi */}
              <div className="flex flex-col sm:flex-row gap-2 mb-4">
                <select
                  value={selectedProductToAdd}
                  onChange={(e) => setSelectedProductToAdd(e.target.value)}
                  className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-orange-500"
                >
                  <option value="">
                    -- Seleziona un prodotto dal catalogo --
                  </option>
                  {allProducts.map((p) => (
                    <option key={p._id} value={p._id}>
                      {p.name} (€{p.price})
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={addGear}
                  className="bg-orange-500 text-white font-bold px-6 py-3 rounded-xl hover:bg-orange-600 transition-colors w-full sm:w-auto"
                >
                  Aggiungi
                </button>
              </div>

              {gear.length > 0 ? (
                <div className="space-y-2">
                  {gear.map((item) => (
                    <div
                      key={item._id}
                      className="flex items-center justify-between bg-white border border-slate-200 p-3 rounded-xl"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-10 h-10 object-cover rounded-lg bg-slate-50"
                        />
                        <span className="font-bold text-sm">{item.name}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeGear(item._id)}
                        className="text-red-500 hover:text-red-700 font-bold p-2"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-slate-400 italic">
                  Nessun prodotto aggiunto. Mostra ai tuoi amici cosa usi in
                  campo!
                </p>
              )}
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between pt-4 border-t border-slate-100 gap-4">
              <span
                className={`text-sm font-bold ${saveMessage.includes("❌") ? "text-red-500" : "text-teal-500"}`}
              >
                {saveMessage}
              </span>
              <button
                type="submit"
                disabled={isSaving}
                className="bg-slate-900 text-white font-bold px-6 py-3 rounded-xl hover:bg-slate-800 disabled:opacity-50 w-full sm:w-auto"
              >
                {isSaving ? "Salvataggio..." : "Salva Player Card"}
              </button>
            </div>
          </form>
        </div>

        <div
          className={`p-8 rounded-3xl border-2 transition-all ${isPremium ? "bg-slate-900 border-yellow-400" : "bg-white border-slate-200"}`}
        >
          <h2
            className={`text-2xl font-black mb-4 ${isPremium ? "text-white" : "text-slate-900"}`}
          >
            PadelClub Premium
          </h2>
          {isPremium ? (
            <div>
              <p className="text-slate-400 mb-6">
                Abbonamento attivo. IA avanzata sbloccata.
              </p>
              <div className="flex gap-4">
                <button
                  onClick={() => navigate("/vip")}
                  className="bg-yellow-400 text-slate-900 font-bold px-6 py-3 rounded-xl"
                >
                  Vai all'Area VIP
                </button>
                <button
                  onClick={handleDowngrade}
                  className="text-slate-400 hover:text-white px-6 py-3"
                >
                  Annulla
                </button>
              </div>
            </div>
          ) : (
            <div>
              <button
                onClick={handleUpgrade}
                className="bg-slate-900 text-white font-bold px-8 py-4 rounded-xl"
              >
                Abbonati a 9.99€/mese
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
