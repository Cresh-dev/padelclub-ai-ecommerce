function TermsOfService() {
  return (
    <div className="min-h-screen bg-slate-50 pt-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
        <h1 className="text-4xl font-black text-slate-900 mb-8">Termini di Servizio</h1>
        
        <div className="bg-white rounded-2xl border border-slate-200 p-8 space-y-8">
          <section className="space-y-3">
            <h2 className="text-2xl font-bold text-slate-900">1. Accettazione dei Termini</h2>
            <p className="text-slate-700 leading-relaxed">
              Utilizzando Padel Club AI, accetti questi termini di servizio. Se non accetti, ti preghiamo di non utilizzare il nostro sito.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-bold text-slate-900">2. Licenza di Utilizzo</h2>
            <p className="text-slate-700 leading-relaxed">
              Ti viene concessa una licenza limitata, non esclusiva e revocabile per accedere e utilizzare Padel Club AI per scopi personali e non commerciali.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-bold text-slate-900">3. Restrizioni di Utilizzo</h2>
            <p className="text-slate-700 leading-relaxed">
              Non puoi: riprodurre, distribuire, modificare o sfruttare commercialmente il contenuto senza autorizzazione. Qualsiasi violazione comporterà la risoluzione immediata della tua licenza.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-bold text-slate-900">4. Esclusioni di Responsabilità</h2>
            <p className="text-slate-700 leading-relaxed">
              Padel Club AI non è responsabile di danni indiretti, incidentali o consequenziali derivanti dall'uso del nostro servizio.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}

export default TermsOfService;
