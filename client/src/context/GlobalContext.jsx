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
    localStorage.removeItem("cart");
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
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
}

export const useGlobal = () => useContext(GlobalContext);
