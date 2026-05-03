import { useState, useEffect } from "react";

export default function CatalogFilters({ onFiltersChange }) {
  const [filters, setFilters] = useState({
    search: "",
    category: "Tutte",
    minPrice: 0,
    maxPrice: 500,
    style: [],
    inStock: false,
  });
  const [isOpen, setIsOpen] = useState(false);

  const categories = [
    "Tutte",
    "Racchette",
    "Calzature",
    "Abbigliamento",
    "Accessori",
    "Borse",
  ];
  const styles = [
    "Potenza",
    "Controllo",
    "Equilibrato",
    "Difesa",
    "Principiante",
    "Intermedio",
    "Professionista",
  ];

  useEffect(() => {
    onFiltersChange(filters);
  }, [filters]);

  const handleReset = () => {
    setFilters({
      search: "",
      category: "Tutte",
      minPrice: 0,
      maxPrice: 500,
      style: [],
      inStock: false,
    });
  };

  const toggleStyle = (style) => {
    setFilters((prev) => ({
      ...prev,
      style: prev.style.includes(style)
        ? prev.style.filter((s) => s !== style)
        : [...prev.style, style],
    }));
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full lg:hidden flex justify-between items-center font-bold text-slate-900 mb-4"
      >
        <span>Filtra Prodotti</span>
        <span>{isOpen ? "↑" : "↓"}</span>
      </button>

      <div className={`space-y-8 ${isOpen ? "block" : "hidden lg:block"}`}>
        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
            Ricerca
          </label>
          <input
            type="text"
            placeholder="Cerca prodotto..."
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:bg-white transition-all"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
            Categoria
          </label>
          <select
            value={filters.category}
            onChange={(e) =>
              setFilters({ ...filters, category: e.target.value })
            }
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:bg-white transition-all appearance-none cursor-pointer"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
            Prezzo: €{filters.minPrice} - €{filters.maxPrice}
          </label>
          <div className="flex gap-3 mb-4">
            <input
              type="number"
              value={filters.minPrice}
              onChange={(e) =>
                setFilters({
                  ...filters,
                  minPrice: parseFloat(e.target.value) || 0,
                })
              }
              placeholder="Min"
              className="w-1/2 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
            <input
              type="number"
              value={filters.maxPrice}
              onChange={(e) =>
                setFilters({
                  ...filters,
                  maxPrice: parseFloat(e.target.value) || 0,
                })
              }
              placeholder="Max"
              className="w-1/2 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>
          <input
            type="range"
            min="0"
            max="500"
            value={filters.maxPrice}
            onChange={(e) =>
              setFilters({ ...filters, maxPrice: parseFloat(e.target.value) })
            }
            className="w-full accent-orange-500 cursor-pointer h-2 bg-slate-200 rounded-lg appearance-none"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
            Stile / Livello
          </label>
          <div className="space-y-3">
            {styles.map((style) => (
              <label
                key={style}
                className="flex items-center gap-3 cursor-pointer group"
              >
                <input
                  type="checkbox"
                  checked={filters.style.includes(style)}
                  onChange={() => toggleStyle(style)}
                  className="w-5 h-5 rounded border-slate-300 text-orange-500 focus:ring-orange-500 cursor-pointer accent-orange-500"
                />
                <span className="text-sm font-medium text-slate-700 group-hover:text-slate-900 transition-colors">
                  {style}
                </span>
              </label>
            ))}
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100">
          <label className="flex items-center gap-3 cursor-pointer group">
            <input
              type="checkbox"
              checked={filters.inStock}
              onChange={(e) =>
                setFilters({ ...filters, inStock: e.target.checked })
              }
              className="w-5 h-5 rounded border-slate-300 text-orange-500 focus:ring-orange-500 cursor-pointer accent-orange-500"
            />
            <span className="text-sm font-bold text-slate-900">
              Solo disponibili
            </span>
          </label>
        </div>

        <button
          onClick={handleReset}
          className="w-full py-3 mt-4 text-sm font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
        >
          Reset Filtri
        </button>
      </div>
    </div>
  );
}
