import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-brand-dark text-slate-300 py-16 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          <div className="space-y-4">
            <h4 className="text-2xl font-black text-white tracking-tight">
              Padel<span className="text-brand-primary">Club</span>
            </h4>
            <p className="text-sm font-medium leading-relaxed opacity-80">
              La piattaforma e-commerce per gli appassionati di padel con
              raccomandazioni AI personalizzate basate su Google Gemini.
            </p>
            <div className="flex gap-4 pt-4">
              {["📸", "🐦", "💼"].map((icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-10 h-10 bg-slate-800 rounded-xl flex items-center justify-center hover:bg-brand-primary hover:text-white transition-all"
                >
                  {icon}
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-white font-bold mb-6 uppercase tracking-wider text-sm">
              Navigazione
            </h4>
            <ul className="space-y-3">
              <li>
                <Link
                  to="/"
                  className="text-sm hover:text-brand-primary transition-colors"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/shop"
                  className="text-sm hover:text-brand-primary transition-colors"
                >
                  Catalogo
                </Link>
              </li>
              <li>
                <Link
                  to="/recommendations"
                  className="text-sm hover:text-brand-accent transition-colors"
                >
                  Raccomandazioni IA
                </Link>
              </li>
              <li>
                <Link
                  to="/auth"
                  className="text-sm hover:text-brand-primary transition-colors"
                >
                  Account
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-6 uppercase tracking-wider text-sm">
              Supporto
            </h4>
            <ul className="space-y-3">
              <li>
                <Link
                  to="/faq"
                  className="text-sm hover:text-brand-primary transition-colors"
                >
                  FAQ
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="text-sm hover:text-brand-primary transition-colors"
                >
                  Contatti
                </Link>
              </li>
              <li>
                <Link
                  to="/shipping"
                  className="text-sm hover:text-brand-primary transition-colors"
                >
                  Spedizioni
                </Link>
              </li>
              <li>
                <Link
                  to="/returns"
                  className="text-sm hover:text-brand-primary transition-colors"
                >
                  Resi
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-6 uppercase tracking-wider text-sm">
              Legale
            </h4>
            <ul className="space-y-3">
              <li>
                <Link
                  to="/privacy"
                  className="text-sm hover:text-brand-primary transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  to="/terms"
                  className="text-sm hover:text-brand-primary transition-colors"
                >
                  Termini di Servizio
                </Link>
              </li>
              <li>
                <Link
                  to="/cookies"
                  className="text-sm hover:text-brand-primary transition-colors"
                >
                  Cookie Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-sm space-y-1 text-center md:text-left">
            <p>
              <span className="font-bold text-white">Email:</span>{" "}
              info@padelclubai.com
            </p>
            <p>
              <span className="font-bold text-white">Tel:</span> +39 02 xxxx
              xxxx
            </p>
          </div>
          <p className="text-sm opacity-60">
            &copy; {new Date().getFullYear()} Padel Club AI. Tutti i diritti
            riservati.
          </p>
        </div>
      </div>
    </footer>
  );
}
