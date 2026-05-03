function Returns() {
  return (
    <div className="min-h-screen bg-slate-50 pt-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
        <h1 className="text-4xl font-black text-slate-900 mb-8">Resi e Rimborsi</h1>
        
        <div className="bg-white rounded-2xl border border-slate-200 p-8 space-y-8">
          <section className="space-y-3">
            <h2 className="text-2xl font-bold text-slate-900">Politica di Reso</h2>
            <p className="text-slate-700 leading-relaxed">
              Puoi restituire prodotti entro 30 giorni dall'acquisto se il prodotto è inutilizzato e in condizioni originali.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-bold text-slate-900">Come Effettuare un Reso</h2>
            <ol className="list-decimal list-inside space-y-2 text-slate-700">
              <li>Contattaci a info@padelclubai.com con il numero dell'ordine</li>
              <li>Riceverai un'etichetta di reso</li>
              <li>Spedisci il prodotto utilizzando l'etichetta fornita</li>
              <li>Una volta ricevuto, elaboreremo il rimborso</li>
            </ol>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-bold text-slate-900">Rimborsi</h2>
            <p className="text-slate-700 leading-relaxed">
              I rimborsi vengono elaborati entro 5-7 giorni lavorativi dal ricevimento del reso. Il rimborso sarà accreditato sul tuo metodo di pagamento originale.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}

export default Returns;
