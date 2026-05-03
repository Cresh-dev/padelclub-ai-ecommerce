function CookiesPolicy() {
  return (
    <div className="min-h-screen bg-slate-50 pt-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
        <h1 className="text-4xl font-black text-slate-900 mb-8">Politica sui Cookie</h1>
        
        <div className="bg-white rounded-2xl border border-slate-200 p-8 space-y-8">
          <section className="space-y-3">
            <h2 className="text-2xl font-bold text-slate-900">Cosa sono i Cookie?</h2>
            <p className="text-slate-700 leading-relaxed">
              I cookie sono piccoli file di testo memorizzati nel tuo browser. Utilizziamo i cookie per migliorare la tua esperienza e comprendere come usi Padel Club AI.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-bold text-slate-900">Tipi di Cookie che Utilizziamo</h2>
            <ul className="list-disc list-inside space-y-2 text-slate-700">
              <li>Cookie di autenticazione per mantenere la tua sessione</li>
              <li>Cookie analitici per capire il comportamento dell'utente</li>
              <li>Cookie di preferenza per ricordare le tue impostazioni</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-bold text-slate-900">Gestione dei Cookie</h2>
            <p className="text-slate-700 leading-relaxed">
              Puoi controllare e/o eliminare i cookie dalle impostazioni del tuo browser. Tuttavia, disabilitare i cookie potrebbe influire sulla funzionalità del nostro sito.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}

export default CookiesPolicy;
