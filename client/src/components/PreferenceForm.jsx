import { useState } from "react";

const SKILL_LEVELS = [
  "Principiante",
  "Intermedio",
  "Avanzato",
  "Professionista",
];
const RACKET_TYPES = ["Potenza", "Controllo", "Equilibrato", "Difesa"];

export default function PreferenceForm({ onSubmit, isLoading }) {
  const [budget, setBudget] = useState({ min: 50, max: 300 });
  const [skillLevel, setSkillLevel] = useState("");
  const [racketType, setRacketType] = useState("");
  const [objectives, setObjectives] = useState("");
  const [specialRequests, setSpecialRequests] = useState("");
  const [errors, setErrors] = useState({});

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors({});
    const newErrors = {};

    if (!skillLevel) newErrors.skillLevel = "Seleziona il tuo livello";
    if (!racketType) newErrors.racketType = "Seleziona il tipo preferito";
    if (!objectives.trim()) newErrors.objectives = "Descrivi cosa cerchi";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSubmit({ budget, skillLevel, racketType, objectives, specialRequests });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm space-y-8"
    >
      <div>
        <h2 className="text-3xl font-black text-slate-900 tracking-tight">
          Il tuo Profilo Padel
        </h2>
        <p className="text-slate-500 font-medium mt-2">
          Compila i dati per permettere all'IA di trovare l'attrezzatura
          perfetta per te.
        </p>
      </div>

      <div>
        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">
          Budget: €{budget.min} - €{budget.max}
        </label>
        <div className="flex gap-4 mb-4">
          <input
            type="number"
            value={budget.min}
            onChange={(e) =>
              setBudget({ ...budget, min: parseInt(e.target.value) || 0 })
            }
            placeholder="Min"
            className="w-1/2 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
          <input
            type="number"
            value={budget.max}
            onChange={(e) =>
              setBudget({ ...budget, max: parseInt(e.target.value) || 0 })
            }
            placeholder="Max"
            className="w-1/2 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>
        <input
          type="range"
          min="0"
          max="500"
          value={budget.max}
          onChange={(e) =>
            setBudget({ ...budget, max: parseInt(e.target.value) })
          }
          className="w-full accent-orange-500 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
        />
      </div>

      <div>
        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">
          Livello di Gioco *
        </label>
        {errors.skillLevel && (
          <p className="text-xs text-red-500 font-bold mb-3">
            {errors.skillLevel}
          </p>
        )}
        <div className="flex flex-wrap gap-3">
          {SKILL_LEVELS.map((level) => (
            <button
              key={level}
              type="button"
              onClick={() => setSkillLevel(level)}
              className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${
                skillLevel === level
                  ? "bg-orange-500 text-white shadow-md shadow-orange-500/20"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {level}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">
          Stile di Gioco *
        </label>
        {errors.racketType && (
          <p className="text-xs text-red-500 font-bold mb-3">
            {errors.racketType}
          </p>
        )}
        <div className="flex flex-wrap gap-3">
          {RACKET_TYPES.map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => setRacketType(racketType === type ? "" : type)}
              className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${
                racketType === type
                  ? "bg-slate-900 text-white shadow-md"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">
          Cosa stai cercando? *
        </label>
        {errors.objectives && (
          <p className="text-xs text-red-500 font-bold mb-3">
            {errors.objectives}
          </p>
        )}
        <textarea
          value={objectives}
          onChange={(e) => setObjectives(e.target.value)}
          placeholder="Es: Cerco una racchetta per migliorare il controllo e scarpe con molto grip..."
          rows="3"
          className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none"
        />
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full py-4 bg-teal-500 text-white font-black rounded-2xl hover:bg-teal-600 hover:shadow-xl hover:shadow-teal-500/20 transition-all disabled:opacity-50 text-lg"
      >
        {isLoading
          ? "Analizzando il profilo..."
          : "✨ Genera Raccomandazioni IA"}
      </button>
    </form>
  );
}
