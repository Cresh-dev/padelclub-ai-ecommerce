import { useState, useEffect } from "react";
import { reviewsAPI } from "../services/api";

export default function ProductReviews({ productId }) {
  const [reviews, setReviews] = useState([]);
  const [stats, setStats] = useState(null);
  const [newReview, setNewReview] = useState({
    userName: "",
    rating: 5,
    text: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    loadReviews();
    loadStats();
  }, [productId]);

  const loadReviews = async () => {
    try {
      const response = await reviewsAPI.getByProduct(productId);
      setReviews(response.data);
    } catch (error) {
      console.error("Errore nel caricamento recensioni:", error);
    }
  };

  const loadStats = async () => {
    try {
      const response = await reviewsAPI.getStats(productId);
      setStats(response.data);
    } catch (error) {
      console.error("Errore nel caricamento statistiche:", error);
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!newReview.userName.trim() || !newReview.text.trim()) return;

    setIsSubmitting(true);
    try {
      await reviewsAPI.create({ productId, ...newReview });
      setNewReview({ userName: "", rating: 5, text: "" });
      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 3000);
      loadReviews();
      loadStats();
    } catch (error) {
      alert("Errore nell'invio della recensione");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-200 pb-6">
        <h3 className="text-2xl font-black text-slate-900">
          Recensioni Clienti
        </h3>
        {stats && (
          <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-2xl border border-slate-200 shadow-sm">
            <span className="text-3xl font-black text-orange-500">
              {stats.averageRating}
            </span>
            <div className="flex flex-col">
              <div className="flex text-orange-400 text-sm">
                {Array(5)
                  .fill(0)
                  .map((_, i) => (
                    <span
                      key={i}
                      className={
                        i < Math.round(stats.averageRating)
                          ? "opacity-100"
                          : "opacity-30"
                      }
                    >
                      ★
                    </span>
                  ))}
              </div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                su {stats.totalReviews} voti
              </span>
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-1 space-y-4">
          <h4 className="text-lg font-bold text-slate-900">
            Scrivi un'opinione
          </h4>
          <form
            onSubmit={handleSubmitReview}
            className="space-y-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm"
          >
            <input
              type="text"
              placeholder="Il tuo nome"
              value={newReview.userName}
              onChange={(e) =>
                setNewReview({ ...newReview, userName: e.target.value })
              }
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
            <select
              value={newReview.rating}
              onChange={(e) =>
                setNewReview({ ...newReview, rating: Number(e.target.value) })
              }
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 appearance-none"
            >
              <option value="5">⭐⭐⭐⭐⭐ Eccellente</option>
              <option value="4">⭐⭐⭐⭐ Buono</option>
              <option value="3">⭐⭐⭐ Medio</option>
              <option value="2">⭐⭐ Scarso</option>
              <option value="1">⭐ Pessimo</option>
            </select>
            <textarea
              placeholder="Cosa ne pensi del prodotto?"
              value={newReview.text}
              onChange={(e) =>
                setNewReview({ ...newReview, text: e.target.value })
              }
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none h-24"
            />
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition disabled:opacity-50"
            >
              {isSubmitting ? "Invio..." : "Pubblica"}
            </button>
            {submitted && (
              <div className="p-3 bg-green-50 text-green-600 rounded-xl text-sm font-bold text-center border border-green-200">
                Grazie per la recensione!
              </div>
            )}
          </form>
        </div>

        <div className="lg:col-span-2 space-y-4">
          {reviews.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-10 text-center">
              <span className="text-4xl mb-4 block">💬</span>
              <p className="text-slate-500 font-medium">
                Ancora nessuna recensione. Sii il primo a condividere la tua
                opinione!
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {reviews.map((review) => (
                <div
                  key={review._id}
                  className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <p className="font-bold text-slate-900">
                        {review.userName}
                      </p>
                      <div className="flex text-orange-400 text-xs mt-1">
                        {Array(5)
                          .fill(0)
                          .map((_, i) => (
                            <span
                              key={i}
                              className={
                                i < review.rating ? "opacity-100" : "opacity-30"
                              }
                            >
                              ★
                            </span>
                          ))}
                      </div>
                    </div>
                    <span className="text-xs text-slate-400 font-medium">
                      {new Date(review.createdAt).toLocaleDateString("it-IT")}
                    </span>
                  </div>
                  <p className="text-slate-600 leading-relaxed text-sm">
                    {review.text}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
