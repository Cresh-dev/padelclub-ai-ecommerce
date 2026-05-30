import { useState, useEffect } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

const TABS = [
  { key: 'overview', label: '📊 Panoramica' },
  { key: 'products', label: '📦 Prodotti' },
  { key: 'users', label: '👥 Utenti' },
  { key: 'reviews', label: '⭐ Recensioni' },
];

const CATEGORIES = ['Tutte', 'Racchette', 'Calzature', 'Accessori', 'Abbigliamento', 'Borse'];
const PIE_COLORS = ['#f97316', '#14b8a6', '#8b5cf6', '#ec4899', '#06b6d4'];

const MONTH_NAMES = ['Gen', 'Feb', 'Mar', 'Apr', 'Mag', 'Giu', 'Lug', 'Ago', 'Set', 'Ott', 'Nov', 'Dic'];

function Spinner() {
  return (
    <div className="flex items-center justify-center py-20">
      <div className="w-12 h-12 border-4 border-orange-500/30 border-t-orange-500 rounded-full animate-spin" />
    </div>
  );
}

function formatMonth(val) {
  if (typeof val === 'number' && val >= 1 && val <= 12) {
    return MONTH_NAMES[val - 1];
  }
  if (typeof val === 'string' && val.includes('-')) {
    const parts = val.split('-');
    const monthIdx = parseInt(parts[1], 10) - 1;
    if (monthIdx >= 0 && monthIdx < 12) {
      return MONTH_NAMES[monthIdx];
    }
  }
  return val;
}

// ─── CATEGORY BADGE ─────────────────────────────────────────────────────────────
const categoryColors = {
  Racchette: 'bg-orange-500/20 text-orange-400',
  Calzature: 'bg-teal-500/20 text-teal-400',
  Accessori: 'bg-purple-500/20 text-purple-400',
  Abbigliamento: 'bg-pink-500/20 text-pink-400',
  Borse: 'bg-cyan-500/20 text-cyan-400',
};

function CategoryBadge({ category }) {
  const color = categoryColors[category] || 'bg-slate-600/20 text-slate-400';
  return (
    <span className={`px-3 py-1 rounded-full text-xs font-bold ${color}`}>
      {category}
    </span>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// ─── OVERVIEW TAB ─────────────────────────────────────────────────────────────
// ═══════════════════════════════════════════════════════════════════════════════
function OverviewTab() {
  const [stats, setStats] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [statsRes, analyticsRes] = await Promise.all([
          api.get('/admin/stats'),
          api.get('/admin/analytics'),
        ]);
        setStats(statsRes.data);
        setAnalytics(analyticsRes.data);
      } catch (err) {
        toast.error('Errore nel caricamento delle statistiche');
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) return <Spinner />;

  const kpis = [
    { emoji: '👥', value: stats?.totalUsers ?? 0, label: 'Utenti Totali', bg: 'from-blue-500/10 to-blue-600/5' },
    { emoji: '📦', value: stats?.totalProducts ?? 0, label: 'Prodotti in Catalogo', bg: 'from-orange-500/10 to-orange-600/5' },
    { emoji: '⭐', value: stats?.totalReviews ?? 0, label: 'Recensioni Totali', bg: 'from-yellow-500/10 to-yellow-600/5' },
    { emoji: '🏆', value: (stats?.averageRating ?? 0).toFixed(1), label: 'Rating Medio', bg: 'from-teal-500/10 to-teal-600/5' },
    { emoji: '🤖', value: stats?.totalRecommendations ?? 0, label: 'Raccomandazioni IA', bg: 'from-purple-500/10 to-purple-600/5' },
    { emoji: '🚫', value: stats?.outOfStockProducts ?? 0, label: 'Prodotti Esauriti', bg: 'from-red-500/10 to-red-600/5' },
  ];

  const userRegData = (analytics?.usersByMonth ?? []).map((item) => ({
    ...item,
    monthLabel: formatMonth(item._id),
  }));

  const reviewsByMonthData = (analytics?.reviewsByMonth ?? []).map((item) => ({
    ...item,
    monthLabel: formatMonth(item._id),
  }));

  const categoryDist = stats?.productsByCategory ?? [];

  return (
    <div className="space-y-8">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {kpis.map((kpi, i) => (
          <div
            key={i}
            className={`bg-gradient-to-br ${kpi.bg} bg-slate-800/60 backdrop-blur-sm rounded-2xl p-6 border border-white/5 shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-300`}
          >
            <div className="text-3xl mb-2">{kpi.emoji}</div>
            <div className="text-3xl font-black font-mono text-white">{kpi.value}</div>
            <div className="text-sm font-semibold text-slate-400 mt-1">{kpi.label}</div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Registrations Area Chart */}
        <div className="bg-slate-800/60 backdrop-blur-sm rounded-2xl p-6 border border-white/5 shadow-lg">
          <h3 className="text-lg font-bold text-white mb-4">📈 Registrazioni Utenti</h3>
          {userRegData.length >= 2 ? (
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={userRegData}>
                <defs>
                  <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f97316" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="monthLabel" stroke="#94a3b8" fontSize={12} />
                <YAxis stroke="#94a3b8" fontSize={12} allowDecimals={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '12px', color: '#fff' }}
                  labelStyle={{ color: '#f97316' }}
                />
                <Area type="monotone" dataKey="count" stroke="#f97316" strokeWidth={2} fill="url(#colorUsers)" />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex flex-col items-center justify-center h-[300px] text-slate-500">
              <span className="text-4xl mb-3">📈</span>
              <p className="font-semibold">Dati insufficienti</p>
              <p className="text-sm text-slate-600">Servono almeno 2 mesi di registrazioni</p>
            </div>
          )}
        </div>

        {/* Reviews Bar Chart */}
        <div className="bg-slate-800/60 backdrop-blur-sm rounded-2xl p-6 border border-white/5 shadow-lg">
          <h3 className="text-lg font-bold text-white mb-4">📊 Recensioni per Mese</h3>
          {reviewsByMonthData.length >= 2 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={reviewsByMonthData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="monthLabel" stroke="#94a3b8" fontSize={12} />
                <YAxis stroke="#94a3b8" fontSize={12} allowDecimals={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '12px', color: '#fff' }}
                  labelStyle={{ color: '#14b8a6' }}
                />
                <Bar dataKey="count" fill="#14b8a6" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex flex-col items-center justify-center h-[300px] text-slate-500">
              <span className="text-4xl mb-3">📊</span>
              <p className="font-semibold">Dati insufficienti</p>
              <p className="text-sm text-slate-600">Servono almeno 2 mesi di recensioni</p>
            </div>
          )}
        </div>

        {/* Category Distribution Pie Chart */}
        <div className="bg-slate-800/60 backdrop-blur-sm rounded-2xl p-6 border border-white/5 shadow-lg lg:col-span-2">
          <h3 className="text-lg font-bold text-white mb-4">🥧 Distribuzione Prodotti per Categoria</h3>
          {categoryDist.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryDist}
                  dataKey="count"
                  nameKey="_id"
                  cx="50%"
                  cy="50%"
                  outerRadius={110}
                  innerRadius={55}
                  paddingAngle={3}
                  label={({ _id, percent }) => `${_id} (${(percent * 100).toFixed(0)}%)`}
                  labelLine={{ stroke: '#64748b' }}
                >
                  {categoryDist.map((_, i) => (
                    <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '12px', color: '#fff' }}
                />
                <Legend
                  wrapperStyle={{ color: '#94a3b8', fontSize: '13px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex flex-col items-center justify-center h-[300px] text-slate-500">
              <span className="text-4xl mb-3">🥧</span>
              <p className="font-semibold">Nessun dato disponibile</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// ─── PRODUCTS TAB ─────────────────────────────────────────────────────────────
// ═══════════════════════════════════════════════════════════════════════════════
function ProductsTab() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Tutte');

  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await api.get('/admin/products');
        setProducts(res.data);
      } catch (err) {
        toast.error('Errore nel caricamento dei prodotti');
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, []);

  const toggleTrending = async (id, currentTrending) => {
    const updated = products.map((p) =>
      p._id === id ? { ...p, trending: !currentTrending } : p
    );
    setProducts(updated);
    try {
      await api.put(`/admin/products/${id}/trending`, { trending: !currentTrending });
      toast.success('Trending aggiornato');
    } catch {
      setProducts(products);
      toast.error('Errore nell\'aggiornamento');
    }
  };

  const toggleStock = async (id, currentStock) => {
    const updated = products.map((p) =>
      p._id === id ? { ...p, inStock: !currentStock } : p
    );
    setProducts(updated);
    try {
      await api.put(`/admin/products/${id}/stock`, { inStock: !currentStock });
      toast.success('Stock aggiornato');
    } catch {
      setProducts(products);
      toast.error('Errore nell\'aggiornamento');
    }
  };

  const filtered = products.filter((p) => {
    const matchSearch = p.name?.toLowerCase().includes(search.toLowerCase());
    const matchCat = selectedCategory === 'Tutte' || p.category === selectedCategory;
    return matchSearch && matchCat;
  });

  if (loading) return <Spinner />;

  return (
    <div className="space-y-6">
      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">🔍</span>
          <input
            type="text"
            placeholder="Cerca prodotto..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-slate-800/60 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50 transition-all"
          />
        </div>
      </div>

      {/* Category Filter Buttons */}
      <div className="flex flex-wrap gap-2">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-xl text-sm font-bold transition-all duration-200 ${
              selectedCategory === cat
                ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/30'
                : 'bg-slate-800/60 text-slate-400 hover:text-white hover:bg-slate-700/60 border border-white/5'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-slate-800/60 backdrop-blur-sm rounded-2xl border border-white/5 shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Nome</th>
                <th className="text-left px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Categoria</th>
                <th className="text-left px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Prezzo</th>
                <th className="text-center px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">In Stock</th>
                <th className="text-center px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Trending</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filtered.map((product) => (
                <tr key={product._id} className="hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4 text-white font-bold text-sm">{product.name}</td>
                  <td className="px-6 py-4">
                    <CategoryBadge category={product.category} />
                  </td>
                  <td className="px-6 py-4 text-white font-mono text-sm">
                    €{product.price?.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button
                      onClick={() => toggleStock(product._id, product.inStock)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-200 ${
                        product.inStock
                          ? 'bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30'
                          : 'bg-red-500/20 text-red-400 hover:bg-red-500/30'
                      }`}
                    >
                      {product.inStock ? '✅ Disponibile' : '❌ Esaurito'}
                    </button>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button
                      onClick={() => toggleTrending(product._id, product.trending)}
                      className={`px-3 py-1.5 rounded-lg text-lg transition-all duration-200 hover:scale-110 ${
                        product.trending ? 'text-yellow-400' : 'text-slate-600 hover:text-slate-400'
                      }`}
                      title={product.trending ? 'Rimuovi da trending' : 'Segna come trending'}
                    >
                      {product.trending ? '⭐' : '☆'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="text-center py-12 text-slate-500">
              Nessun prodotto trovato
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// ─── USERS TAB ────────────────────────────────────────────────────────────────
// ═══════════════════════════════════════════════════════════════════════════════
function UsersTab() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    async function fetchUsers() {
      try {
        const res = await api.get('/admin/users');
        setUsers(res.data);
      } catch (err) {
        toast.error('Errore nel caricamento degli utenti');
      } finally {
        setLoading(false);
      }
    }
    fetchUsers();
  }, []);

  const filtered = users.filter((u) => {
    const q = search.toLowerCase();
    return (
      u.name?.toLowerCase().includes(q) ||
      u.email?.toLowerCase().includes(q)
    );
  });

  if (loading) return <Spinner />;

  return (
    <div className="space-y-6">
      {/* Search & Counter */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="relative flex-1 w-full">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">🔍</span>
          <input
            type="text"
            placeholder="Cerca per nome o email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-slate-800/60 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50 transition-all"
          />
        </div>
        <div className="bg-slate-800/60 backdrop-blur-sm px-5 py-3 rounded-xl border border-white/5">
          <span className="text-slate-400 text-sm font-semibold">Totale: </span>
          <span className="text-white font-black font-mono">{users.length}</span>
        </div>
      </div>

      {/* Table */}
      <div className="bg-slate-800/60 backdrop-blur-sm rounded-2xl border border-white/5 shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Nome</th>
                <th className="text-left px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Email</th>
                <th className="text-left px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Ruolo</th>
                <th className="text-left px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Livello</th>
                <th className="text-left px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Registrato il</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filtered.map((user) => (
                <tr key={user._id} className="hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4 text-white font-bold text-sm">{user.name}</td>
                  <td className="px-6 py-4 text-slate-300 text-sm">{user.email}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold ${
                        user.role === 'admin'
                          ? 'bg-orange-500/20 text-orange-400'
                          : 'bg-slate-600/30 text-slate-400'
                      }`}
                    >
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-300 text-sm capitalize">{user.skillLevel || '—'}</td>
                  <td className="px-6 py-4 text-slate-400 text-sm font-mono">
                    {user.createdAt
                      ? new Date(user.createdAt).toLocaleDateString('it-IT', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric',
                        })
                      : '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="text-center py-12 text-slate-500">
              Nessun utente trovato
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// ─── REVIEWS TAB ──────────────────────────────────────────────────────────────
// ═══════════════════════════════════════════════════════════════════════════════
function ReviewsTab() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchReviews() {
      try {
        const res = await api.get('/admin/reviews');
        setReviews(res.data);
      } catch (err) {
        toast.error('Errore nel caricamento delle recensioni');
      } finally {
        setLoading(false);
      }
    }
    fetchReviews();
  }, []);

  const handleDelete = async (id) => {
    if (!confirm('Sei sicuro di voler eliminare questa recensione?')) return;
    const prev = [...reviews];
    setReviews(reviews.filter((r) => r._id !== id));
    try {
      await api.delete(`/admin/reviews/${id}`);
      toast.success('Recensione eliminata');
    } catch {
      setReviews(prev);
      toast.error('Errore nell\'eliminazione');
    }
  };

  if (loading) return <Spinner />;

  return (
    <div className="space-y-4">
      {reviews.length === 0 ? (
        <div className="text-center py-16 text-slate-500">
          Nessuna recensione trovata
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {reviews.map((review) => (
            <div
              key={review._id}
              className="bg-slate-800/60 backdrop-blur-sm rounded-2xl p-6 border border-white/5 shadow-lg hover:shadow-xl transition-all duration-300 group"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h4 className="font-bold text-white text-sm">
                    {review.productId?.name || 'Prodotto'}
                  </h4>
                  {review.productId?.category && (
                    <CategoryBadge category={review.productId.category} />
                  )}
                </div>
                <button
                  onClick={() => handleDelete(review._id)}
                  className="opacity-0 group-hover:opacity-100 px-3 py-1.5 bg-red-500/20 text-red-400 hover:bg-red-500/30 rounded-lg text-xs font-bold transition-all duration-200"
                >
                  🗑️ Elimina
                </button>
              </div>

              <div className="flex items-center gap-2 mb-2">
                <span className="text-slate-400 text-xs font-semibold">
                  👤 {review.userName || 'Utente'}
                </span>
              </div>

              <div className="flex items-center gap-1 mb-3">
                {Array.from({ length: 5 }, (_, i) => (
                  <span key={i} className="text-sm">
                    {i < (review.rating || 0) ? '⭐' : '☆'}
                  </span>
                ))}
                <span className="text-slate-500 text-xs ml-2 font-mono">{review.rating}/5</span>
              </div>

              {review.text && (
                <p className="text-slate-300 text-sm leading-relaxed mb-3 line-clamp-3">
                  "{review.text}"
                </p>
              )}

              <div className="text-slate-500 text-xs font-mono">
                {review.createdAt
                  ? new Date(review.createdAt).toLocaleDateString('it-IT', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric',
                    })
                  : ''}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// ─── MAIN ADMIN DASHBOARD ─────────────────────────────────────────────────────
// ═══════════════════════════════════════════════════════════════════════════════
export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="min-h-screen bg-slate-900 pt-28 pb-20 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight">
            📊 Dashboard Amministrativa
          </h1>
          <p className="text-slate-400 text-lg mt-2 font-semibold">
            Pannello di controllo PadelClub
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="mb-8 overflow-x-auto scrollbar-hide -mx-4 px-4">
          <div className="flex gap-2 min-w-max">
            {TABS.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`px-6 py-3 rounded-xl text-sm font-bold transition-all duration-200 whitespace-nowrap ${
                  activeTab === tab.key
                    ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/30 scale-105'
                    : 'bg-slate-800/60 text-slate-400 hover:text-white hover:bg-slate-700/60 border border-white/5'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="animate-fadeIn">
          {activeTab === 'overview' && <OverviewTab />}
          {activeTab === 'products' && <ProductsTab />}
          {activeTab === 'users' && <UsersTab />}
          {activeTab === 'reviews' && <ReviewsTab />}
        </div>
      </div>
    </div>
  );
}
