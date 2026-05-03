import axios from "axios";

const API_BASE_URL =
  import.meta.env.MODE === "production"
    ? "https://padelclub-ai-ecommerce.onrender.com/api"
    : "http://localhost:8000/api";

const api = axios.create({
  baseURL: API_BASE_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authAPI = {
  register: (email, name, password) =>
    api.post("/auth/register", { email, name, password }),
  login: (email, password) => api.post("/auth/login", { email, password }),
};

export const productsAPI = {
  getAll: (filters) => {
    if (!filters) {
      return api.get("/products");
    }
    const params = new URLSearchParams();
    if (filters.category && filters.category !== "Tutte")
      params.append("category", filters.category);
    if (filters.minPrice !== undefined && filters.minPrice > 0)
      params.append("minPrice", filters.minPrice);
    if (filters.maxPrice !== undefined && filters.maxPrice < 500)
      params.append("maxPrice", filters.maxPrice);
    if (filters.style && filters.style.length > 0)
      params.append("style", filters.style.join(","));
    if (filters.inStock === true) params.append("inStock", "true");
    if (filters.search && filters.search.trim())
      params.append("search", filters.search);
    if (filters.trending === true) params.append("trending", "true");

    const queryString = params.toString();
    if (!queryString) {
      return api.get("/products");
    }
    return api.get(`/products?${queryString}`);
  },
  getById: (id) => api.get(`/products/${id}`),
  create: (product) => api.post("/products", product),
  update: (id, product) => api.put(`/products/${id}`, product),
  delete: (id) => api.delete(`/products/${id}`),
};

export const recommendationsAPI = {
  getAll: () => api.get("/recommendations"),
  getById: (id) => api.get(`/recommendations/${id}`),
  create: (preferences) => api.post("/recommendations", preferences),
};

export const reviewsAPI = {
  getByProduct: (productId) => api.get(`/reviews/product/${productId}`),
  getStats: (productId) => api.get(`/reviews/stats/${productId}`),
  create: (review) => api.post("/reviews", review),
};

export default api;
