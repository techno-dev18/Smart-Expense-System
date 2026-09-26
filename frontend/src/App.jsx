import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import { AuthProvider } from "./context/AuthContext";

// Pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Income from "./pages/Income";
import Expenses from "./pages/Expenses";
import Budget from "./pages/Budget";
import Analytics from "./pages/Analytics";
import Profile from "./pages/Profile";
import About from "./pages/About";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";
import FAQPage from "./pages/FAQ";

// Legal Pages
import TermsAndConditions from "./legal/TermsAndConditions";
import PrivacyPolicy from "./legal/PrivacyPolicy";
import CookiePolicy from "./legal/CookiePolicy";
import SecurityAndDataPolicy from "./legal/SecurityAndDataPolicy";
import AccessibilityStatement from "./legal/AccessibilityStatement";
import RefundPolicy from "./legal/RefundPolicy";
import LegalDisclaimerPage from "./legal/LegalDisclaimerPage";

// Components
import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

// Compliance / Accessibility
import SkipToContent from "./components/SkipToContent";
import CookieBanner from "./compliance/CookieBanner";
import TrackingConsent from "./compliance/TrackingConsent";

// Global Styles
import "./styles/compliance.css";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>

        {/* Accessibility */}
        <SkipToContent />

        {/* Global Navigation */}
        <Navbar />

        {/* Main Application Content */}
        <main id="main-content">
          <Routes>

            {/* ==================================================
                PUBLIC ROUTES
            ================================================== */}

            <Route path="/" element={<Home />} />

            <Route path="/login" element={<Login />} />

            <Route path="/signup" element={<Signup />} />

            <Route path="/about" element={<About />} />

            <Route path="/contact" element={<Contact />} />

            <Route path="/faq" element={<FAQPage />} />


            {/* ==================================================
                PROTECTED ROUTES
            ================================================== */}

            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />

            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />

            <Route
              path="/expenses"
              element={
                <ProtectedRoute>
                  <Expenses />
                </ProtectedRoute>
              }
            />

            <Route
              path="/income"
              element={
                <ProtectedRoute>
                  <Income />
                </ProtectedRoute>
              }
            />

            <Route
              path="/budget"
              element={
                <ProtectedRoute>
                  <Budget />
                </ProtectedRoute>
              }
            />

            <Route
              path="/analytics"
              element={
                <ProtectedRoute>
                  <Analytics />
                </ProtectedRoute>
              }
            />


            {/* ==================================================
                LEGAL & COMPLIANCE ROUTES
            ================================================== */}

            <Route
              path="/terms"
              element={<TermsAndConditions />}
            />

            <Route
              path="/privacy-policy"
              element={<PrivacyPolicy />}
            />

            <Route
              path="/cookies"
              element={<CookiePolicy />}
            />

            <Route
              path="/security"
              element={<SecurityAndDataPolicy />}
            />

            <Route
              path="/accessibility"
              element={<AccessibilityStatement />}
            />

            <Route
              path="/refund-policy"
              element={<RefundPolicy />}
            />

            <Route
              path="/disclaimer"
              element={<LegalDisclaimerPage />}
            />


            {/* ==================================================
                UNKNOWN ROUTE
            ================================================== */}

            <Route
              path="*"
              element={<NotFound />}
            />

          </Routes>
        </main>

        {/* Global Footer */}
        <Footer />

        {/* ==================================================
            COMPLIANCE COMPONENTS
        ================================================== */}

        <CookieBanner />

        <TrackingConsent />

      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;