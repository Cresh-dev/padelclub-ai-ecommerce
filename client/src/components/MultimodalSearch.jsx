import { useState, useRef } from "react";
import toast from "react-hot-toast";
import api from "../services/api";

export default function MultimodalSearch({ onSearchResults }) {
  const [query, setQuery] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [imageBase64, setImageBase64] = useState(null);
  const [isSearching, setIsSearching] = useState(false);

  const fileInputRef = useRef(null);

  const startListening = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      toast.error("Il tuo browser non supporta la ricerca vocale.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "it-IT";

    recognition.onstart = () => {
      setIsListening(true);
      toast("In ascolto... Parla ora!", { icon: "🎤" });
    };

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setQuery(transcript);
      toast.success("Testo acquisito!");
    };

    recognition.onerror = () => toast.error("Non ho capito, riprova.");
    recognition.onend = () => setIsListening(false);

    recognition.start();
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setImageBase64(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImagePreview(null);
    setImageBase64(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // 3. INVIO AL BACKEND
  const handleSearch = async (e) => {
    if (e) e.preventDefault();
    if (!query && !imageBase64) {
      toast.error("Inserisci un testo o carica un'immagine.");
      return;
    }

    setIsSearching(true);
    try {
      const { data } = await api.post("/search/multimodal", {
        textQuery: query,
        imageBase64: imageBase64,
      });

      toast.success("Ricerca IA completata!");
      onSearchResults(data.results, data.aiAnalysis);
    } catch (error) {
      console.error(error);
      toast.error("Errore durante la ricerca.");
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto mb-10">
      <form
        onSubmit={handleSearch}
        className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-2 sm:bg-white sm:p-2 sm:rounded-full sm:shadow-lg sm:border sm:border-slate-200"
      >
        <div className="flex flex-1 items-center gap-2 bg-white p-2 rounded-full shadow-lg border border-slate-200 sm:shadow-none sm:border-none sm:p-0 sm:bg-transparent">
          <button
            type="button"
            onClick={() => fileInputRef.current.click()}
            className="p-3 bg-slate-100 text-slate-600 rounded-full hover:bg-slate-200 transition-colors shrink-0"
            title="Cerca per immagine"
          >
            📷
          </button>
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleImageUpload}
            className="hidden"
          />

          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Scrivi o scatta..."
            className="flex-1 min-w-0 bg-transparent border-none outline-none px-2 text-slate-800 text-sm sm:text-base"
          />

          <button
            type="button"
            onClick={startListening}
            className={`p-3 rounded-full transition-colors shrink-0 ${
              isListening
                ? "bg-red-500 text-white animate-pulse"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
            title="Ricerca vocale"
          >
            🎤
          </button>
        </div>

        <button
          type="submit"
          disabled={isSearching}
          className="w-full sm:w-auto px-6 py-3 bg-slate-900 text-white font-bold rounded-full hover:bg-slate-800 transition-colors disabled:opacity-50 shadow-lg sm:shadow-none whitespace-nowrap"
        >
          {isSearching ? "✨ Cerco..." : "Cerca IA"}
        </button>
      </form>

      {imagePreview && (
        <div className="mt-4 mx-auto w-fit bg-white px-5 py-3 rounded-2xl shadow-sm border border-slate-200 flex items-center gap-4 animate-fade-in">
          <div className="relative">
            <img
              src={imagePreview}
              alt="Anteprima"
              className="h-14 w-14 object-cover rounded-xl border border-slate-200"
            />
            <button
              type="button"
              onClick={removeImage}
              className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold shadow-md transition-colors"
            >
              ×
            </button>
          </div>
          <p className="text-sm text-slate-600 font-medium pr-2">
            Immagine pronta per l'analisi
          </p>
        </div>
      )}
    </div>
  );
}
