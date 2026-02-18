import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

export default function Navbar({ isAuthenticated, setIsAuthenticated, user }) {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [cartCount, setCartCount] = useState(0);

  const updateCartCount = () => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const count = cart.reduce((total, item) => total + (item.quantity || 1), 0);
    setCartCount(count);
  };

  useEffect(() => {
    updateCartCount();
    const handleCartUpdate = () => updateCartCount();
    window.addEventListener('cartUpdated', handleCartUpdate);
    window.addEventListener('storage', handleCartUpdate);
    return () => {
      window.removeEventListener('cartUpdated', handleCartUpdate);
      window.removeEventListener('storage', handleCartUpdate);
    };
  }, []);

  const handleSearch = (e) => {
    if (e) e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery('');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsAuthenticated(false);
    navigate('/');
    setMobileMenuOpen(false);
  };

  const navLinks = [
    { name: 'Home', path: '/', icon: '🏠' },
    { name: 'Courses', path: '/courses', icon: '📚' },
    { name: 'Shop', path: '/shop', icon: '🛍️' },
    { name: 'Community', path: '/community', icon: '👥' },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">

          {/* Logo */}
          <Link to="/" className="flex items-center group">
            <img
              src="/robitro-logo.png"
              alt="Robitro - Minds in Motion"
              className="h-14 w-auto group-hover:scale-105 transition-transform duration-300"
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className="px-4 py-2 text-gray-700 hover:text-robitro-blue font-semibold rounded-lg hover:bg-blue-50 transition-all duration-200"
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center gap-2">

            {/* Search Button */}
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="w-10 h-10 rounded-full bg-blue-50 hover:bg-blue-100 flex items-center justify-center text-robitro-blue transition-all duration-200"
              title="Search"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>

            {/* Cart Button */}
            <Link
              to="/cart"
              className="relative w-10 h-10 rounded-full bg-blue-50 hover:bg-blue-100 flex items-center justify-center text-robitro-blue transition-all duration-200"
              title="Cart"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              {/* Cart badge */}
              {cartCount > 0 && (
                <span key={cartCount} className="absolute -top-1 -right-1 w-5 h-5 bg-robitro-red text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-pop-in">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Divider */}
            <div className="hidden md:block w-px h-8 bg-gray-200 mx-2"></div>

            {isAuthenticated ? (
              /* Authenticated User Menu */
              <div className="hidden md:flex items-center gap-3">
                <Link
                  to={user?.role === 'admin' ? '/admin' : '/lms/dashboard'}
                  className="text-gray-700 hover:text-robitro-blue font-medium transition-colors"
                >
                  {user?.role === 'admin' ? 'Admin Panel' : 'Dashboard'}
                </Link>

                {/* User Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="flex items-center gap-2 bg-robitro-blue text-white px-4 py-2 rounded-full hover:bg-blue-700 hover:shadow-lg transition-all font-bold"
                  >
                    <div className="w-7 h-7 bg-white/20 rounded-full flex items-center justify-center text-sm">
                      {user?.firstName?.[0] || 'U'}
                    </div>
                    <span className="text-sm text-white">{user?.firstName || 'User'}</span>
                    <svg className={`w-4 h-4 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>

                  {dropdownOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl py-2 z-50 border border-gray-100">
                      <div className="px-4 py-3 border-b border-gray-100">
                        <p className="text-gray-900 font-semibold">{user?.firstName} {user?.lastName}</p>
                        <p className="text-gray-500 text-sm">{user?.email}</p>
                      </div>
                      {user?.role === 'admin' && (
                        <Link
                          to="/admin"
                          className="flex items-center gap-3 px-4 py-3 text-robitro-blue font-bold hover:bg-blue-50 transition-all border-b border-gray-100"
                          onClick={() => setDropdownOpen(false)}
                        >
                          <span>⚙️</span> Admin Dashboard
                        </Link>
                      )}
                      <Link
                        to="/lms/profile"
                        className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:text-robitro-blue hover:bg-blue-50 transition-all"
                        onClick={() => setDropdownOpen(false)}
                      >
                        <span>👤</span> Profile
                      </Link>
                      <Link
                        to="/lms/my-courses"
                        className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:text-robitro-blue hover:bg-blue-50 transition-all"
                        onClick={() => setDropdownOpen(false)}
                      >
                        <span>📚</span> My Courses
                      </Link>
                      <Link
                        to="/orders"
                        className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:text-robitro-blue hover:bg-blue-50 transition-all"
                        onClick={() => setDropdownOpen(false)}
                      >
                        <span>📦</span> Orders
                      </Link>
                      <hr className="my-2 border-gray-100" />
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 text-robitro-red hover:bg-red-50 transition-all"
                      >
                        <span>🚪</span> Logout
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              /* Guest User Menu */
              <div className="hidden md:flex items-center gap-3">
                <Link
                  to="/login"
                  className="flex items-center gap-2 text-gray-700 hover:text-robitro-blue font-medium transition-colors px-3 py-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                  </svg>
                  Login
                </Link>
                <Link
                  to="/partner-signup"
                  className="flex items-center gap-2 text-robitro-blue border border-robitro-blue px-4 py-2.5 rounded-full hover:bg-blue-50 hover:shadow-md transition-all font-semibold text-sm"
                >
                  🤝 Partner
                </Link>
                <Link
                  to="/student-signup"
                  className="flex items-center gap-2 bg-robitro-yellow text-gray-900 px-5 py-2.5 rounded-full hover:shadow-lg hover:scale-105 transition-all font-bold"
                >
                  Join Robitro
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden w-10 h-10 rounded-full bg-blue-50 hover:bg-blue-100 flex items-center justify-center text-robitro-blue transition-all"
            >
              {mobileMenuOpen ? (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Search Bar (Expanded) */}
        {searchOpen && (
          <div className="py-4 border-t border-gray-100">
            <form onSubmit={handleSearch} className="relative max-w-2xl mx-auto">
              <input
                type="search"
                placeholder="Search courses, products, community..."
                className="w-full px-6 py-3 bg-gray-50 border border-gray-200 rounded-full text-gray-900 placeholder-gray-400 focus:outline-none focus:border-robitro-blue focus:ring-2 focus:ring-blue-100 transition-colors"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
              />
              <button
                type="submit"
                className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-robitro-blue text-white rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </form>
          </div>
        )}

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden pb-6 pt-4 border-t border-gray-100">
            <div className="space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className="flex items-center gap-3 text-gray-700 hover:text-robitro-blue font-medium py-3 px-4 rounded-xl hover:bg-blue-50 transition-all"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <span className="text-lg">{link.icon}</span>
                  {link.name}
                </Link>
              ))}
            </div>

            <hr className="my-4 border-gray-100" />

            {isAuthenticated ? (
              <div className="space-y-1">
                <Link
                  to={user?.role === 'admin' ? '/admin' : '/lms/dashboard'}
                  className="flex items-center gap-3 text-gray-700 hover:text-robitro-blue font-medium py-3 px-4 rounded-xl hover:bg-blue-50 transition-all"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <span className="text-lg">{user?.role === 'admin' ? '⚙️' : '📊'}</span> {user?.role === 'admin' ? 'Admin Dashboard' : 'Dashboard'}
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 text-robitro-red font-medium py-3 px-4 rounded-xl hover:bg-red-50 transition-all"
                >
                  <span className="text-lg">🚪</span> Logout
                </button>
              </div>
            ) : (
              <div className="space-y-3 px-4">
                <Link
                  to="/login"
                  className="flex items-center justify-center gap-2 w-full py-3 border border-gray-200 rounded-full text-gray-700 font-medium hover:bg-gray-50 transition-all"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  to="/partner-signup"
                  className="flex items-center justify-center gap-2 w-full py-3 border-2 border-robitro-blue rounded-full text-robitro-blue font-semibold hover:bg-blue-50 transition-all"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  🤝 Become a Partner
                </Link>
                <Link
                  to="/student-signup"
                  className="flex items-center justify-center gap-2 w-full py-3 bg-robitro-yellow rounded-full text-gray-900 font-bold hover:shadow-lg transition-all"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Join Robitro
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
