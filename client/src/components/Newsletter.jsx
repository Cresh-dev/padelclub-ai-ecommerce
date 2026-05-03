import { useState } from "react";

function Newsletter() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email) {
      setSubmitted(true);
      setEmail("");
      setTimeout(() => setSubmitted(false), 3000);
    }
  };

  return (
    <section className="bg-gradient-to-r from-primary-600 to-primary-500 py-12 md:py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center text-white space-y-6">
        <h2 className="text-3xl md:text-4xl font-black">
          Iscriviti alla newsletter
        </h2>
        <p className="text-base md:text-lg opacity-90">
          Ricevi offerte esclusive, consigli su padel e le novità dal nostro
          catalogo direttamente nella tua casella email.
        </p>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
        >
          <input
            type="email"
            placeholder="Inserisci la tua email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="flex-1 px-4 py-3 rounded-lg text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-white"
          />
          <button
            type="submit"
            className="px-6 py-3 bg-white text-primary-600 font-bold rounded-lg hover:bg-slate-100 transition text-sm md:text-base whitespace-nowrap"
          >
            Iscriviti
          </button>
        </form>

        {submitted && (
          <div className="p-3 bg-white/20 text-white rounded-lg text-sm font-medium">
            ✓ Grazie! Ti abbiamo aggiunto alla newsletter
          </div>
        )}

        <p className="text-xs md:text-sm opacity-75">
          Non condivideremo mai la tua email con terzi. Potrai cancellarti in
          qualsiasi momento.
        </p>
      </div>
    </section>
  );
}

export default Newsletter;
