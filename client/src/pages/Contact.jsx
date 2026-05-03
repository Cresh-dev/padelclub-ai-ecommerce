import { useState } from "react";

function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setFormData({ name: "", email: "", message: "" });
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <div className="min-h-screen bg-slate-50 pt-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
        <h1 className="text-4xl font-black text-slate-900 mb-8">Contattaci</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">
                Informazioni di Contatto
              </h2>
              <div className="space-y-4 text-slate-700">
                <p>
                  <strong className="text-slate-900">Email:</strong>{" "}
                  info@padelclubai.com
                </p>
                <p>
                  <strong className="text-slate-900">Telefono:</strong> +39 02
                  xxxx xxxx
                </p>
                <p>
                  <strong className="text-slate-900">Indirizzo:</strong> Bari,
                  Italy
                </p>
              </div>
            </div>
          </div>

          <form
            onSubmit={handleSubmit}
            className="bg-white rounded-2xl border border-slate-200 p-8 space-y-4"
          >
            <h2 className="text-2xl font-bold text-slate-900 mb-6">
              Invia un Messaggio
            </h2>

            <input
              type="text"
              placeholder="Il tuo nome"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              required
              className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-600"
            />

            <input
              type="email"
              placeholder="La tua email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              required
              className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-600"
            />

            <textarea
              placeholder="Il tuo messaggio"
              value={formData.message}
              onChange={(e) =>
                setFormData({ ...formData, message: e.target.value })
              }
              rows="5"
              required
              className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-600 resize-none"
            />

            <button
              type="submit"
              className="w-full py-3 bg-primary-600 text-white font-bold rounded-lg hover:bg-primary-700 transition"
            >
              Invia Messaggio
            </button>

            {submitted && (
              <div className="p-3 bg-green-50 text-green-700 rounded-lg text-sm font-medium">
                ✓ Grazie! Ti risponderemo presto.
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}

export default Contact;
