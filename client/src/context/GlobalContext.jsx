import { createContext, useContext, useState, useEffect } from "react";
import toast from "react-hot-toast";

const GlobalContext = createContext();

export function GlobalProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [favorites, setFavorites] = useState([]);
  const [isFavoritesOpen, setIsFavoritesOpen] = useState(false);
  const [appliedPromo, setAppliedPromo] = useState(() => {
    const saved = localStorage.getItem("appliedPromoCode");
    try {
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");
    const savedCart = localStorage.getItem("cart");
    const savedFavorites = localStorage.getItem("favorites");

    if (token && userData) {
      setIsAuthenticated(true);
      setUser(JSON.parse(userData));
    }
    if (savedCart) setCart(JSON.parse(savedCart));
    if (savedFavorites) setFavorites(JSON.parse(savedFavorites));
  }, []);

  const login = (token, userData) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(userData));
    setIsAuthenticated(true);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsAuthenticated(false);
    setUser(null);
  };

  const clearCart = () => {
    setCart([]);
    setAppliedPromo(null);
    localStorage.removeItem("cart");
    localStorage.removeItem("appliedPromoCode");
  };

  const addToCart = (product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item._id === product._id);
      let newCart;
      if (existing) {
        newCart = prev.map((item) =>
          item._id === product._id
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        );
      } else {
        newCart = [...prev, { ...product, quantity: 1 }];
      }
      localStorage.setItem("cart", JSON.stringify(newCart));
      return newCart;
    });

    setIsCartOpen(true);
    toast.success(`${product.name} aggiunto al carrello!`);
  };

  const removeFromCart = (productId) => {
    setCart((prev) => {
      const newCart = prev.filter((item) => item._id !== productId);
      localStorage.setItem("cart", JSON.stringify(newCart));
      return newCart;
    });
  };

  const updateQuantity = (productId, delta) => {
    setCart((prev) => {
      const newCart = prev.map((item) => {
        if (item._id === productId) {
          const newQty = item.quantity + delta;
          return { ...item, quantity: newQty > 0 ? newQty : 1 };
        }
        return item;
      });
      localStorage.setItem("cart", JSON.stringify(newCart));
      return newCart;
    });
  };

  const toggleFavorite = (product) => {
    const isFav = favorites.some((p) => p._id === product._id);

    if (isFav) {
      toast.error("Rimosso dai preferiti", { icon: "🗑️" });
    } else {
      toast.success("Aggiunto ai preferiti!", { icon: "❤️" });
    }

    setFavorites((prev) => {
      let newFavs;
      if (isFav) {
        newFavs = prev.filter((p) => p._id !== product._id);
      } else {
        newFavs = [...prev, product];
      }
      localStorage.setItem("favorites", JSON.stringify(newFavs));
      return newFavs;
    });
  };

  const isFavorite = (productId) => favorites.some((p) => p._id === productId);

  const cartTotal = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  );
  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
  const favoritesCount = favorites.length;

  // Convalida delle condizioni del coupon
  const checkPromoValidity = (promo, currentCart, currentCartTotal) => {
    if (promo.minSpend && promo.minSpend > 0) {
      if (currentCartTotal < promo.minSpend) {
        return {
          valid: false,
          error: `Soglia minima di €${promo.minSpend} non raggiunta (totale attuale: €${currentCartTotal.toFixed(2)})`
        };
      }
    }

    if (promo.requiredCategories && promo.requiredCategories.length > 0) {
      const cartCategories = currentCart.map(item => item.category);
      const missingCategories = promo.requiredCategories.filter(
        reqCat => !cartCategories.includes(reqCat)
      );

      if (missingCategories.length > 0) {
        return {
          valid: false,
          error: `Richiede prodotti di categoria: ${missingCategories.join(', ')}`
        };
      }
    }

    return { valid: true };
  };

  const applyPromoCode = (code) => {
    if (!code || !code.trim()) {
      return { success: false, message: "Inserisci un codice promozionale." };
    }

    const savedCampaignStr = localStorage.getItem("activeVipCampaign");
    if (!savedCampaignStr) {
      return { success: false, message: "Non hai offerte attive. Generane una nell'Area VIP!" };
    }

    try {
      const activeCampaign = JSON.parse(savedCampaignStr);
      if (activeCampaign.promoCode.trim().toUpperCase() !== code.trim().toUpperCase()) {
        return { success: false, message: "Codice promozionale non valido." };
      }

      const check = checkPromoValidity(activeCampaign, cart, cartTotal);
      if (!check.valid) {
        return { success: false, message: check.error };
      }

      setAppliedPromo(activeCampaign);
      localStorage.setItem("appliedPromoCode", JSON.stringify(activeCampaign));
      toast.success("Codice promozionale applicato! 🎉");
      return { success: true };
    } catch (e) {
      console.error(e);
      return { success: false, message: "Errore durante l'applicazione della promo." };
    }
  };

  const removePromoCode = () => {
    setAppliedPromo(null);
    localStorage.removeItem("appliedPromoCode");
    toast.success("Codice promozionale rimosso.");
  };

  // Ricalcola lo sconto in euro ed eventuale omaggio sbloccato
  let promoDiscount = 0;
  let promoGift = "";

  if (appliedPromo) {
    if (appliedPromo.discountType === "percentage") {
      promoDiscount = cartTotal * (appliedPromo.discountValue / 100);
    } else if (appliedPromo.discountType === "fixed") {
      promoDiscount = Math.min(appliedPromo.discountValue, cartTotal);
    }
    if (appliedPromo.discountType === "bundle" && appliedPromo.bundleGift) {
      promoGift = appliedPromo.bundleGift;
    }
  }

  // Effetto per monitorare se i requisiti del coupon cambiano in tempo reale
  useEffect(() => {
    if (appliedPromo) {
      const check = checkPromoValidity(appliedPromo, cart, cartTotal);
      if (!check.valid) {
        setAppliedPromo(null);
        localStorage.removeItem("appliedPromoCode");
        toast.error(`Promo rimossa: ${check.error}`, { duration: 5000 });
      }
    }
  }, [cart, cartTotal, appliedPromo]);

  return (
    <GlobalContext.Provider
      value={{
        user,
        isAuthenticated,
        login,
        logout,
        cart,
        cartCount,
        cartTotal,
        isCartOpen,
        setIsCartOpen,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        favorites,
        favoritesCount,
        isFavoritesOpen,
        setIsFavoritesOpen,
        toggleFavorite,
        isFavorite,
        appliedPromo,
        promoDiscount,
        promoGift,
        applyPromoCode,
        removePromoCode,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
}

export const useGlobal = () => useContext(GlobalContext);
