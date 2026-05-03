import { useState } from "react";
import { authAPI } from "../services/api";
import { useGlobal } from "../context/GlobalContext";

export default function Auth() {
  const { login } = useGlobal();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);
    try {
      let response;
      if (isLogin) {
        response = await authAPI.login(formData.email, formData.password);
      } else {
        response = await authAPI.register(
          formData.email,
          formData.name,
          formData.password,
        );
      }
      setSuccess(response.data.message);
      login(response.data.token, response.data.user);
    } catch (err) {
      setError(err.response?.data?.error || "Errore durante l'autenticazione");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-white">
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 lg:p-24">
        <div className="w-full max-w-md space-y-8">
          <div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight">
              {isLogin ? "Bentornato" : "Inizia ora"}
            </h1>
            <p className="mt-2 text-slate-500 font-medium">
              {isLogin
                ? "Inserisci i tuoi dati per accedere al tuo account."
                : "Crea un account per ottenere raccomandazioni IA."}
            </p>
          </div>

          {error && (
            <div className="p-4 bg-red-50 text-red-600 rounded-2xl border border-red-100 font-semibold text-sm">
              {error}
            </div>
          )}
          {success && (
            <div className="p-4 bg-green-50 text-green-600 rounded-2xl border border-green-100 font-semibold text-sm">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {!isLogin && (
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                  Nome Completo
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Es. Mario Rossi"
                  required
                  className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:bg-white transition-all"
                />
              </div>
            )}
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="tuo@indirizzo.com"
                required
                className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:bg-white transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                required
                className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:bg-white transition-all"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 mt-4 bg-orange-500 text-white font-bold rounded-2xl hover:bg-orange-600 hover:shadow-xl hover:shadow-orange-500/20 transition-all disabled:opacity-50"
            >
              {loading
                ? "Caricamento..."
                : isLogin
                  ? "Accedi all'account"
                  : "Crea account"}
            </button>
          </form>

          <p className="text-center text-sm font-medium text-slate-500 mt-8">
            {isLogin ? "Non hai un account? " : "Hai già un account? "}
            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="text-slate-900 font-bold hover:text-orange-500 transition-colors"
            >
              {isLogin ? "Registrati gratis" : "Accedi da qui"}
            </button>
          </p>
        </div>
      </div>

      {/* Lato Destro - Hero */}
      <div className="hidden lg:flex w-1/2 bg-slate-950 p-12 items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1622279457486-640cae6f4c98?q=80&w=1000&auto=format&fit=crop')] bg-cover bg-center opacity-30 mix-blend-overlay"></div>
        <div className="relative z-10 max-w-lg">
          <h2 className="text-5xl font-black text-white leading-tight mb-6">
            L'Intelligenza Artificiale al servizio del tuo{" "}
            <span className="text-teal-400">Padel</span>.
          </h2>
          <ul className="space-y-4 text-lg font-medium text-slate-300">
            <li className="flex items-center gap-3">
              ✓ Raccomandazioni basate sul tuo livello
            </li>
            <li className="flex items-center gap-3">
              ✓ Scopri racchette adatte al tuo stile
            </li>
            <li className="flex items-center gap-3">
              ✓ Powered by Google Gemini
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
