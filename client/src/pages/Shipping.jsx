function Shipping() {
  return (
    <div className="min-h-screen bg-slate-50 pt-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
        <h1 className="text-4xl font-black text-slate-900 mb-8">Spedizioni</h1>
        
        <div className="bg-white rounded-2xl border border-slate-200 p-8 space-y-8">
          <section className="space-y-3">
            <h2 className="text-2xl font-bold text-slate-900">Tempi di Spedizione</h2>
            <ul className="list-disc list-inside space-y-2 text-slate-700">
              <li>Consegna standard: 5-7 giorni lavorativi</li>
              <li>Consegna express: 2-3 giorni lavorativi</li>
              <li>Ritiro in negozio: disponibile presso i nostri punti</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-bold text-slate-900">Costi di Spedizione</h2>
            <ul className="list-disc list-inside space-y-2 text-slate-700">
              <li>Spedizione standard: €5,99 (gratis sopra €50)</li>
              <li>Spedizione express: €12,99</li>
              <li>Ritiro in negozio: gratuito</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-bold text-slate-900">Tracciamento</h2>
            <p className="text-slate-700 leading-relaxed">
              Riceverai un numero di tracciamento via email che ti permetterà di monitorare il tuo ordine in tempo reale.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}

export default Shipping;
