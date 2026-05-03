import { useState, useRef, useEffect } from "react";
import api from "../services/api";
import ProductModal from "../components/ProductModal";

export default function RecommendationPage() {
  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text: "Ciao! Sono PadelBot 🎾. Sono qui per trovarti l'attrezzatura perfetta. Iniziamo subito: che tipo di prodotto stai cercando e a che livello giochi?",
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  useEffect(() => scrollToBottom(), [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const userMsg = { sender: "user", text: inputMessage };
    const newChatHistory = [...messages, userMsg];
    setMessages(newChatHistory);
    setInputMessage("");
    setIsTyping(true);

    try {
      const { data } = await api.post("/chatbot", {
        messages: newChatHistory,
      });

      const botMsg = {
        sender: "bot",
        text: data.reply,
        products: data.products,
      };
      setMessages((prev) => [...prev, botMsg]);
    } catch (error) {
      console.error(error);
      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: "Scusa, ho avuto un calo di connessione. Puoi ripetere?",
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pt-28 pb-20 px-4 flex justify-center">
      <div className="w-full max-w-2xl bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden flex flex-col h-[75vh]">
        <div className="bg-slate-900 p-4 text-white flex items-center gap-3 shrink-0">
          <div className="w-10 h-10 bg-teal-500 rounded-full flex items-center justify-center text-xl">
            🤖
          </div>
          <div>
            <h2 className="font-bold">PadelBot IA</h2>
            <p className="text-xs text-teal-400 flex items-center gap-1">
              <span className="w-2 h-2 bg-teal-400 rounded-full animate-pulse"></span>{" "}
              Online
            </p>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[80%] rounded-2xl p-4 ${
                  msg.sender === "user"
                    ? "bg-orange-500 text-white rounded-tr-none shadow-md"
                    : "bg-white border border-slate-200 text-slate-800 rounded-tl-none shadow-sm"
                }`}
              >
                <p className="leading-relaxed whitespace-pre-wrap">
                  {msg.text}
                </p>

                {msg.products && msg.products.length > 0 && (
                  <div className="mt-4 space-y-3">
                    <p className="text-xs font-bold text-teal-600 uppercase tracking-wider">
                      Trovati per te:
                    </p>
                    {msg.products.map((product) => (
                      <div
                        key={product._id}
                        onClick={() => {
                          setSelectedProduct(product);
                          setIsModalOpen(true);
                        }}
                        className="flex items-center gap-3 bg-slate-50 p-2 rounded-xl border border-slate-100 cursor-pointer hover:border-orange-300 hover:shadow-sm transition-all"
                      >
                        <img
                          src={
                            product.image ||
                            "https://images.unsplash.com/photo-1622279457486-62dcc4a631d6?w=100&q=80"
                          }
                          alt={product.name}
                          className="w-12 h-12 rounded-lg object-cover bg-white"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src =
                              "https://images.unsplash.com/photo-1622279457486-62dcc4a631d6?w=100&q=80";
                          }}
                        />
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-sm truncate">
                            {product.name}
                          </p>
                          <p className="text-orange-500 font-black text-xs">
                            €{product.price}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-white border border-slate-200 rounded-2xl rounded-tl-none p-4 shadow-sm flex items-center gap-1">
                <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></span>
                <span
                  className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"
                  style={{ animationDelay: "0.2s" }}
                ></span>
                <span
                  className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"
                  style={{ animationDelay: "0.4s" }}
                ></span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="p-4 bg-white border-t border-slate-100 shrink-0">
          <form
            onSubmit={handleSendMessage}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Scrivi qui a PadelBot..."
              className="flex-1 bg-slate-100 border-none outline-none px-4 py-3 rounded-full focus:ring-2 focus:ring-orange-200 transition-shadow"
            />
            <button
              type="submit"
              disabled={isTyping || !inputMessage.trim()}
              className="w-12 h-12 bg-slate-900 text-white rounded-full flex justify-center items-center font-bold hover:bg-slate-800 disabled:opacity-50 transition-colors"
            >
              ➤
            </button>
          </form>
        </div>
      </div>

      <ProductModal
        product={selectedProduct}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
