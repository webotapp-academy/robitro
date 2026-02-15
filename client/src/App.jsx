import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';

// Public Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Courses from './pages/Courses';
import CourseDetail from './pages/CourseDetail';
import Community from './pages/Community';
import Shop from './pages/Shop';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Payment from './pages/Payment';
import ThankYou from './pages/ThankYou';
import LegalPage from './pages/LegalPage';

// LMS Pages
import Dashboard from './pages/Dashboard';
import MyCourses from './pages/MyCourses';

// Admin Pages
import AdminLayout from './pages/admin/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminProductForm from './pages/admin/AdminProductForm';
import {
  AdminUsers, AdminPartners, AdminCourses, AdminProducts,
  AdminOrders, AdminCommunity, AdminEnrollments,
  AdminLeads, AdminCallbacks, AdminProductCategories,
  CmsHero, CmsFeatures, CmsTestimonials, CmsFaqs,
  CmsBanners, CmsTechBites, CmsMakers, CmsProjects,
  CmsChallenges, CmsSocialLinks, CmsSettings,
} from './pages/admin/AdminPages';

// Protected Route Component
function ProtectedRoute({ children, isAuthenticated }) {
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

// Admin Route Component
function AdminRoute({ children, isAuthenticated, user }) {
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (user?.role !== 'admin') return <Navigate to="/" replace />;
  return children;
}

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    if (token && storedUser) {
      setIsAuthenticated(true);
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-yellow border-t-blue mx-auto mb-6"></div>
          <p className="text-dark font-semibold text-lg">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <ScrollToTop />
      <Routes>
        {/* ==================== ADMIN ROUTES (own layout) ==================== */}
        <Route
          path="/admin"
          element={
            <AdminRoute isAuthenticated={isAuthenticated} user={user}>
              <AdminLayout setIsAuthenticated={setIsAuthenticated} setUser={setUser} user={user} />
            </AdminRoute>
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="partners" element={<AdminPartners />} />
          <Route path="courses" element={<AdminCourses />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="products/add" element={<AdminProductForm />} />
          <Route path="products/edit/:id" element={<AdminProductForm />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="community" element={<AdminCommunity />} />
          <Route path="enrollments" element={<AdminEnrollments />} />
          <Route path="leads" element={<AdminLeads />} />
          <Route path="callbacks" element={<AdminCallbacks />} />
          <Route path="product-categories" element={<AdminProductCategories />} />
          <Route path="cms/hero" element={<CmsHero />} />
          <Route path="cms/features" element={<CmsFeatures />} />
          <Route path="cms/testimonials" element={<CmsTestimonials />} />
          <Route path="cms/faqs" element={<CmsFaqs />} />
          <Route path="cms/banners" element={<CmsBanners />} />
          <Route path="cms/tech-bites" element={<CmsTechBites />} />
          <Route path="cms/makers" element={<CmsMakers />} />
          <Route path="cms/projects" element={<CmsProjects />} />
          <Route path="cms/challenges" element={<CmsChallenges />} />
          <Route path="cms/social-links" element={<CmsSocialLinks />} />
          <Route path="cms/settings" element={<CmsSettings />} />
        </Route>

        {/* ==================== PUBLIC + LMS ROUTES ==================== */}
        <Route
          path="*"
          element={
            <div className="flex flex-col min-h-screen bg-white">
              <Navbar
                isAuthenticated={isAuthenticated}
                setIsAuthenticated={setIsAuthenticated}
                user={user}
              />
              <main className="flex-grow pt-20">
                <Routes>
                  {/* Home */}
                  <Route path="/" element={<Home />} />

                  {/* Authentication Routes */}
                  <Route
                    path="/login"
                    element={
                      isAuthenticated ? (
                        <Navigate to={user?.role === 'admin' ? '/admin' : '/lms/dashboard'} replace />
                      ) : (
                        <Login setIsAuthenticated={setIsAuthenticated} setUser={setUser} />
                      )
                    }
                  />
                  <Route
                    path="/student-signup"
                    element={
                      isAuthenticated ? (
                        <Navigate to={user?.role === 'admin' ? '/admin' : '/lms/dashboard'} replace />
                      ) : (
                        <Register setIsAuthenticated={setIsAuthenticated} setUser={setUser} type="student" />
                      )
                    }
                  />
                  <Route
                    path="/partner-signup"
                    element={
                      isAuthenticated ? (
                        <Navigate to={user?.role === 'admin' ? '/admin' : '/lms/dashboard'} replace />
                      ) : (
                        <Register setIsAuthenticated={setIsAuthenticated} setUser={setUser} type="partner" />
                      )
                    }
                  />

                  {/* Course Routes */}
                  <Route path="/courses" element={<Courses />} />
                  <Route path="/courses/:id" element={<CourseDetail />} />

                  {/* Shop Routes */}
                  <Route path="/shop" element={<Shop />} />
                  <Route path="/shop/:id" element={<ProductDetail />} />
                  <Route path="/cart" element={<Cart />} />
                  <Route path="/checkout" element={<Checkout />} />
                  <Route path="/payment" element={<Payment />} />
                  <Route path="/thank-you" element={<ThankYou />} />

                  {/* Community Route */}
                  <Route path="/community" element={<Community />} />

                  {/* Legal Routes */}
                  <Route path="/privacy" element={<LegalPage settingKey="privacy_policy" title="Privacy Policy" />} />
                  <Route path="/terms" element={<LegalPage settingKey="terms_and_conditions" title="Terms of Service" />} />
                  <Route path="/cookies" element={<LegalPage settingKey="cookie_policy" title="Cookie Policy" />} />
                  {/* Dashboard */}
                  <Route
                    path="/lms/dashboard"
                    element={
                      <ProtectedRoute isAuthenticated={isAuthenticated}>
                        <Dashboard user={user} setUser={setUser} />
                      </ProtectedRoute>
                    }
                  />

                  {/* My Courses */}
                  <Route
                    path="/lms/my-courses"
                    element={
                      <ProtectedRoute isAuthenticated={isAuthenticated}>
                        <MyCourses user={user} />
                      </ProtectedRoute>
                    }
                  />

                  {/* Course Player */}
                  <Route
                    path="/lms/course/:courseId/learn"
                    element={
                      <ProtectedRoute isAuthenticated={isAuthenticated}>
                        <CourseDetail />
                      </ProtectedRoute>
                    }
                  />

                  {/* Fallback */}
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </main>
              <Footer />
            </div>
          }
        />
      </Routes>
    </Router>
  );
}

