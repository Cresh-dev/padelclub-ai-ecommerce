import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useGlobal } from "../context/GlobalContext";

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const {
    isAuthenticated,
    user,
    logout,
    cartCount,
    setIsCartOpen,
    favoritesCount,
    setIsFavoritesOpen,
  } = useGlobal();

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="fixed w-full z-50 top-0 bg-white/80 backdrop-blur-md border-b border-slate-200 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          <Link to="/" className="flex items-center gap-2">
            <span className="text-3xl">🎾</span>
            <span className="text-2xl font-black tracking-tight text-slate-900">
              Padel<span className="text-orange-500">Club</span>
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <Link
              to="/shop"
              className={`text-sm font-semibold transition-colors ${isActive("/shop") ? "text-orange-500" : "text-slate-600 hover:text-slate-900"}`}
            >
              Catalogo
            </Link>

            {isAuthenticated && (
              <>
                <Link
                  to="/recommendations"
                  className={`text-sm font-semibold transition-colors ${isActive("/recommendations") ? "text-teal-500" : "text-slate-600 hover:text-teal-500"}`}
                >
                  ✨ IA Recs
                </Link>
                <Link
                  to="/dashboard"
                  className={`text-sm font-semibold transition-colors ${isActive("/dashboard") ? "text-orange-500" : "text-slate-600 hover:text-slate-900"}`}
                >
                  Dashboard
                </Link>
                <Link
                  to="/vip"
                  className="flex items-center gap-1 px-3 py-2 rounded-md text-sm font-black text-yellow-500 hover:text-yellow-400 hover:bg-slate-800 transition-colors"
                >
                  👑 Area VIP
                </Link>
                {user?.role === 'admin' && (
                  <Link
                    to="/admin"
                    className={`text-sm font-semibold transition-colors ${isActive("/admin") ? "text-orange-500" : "text-slate-600 hover:text-slate-900"}`}
                  >
                    📊 Admin
                  </Link>
                )}
              </>
            )}

            <div className="pl-6 border-l border-slate-200 flex items-center gap-4">
              {isAuthenticated ? (
                <>
                  <Link
                    to="/profile"
                    className="text-sm font-bold text-slate-900 hover:text-orange-500 transition-colors flex items-center gap-1.5 px-2 py-1 rounded-lg hover:bg-slate-50"
                    title="Vai al tuo Profilo"
                  >
                    👤 {user?.name}
                  </Link>
                  <button
                    onClick={logout}
                    className="px-4 py-2 text-sm font-bold text-slate-600 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <Link
                  to="/auth"
                  className="px-6 py-2.5 text-sm font-bold text-white bg-orange-500 rounded-xl hover:scale-105 hover:shadow-lg hover:shadow-orange-500/30 transition-all duration-300"
                >
                  Accedi
                </Link>
              )}

              <button
                onClick={() => setIsFavoritesOpen(true)}
                className="relative p-2 text-slate-600 hover:text-red-500 transition-colors"
              >
                <span className="text-2xl">❤️</span>
                {favoritesCount > 0 && (
                  <span className="absolute top-0 right-0 bg-slate-900 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-white shadow-sm">
                    {favoritesCount}
                  </span>
                )}
              </button>

              <button
                onClick={() => setIsCartOpen(true)}
                className="relative p-2 text-slate-600 hover:text-orange-500 transition-colors"
              >
                <span className="text-2xl">🛒</span>
                {cartCount > 0 && (
                  <span className="absolute top-0 right-0 bg-red-500 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-white shadow-sm">
                    {cartCount}
                  </span>
                )}
              </button>
            </div>
          </div>

          <div className="md:hidden flex items-center gap-3">
            <button
              onClick={() => setIsFavoritesOpen(true)}
              className="relative p-2 text-slate-900"
            >
              <span className="text-xl">❤️</span>
              {favoritesCount > 0 && (
                <span className="absolute top-0 right-0 bg-slate-900 text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full border-2 border-white">
                  {favoritesCount}
                </span>
              )}
            </button>
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 text-slate-900"
            >
              <span className="text-xl">🛒</span>
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 bg-red-500 text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full border-2 border-white">
                  {cartCount}
                </span>
              )}
            </button>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-slate-900 hover:text-orange-500 p-2 ml-1"
            >
              <span className="text-2xl">{isOpen ? "✕" : "☰"}</span>
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden bg-white border-t border-slate-100 px-4 pt-2 pb-6 space-y-2 shadow-2xl absolute w-full">
          <Link
            to="/shop"
            onClick={() => setIsOpen(false)}
            className="block px-4 py-3 rounded-xl text-base font-semibold text-slate-600 hover:bg-slate-50"
          >
            Catalogo
          </Link>
          {isAuthenticated && (
            <>
              <Link
                to="/recommendations"
                onClick={() => setIsOpen(false)}
                className="block px-4 py-3 rounded-xl text-base font-semibold text-teal-500 hover:bg-slate-50"
              >
                IA Recs
              </Link>
              <Link
                to="/dashboard"
                onClick={() => setIsOpen(false)}
                className="block px-4 py-3 rounded-xl text-base font-semibold text-slate-600 hover:bg-slate-50"
              >
                Dashboard
              </Link>
              <Link
                to="/vip"
                onClick={() => setIsOpen(false)}
                className="block px-4 py-3 rounded-xl text-base font-black text-yellow-500 hover:bg-slate-800 transition-colors mt-1"
              >
                👑 Area VIP
              </Link>
              {user?.role === 'admin' && (
                <Link
                  to="/admin"
                  onClick={() => setIsOpen(false)}
                  className="block px-4 py-3 rounded-xl text-base font-semibold text-orange-500 hover:bg-slate-50"
                >
                  📊 Admin
                </Link>
              )}
              <Link
                to="/profile"
                onClick={() => setIsOpen(false)}
                className="block px-4 py-3 rounded-xl text-base font-semibold text-slate-600 hover:bg-slate-50"
              >
                👤 Il mio Profilo
              </Link>
            </>
          )}
          <div className="pt-4 mt-2 border-t border-slate-100">
            {isAuthenticated ? (
              <button
                onClick={() => {
                  logout();
                  setIsOpen(false);
                }}
                className="w-full px-4 py-3 text-center font-bold text-red-500 bg-red-50 rounded-xl"
              >
                Logout
              </button>
            ) : (
              <Link
                to="/auth"
                onClick={() => setIsOpen(false)}
                className="block w-full px-4 py-3 text-center font-bold text-white bg-orange-500 rounded-xl"
              >
                Accedi
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
