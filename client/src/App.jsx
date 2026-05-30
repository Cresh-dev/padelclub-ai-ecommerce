import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { GlobalProvider, useGlobal } from "./context/GlobalContext";
import FavoritesDrawer from "./components/FavoritesDrawer";
import Navigation from "./components/Navigation";
import CartDrawer from "./components/CartDrawer";
import Home from "./pages/Home";
import Auth from "./pages/Auth";
import ProductsCatalog from "./pages/ProductsCatalog";
import RecommendationPage from "./pages/RecommendationPage";
import Dashboard from "./pages/Dashboard";
import AdminDashboard from "./pages/AdminDashboard";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";
import CookiesPolicy from "./pages/CookiesPolicy";
import Contact from "./pages/Contact";
import FAQPage from "./pages/FAQPage";
import Shipping from "./pages/Shipping";
import Returns from "./pages/Returns";
import Checkout from "./pages/Checkout";
import MarketingCampaign from "./pages/MarketingCampaign";
import Profile from "./pages/Profile";
import PublicProfile from "./pages/PublicProfile";
import AdminRoute from "./components/AdminRoute";

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useGlobal();
  if (!isAuthenticated) return <Navigate to="/auth" />;
  return children;
};

function AppContent() {
  const { isAuthenticated, user, logout } = useGlobal();

  return (
    <>
      <Toaster position="bottom-center" />
      <Navigation
        isAuthenticated={isAuthenticated}
        user={user}
        onLogout={logout}
      />
      <CartDrawer />
      <FavoritesDrawer />

      <Routes>
        <Route path="/" element={<Home isAuthenticated={isAuthenticated} />} />
        <Route
          path="/auth"
          element={
            isAuthenticated ? (
              <Navigate to="/dashboard" />
            ) : (
              <Auth onLogin={() => {}} />
            )
          }
        />
        <Route path="/shop" element={<ProductsCatalog />} />
        <Route path="/vip" element={<MarketingCampaign />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route
          path="/recommendations"
          element={
            <ProtectedRoute>
              <RecommendationPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          }
        />

        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/terms" element={<TermsOfService />} />
        <Route path="/cookies" element={<CookiesPolicy />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/faq" element={<FAQPage />} />
        <Route path="/shipping" element={<Shipping />} />
        <Route path="/returns" element={<Returns />} />
        <Route path="/player/:username" element={<PublicProfile />} />
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <GlobalProvider>
      <Router>
        <AppContent />
      </Router>
    </GlobalProvider>
  );
}
