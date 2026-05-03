function Testimonials() {
  const testimonials = [
    {
      name: "Marco R.",
      text: "Le raccomandazioni AI mi hanno aiutato a trovare la racchetta perfetta per il mio livello!",
      rating: 5,
    },
    {
      name: "Giulia P.",
      text: "Catalogo fantastico e il servizio è veloce. Consigliatissimo!",
      rating: 5,
    },
    {
      name: "Andrea S.",
      text: "Ottima qualità dei prodotti e prezzi competitivi.",
      rating: 4,
    },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-8 text-center">Cosa dicono i nostri clienti</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {testimonials.map((testimonial, idx) => (
          <div key={idx} className="bg-white rounded-lg p-6 border border-slate-200">
            <div className="flex gap-1 mb-3">
              {Array(testimonial.rating)
                .fill(0)
                .map((_, i) => (
                  <span key={i} className="text-yellow-400">★</span>
                ))}
            </div>
            <p className="text-slate-700 mb-4 italic">"{testimonial.text}"</p>
            <p className="font-semibold text-slate-900">{testimonial.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Testimonials;
