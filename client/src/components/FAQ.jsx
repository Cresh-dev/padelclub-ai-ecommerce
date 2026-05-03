import { useState } from "react";

function FAQ() {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    { question: "Cosa offre Padel Club AI?", answer: "Padel Club AI offre un catalogo di attrezzature per padel con raccomandazioni personalizzate basate su AI." },
    { question: "Come funzionano le raccomandazioni AI?", answer: "Utilizzando Google Gemini AI, analizziamo il tuo livello, stile di gioco e preferenze per suggerire i prodotti migliori." },
    { question: "Posso ordinare direttamente dal sito?", answer: "Attualmente visualizziamo i prodotti e puoi aggiungerli al carrello. Le funzionalità di checkout sono in fase di sviluppo." },
    { question: "Quali pagamenti accettate?", answer: "Accettiamo carte di credito, PayPal e bonifici bancari. I dettagli specifici saranno disponibili al checkout." },
  ];

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-slate-900 mb-6">Domande Frequenti</h2>
      {faqs.map((faq, idx) => (
        <div key={idx} className="border border-slate-200 rounded-lg overflow-hidden">
          <button
            onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
            className="w-full p-4 bg-white hover:bg-slate-50 transition flex items-center justify-between"
          >
            <span className="font-semibold text-slate-900 text-left">{faq.question}</span>
            <span className="text-primary-600 text-xl ml-4">{openIndex === idx ? "−" : "+"}</span>
          </button>
          {openIndex === idx && (
            <div className="p-4 bg-slate-50 border-t border-slate-200 text-slate-700 text-sm">
              {faq.answer}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default FAQ;
