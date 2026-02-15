import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import api from '../services/api';
import Swal from 'sweetalert2';

export default function Shop() {
  const location = useLocation();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedAgeGroup, setSelectedAgeGroup] = useState('All');
  const [priceRange, setPriceRange] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [showCallbackForm, setShowCallbackForm] = useState(false);
  const [callbackData, setCallbackData] = useState({ name: '', phone: '', email: '' });
  const [typingText, setTypingText] = useState('');
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [bannerIndex, setBannerIndex] = useState(0);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [categories, setCategories] = useState(['All']);

  // Handle URL filters
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const q = params.get('q');
    const cat = params.get('category');

    if (q) setSearchQuery(q);
    if (cat) setSelectedCategory(cat);
  }, [location.search]);

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get('/products/categories');
        if (res.data.success) {
          const names = res.data.data.map(c => c.name);
          setCategories(['All', ...names]);
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
    fetchCategories();
  }, []);

  // Auto-slide banner
  useEffect(() => {
    const interval = setInterval(() => {
      setBannerIndex(prev => (prev === 0 ? 1 : 0));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const ageGroups = ['All', '5+ Ages', '8+ Ages', '10+ Ages', '12+ Ages', '14+ Ages'];
  const priceRanges = ['All', 'Under £20', '£20-£50', '£50-£100', 'Over £100'];

  // Typing animation for search placeholder
  const searchSuggestions = [
    'Robotics Kit',
    'Arduino Starter',
    'Drone Building',
    'AI Learning Board',
    'Electronics Kit',
    'Coding Robot'
  ];

  useEffect(() => {
    let currentIndex = 0;
    let currentText = '';
    let isDeleting = false;
    let typingSpeed = 100;

    const type = () => {
      const fullText = searchSuggestions[currentIndex];

      if (isDeleting) {
        currentText = fullText.substring(0, currentText.length - 1);
        typingSpeed = 50;
      } else {
        currentText = fullText.substring(0, currentText.length + 1);
        typingSpeed = 100;
      }

      setTypingText(currentText);

      if (!isDeleting && currentText === fullText) {
        typingSpeed = 2000;
        isDeleting = true;
      } else if (isDeleting && currentText === '') {
        isDeleting = false;
        currentIndex = (currentIndex + 1) % searchSuggestions.length;
        typingSpeed = 500;
      }

      setTimeout(type, typingSpeed);
    };

    const timer = setTimeout(type, 1000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await api.get('/products');
        if (response.data.success) {
          const mappedProducts = response.data.products.map(product => ({
            ...product,
            ...product.metadata,
            image: product.images?.[0] || 'https://via.placeholder.com/400x400',
            originalPrice: product.metadata?.originalPrice || (product.price + 20)
          }));
          setProducts(mappedProducts);
        }
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);



  // Filter products
  const filteredProducts = products.filter((product) => {
    const matchesCategory = selectedCategory === 'All' ||
      product.categoryName === selectedCategory ||
      product.category?.name === selectedCategory;
    const matchesAge = selectedAgeGroup === 'All' || product.ageGroup === selectedAgeGroup;
    const matchesSearch = !searchQuery ||
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase());

    let matchesPrice = true;
    if (priceRange === 'Under £20') matchesPrice = product.price < 20;
    else if (priceRange === '£20-£50') matchesPrice = product.price >= 20 && product.price <= 50;
    else if (priceRange === '£50-£100') matchesPrice = product.price > 50 && product.price <= 100;
    else if (priceRange === 'Over £100') matchesPrice = product.price > 100;

    return matchesCategory && matchesAge && matchesSearch && matchesPrice;
  });

  // Scroll reveal effect
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
          }
        });
      },
      { threshold: 0.1 }
    );

    document.querySelectorAll('.scroll-reveal').forEach((el) => {
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, [filteredProducts]);

  const handleAddToCart = (product) => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const existingItem = cart.find(item => item.id === product.id);

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.push({ ...product, quantity: 1 });
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    window.dispatchEvent(new Event('cartUpdated'));

    Swal.fire({
      title: 'Added to Cart!',
      text: `${product.name} has been added to your cart.`,
      imageUrl: product.image,
      imageWidth: 100,
      imageHeight: 100,
      imageAlt: product.name,
      icon: 'success',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Go to Cart',
      cancelButtonText: 'Continue Shopping'
    }).then((result) => {
      if (result.isConfirmed) {
        window.location.href = '/cart';
      }
    });
  };

  const handleCallbackSubmit = (e) => {
    e.preventDefault();
    alert('Thank you! Our team will call you back shortly.');
    setShowCallbackForm(false);
    setCallbackData({ name: '', phone: '', email: '' });
  };

  const clearFilters = () => {
    setSelectedCategory('All');
    setSelectedAgeGroup('All');
    setPriceRange('All');
    setSearchQuery('');
  };

  const activeFiltersCount = [selectedCategory, selectedAgeGroup, priceRange].filter(f => f !== 'All').length;

  return (
    <div className="w-full bg-white">
      {/* Callback Modal */}
      {showCallbackForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 relative animate-fade-in">
            <button
              onClick={() => setShowCallbackForm(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl"
            >
              ×
            </button>
            <h3 className="text-2xl font-bold text-robitro-navy mb-2">Need Help Choosing?</h3>
            <p className="text-gray-600 mb-6">Our experts will recommend the best kit for your child.</p>

            <form onSubmit={handleCallbackSubmit} className="space-y-4">
              <input
                type="text"
                required
                value={callbackData.name}
                onChange={(e) => setCallbackData({ ...callbackData, name: e.target.value })}
                placeholder="Your Name"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-robitro-blue"
              />
              <input
                type="tel"
                required
                value={callbackData.phone}
                onChange={(e) => setCallbackData({ ...callbackData, phone: e.target.value })}
                placeholder="Phone Number"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-robitro-blue"
              />
              <button
                type="submit"
                className="w-full py-4 bg-robitro-yellow text-gray-900 rounded-xl font-bold text-lg hover:shadow-lg transition-all"
              >
                📞 Request Callback
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ==================== BANNER SLIDER ==================== */}
      <section className="w-full bg-gray-100">
        <div className="max-w-7xl mx-auto">
          <div className="relative overflow-hidden">
            {/* Slider Container */}
            <div
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${bannerIndex * 100}%)` }}
            >
              {/* Banner 1 */}
              <div className="w-full flex-shrink-0">
                <div className="relative h-32 md:h-40 lg:h-48 overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=1400&h=300&fit=crop"
                    alt="Robotics Kits Sale"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-900/80 to-transparent flex items-center">
                    <div className="px-6 md:px-12">
                      <h3 className="text-white text-lg md:text-2xl font-bold mb-1">Mega Robotics Sale!</h3>
                      <p className="text-white/80 text-sm md:text-base mb-2">Up to 40% off on all Robotics Kits</p>
                      <span className="inline-block px-3 py-1 bg-yellow-400 text-gray-900 text-xs font-bold rounded-full">Use Code: ROBO40</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Banner 2 */}
              <div className="w-full flex-shrink-0">
                <div className="relative h-32 md:h-40 lg:h-48 overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1518770660439-4636190af475?w=1400&h=300&fit=crop"
                    alt="Free Shipping"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-900/80 to-transparent flex items-center">
                    <div className="px-6 md:px-12">
                      <h3 className="text-white text-lg md:text-2xl font-bold mb-1">Free Shipping + Free Course!</h3>
                      <p className="text-white/80 text-sm md:text-base mb-2">On orders above £30</p>
                      <span className="inline-block px-3 py-1 bg-green-400 text-gray-900 text-xs font-bold rounded-full">Limited Time Offer</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Slider Dots */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
              {[0, 1].map((idx) => (
                <button
                  key={idx}
                  onClick={() => setBannerIndex(idx)}
                  className={`w-2 h-2 rounded-full transition-all ${bannerIndex === idx ? 'bg-white w-6' : 'bg-white/50'}`}
                />
              ))}
            </div>

            {/* Slider Arrows */}
            <button
              onClick={() => setBannerIndex(bannerIndex === 0 ? 1 : 0)}
              className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/80 rounded-full flex items-center justify-center hover:bg-white transition-all shadow-lg"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={() => setBannerIndex(bannerIndex === 0 ? 1 : 0)}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/80 rounded-full flex items-center justify-center hover:bg-white transition-all shadow-lg"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </section>

      {/* ==================== MAIN CONTENT WITH SIDEBAR ==================== */}
      <section className="w-full mesh-gradient py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-4 gap-8">

            {/* ========== LEFT SIDEBAR - FILTERS ========== */}
            <div className="lg:col-span-1">
              {/* Mobile Filter Toggle */}
              <button
                onClick={() => setShowMobileFilters(!showMobileFilters)}
                className="lg:hidden w-full mb-4 flex items-center justify-between px-4 py-3 bg-white rounded-xl shadow-md"
              >
                <span className="font-semibold text-robitro-navy flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                  </svg>
                  Filters {activeFiltersCount > 0 && `(${activeFiltersCount})`}
                </span>
                <svg className={`w-5 h-5 transition-transform ${showMobileFilters ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Sidebar Content */}
              <div className={`${showMobileFilters ? 'block' : 'hidden'} lg:block`}>
                <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-24">
                  {/* Search Bar */}
                  <div className="mb-6">
                    <div className="relative">
                      <input
                        type="search"
                        placeholder="Search products..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full px-4 py-3 pl-11 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-robitro-blue focus:border-transparent transition-all"
                      />
                      <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </div>
                  </div>

                  {/* Header */}
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-bold text-robitro-navy flex items-center gap-2">
                      <svg className="w-5 h-5 text-robitro-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                      </svg>
                      Filters
                    </h3>
                    {activeFiltersCount > 0 && (
                      <button onClick={clearFilters} className="text-sm text-robitro-blue hover:underline">
                        Clear all
                      </button>
                    )}
                  </div>

                  {/* Categories */}
                  <div className="mb-6">
                    <h4 className="font-semibold text-gray-700 mb-3">Categories</h4>
                    <div className="space-y-2">
                      {categories.map((category) => (
                        <button
                          key={category}
                          onClick={() => setSelectedCategory(category)}
                          className={`w-full text-left px-4 py-2.5 rounded-xl transition-all ${selectedCategory === category
                            ? 'bg-robitro-blue text-white font-semibold'
                            : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                            }`}
                        >
                          {category}
                          {category !== 'All' && (
                            <span className="float-right text-sm opacity-60">
                              {products.filter(p => p.categoryName === category || p.category?.name === category).length}
                            </span>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Age Group */}
                  <div className="mb-6">
                    <h4 className="font-semibold text-gray-700 mb-3">Age Group</h4>
                    <div className="space-y-2">
                      {ageGroups.map((age) => (
                        <button
                          key={age}
                          onClick={() => setSelectedAgeGroup(age)}
                          className={`w-full text-left px-4 py-2.5 rounded-xl transition-all ${selectedAgeGroup === age
                            ? 'bg-robitro-purple text-white font-semibold'
                            : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                            }`}
                        >
                          {age}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Price Range */}
                  <div className="mb-6">
                    <h4 className="font-semibold text-gray-700 mb-3">Price Range</h4>
                    <div className="space-y-2">
                      {priceRanges.map((range) => (
                        <button
                          key={range}
                          onClick={() => setPriceRange(range)}
                          className={`w-full text-left px-4 py-2.5 rounded-xl transition-all ${priceRange === range
                            ? 'bg-robitro-teal text-white font-semibold'
                            : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                            }`}
                        >
                          {range}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Help Box */}
                  <div className="bg-gradient-to-br from-robitro-blue to-robitro-purple rounded-xl p-4 text-white">
                    <div className="text-2xl mb-2">🤔</div>
                    <h4 className="font-bold mb-1">Need Help?</h4>
                    <p className="text-sm text-white/80 mb-3">Our experts can recommend the perfect kit.</p>
                    <button
                      onClick={() => setShowCallbackForm(true)}
                      className="w-full py-2 bg-white text-robitro-blue rounded-lg font-semibold text-sm hover:shadow-lg transition-all"
                    >
                      Get a Callback
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* ========== RIGHT - PRODUCTS GRID ========== */}
            <div className="lg:col-span-3">
              {/* Results Header */}
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-robitro-navy">
                    {selectedCategory === 'All' ? 'All Products' : selectedCategory}
                  </h2>
                  <p className="text-gray-600">{filteredProducts.length} products found</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500">Sort by:</span>
                  <select className="px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-robitro-blue">
                    <option>Popular</option>
                    <option>Price: Low to High</option>
                    <option>Price: High to Low</option>
                    <option>Newest</option>
                  </select>
                </div>
              </div>

              {/* Products Grid */}
              {loading ? (
                <div className="text-center py-16 bg-white rounded-3xl shadow-lg">
                  <div className="inline-block animate-spin rounded-full h-16 w-16 border-b-4 border-robitro-blue mb-4"></div>
                  <h3 className="text-xl font-bold text-gray-700 mb-2">Loading Products...</h3>
                  <p className="text-gray-500">Please wait while we fetch the latest products</p>
                </div>
              ) : filteredProducts.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-3xl shadow-lg">
                  <div className="text-6xl mb-4">🔍</div>
                  <h3 className="text-xl font-bold text-gray-700 mb-2">No products found</h3>
                  <p className="text-gray-500 mb-4">Try adjusting your filters</p>
                  <button onClick={clearFilters} className="text-robitro-blue font-semibold hover:underline">
                    Clear all filters
                  </button>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {filteredProducts.map((product, idx) => (
                    <Link
                      key={product.id}
                      to={`/shop/${product.id}`}
                      className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 scroll-reveal border border-gray-100 flex flex-col h-full"
                      style={{ transitionDelay: `${idx * 50}ms` }}
                    >
                      {/* Product Image */}
                      <div className="relative h-48 overflow-hidden flex-shrink-0">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        />

                        {/* Badge */}
                        {product.badge && (
                          <div className="absolute top-3 left-3 z-20">
                            <span className="px-3 py-1 bg-robitro-yellow text-gray-900 text-xs font-bold rounded-full shadow-lg">
                              {product.badge}
                            </span>
                          </div>
                        )}

                        {/* Discount Badge */}
                        {product.originalPrice > product.price && (
                          <div className="absolute top-3 right-3 z-20">
                            <span className="px-2 py-1 bg-green-500 text-white text-xs font-bold rounded-full">
                              -{Math.round((1 - product.price / product.originalPrice) * 100)}%
                            </span>
                          </div>
                        )}

                        {/* Quick Add Button */}
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            handleAddToCart(product);
                          }}
                          className="absolute bottom-3 right-3 z-20 p-3 bg-white text-robitro-navy rounded-xl shadow-lg opacity-0 group-hover:opacity-100 transition-all hover:bg-robitro-yellow hover:scale-110"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                          </svg>
                        </button>
                      </div>

                      {/* Content */}
                      <div className="p-5 flex flex-col flex-grow">
                        {/* Category & Age */}
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-semibold text-robitro-blue uppercase tracking-wide">{product.categoryName || product.category?.name}</span>
                          <span className="text-xs text-gray-500">{product.ageGroup}</span>
                        </div>

                        {/* Title */}
                        <h3 className="text-lg font-bold text-robitro-navy mb-2 group-hover:text-robitro-blue transition-colors line-clamp-1">
                          {product.name}
                        </h3>

                        {/* Description */}
                        <p className="text-gray-600 text-sm mb-3 line-clamp-2 flex-grow">
                          {product.description}
                        </p>

                        {/* Rating */}
                        <div className="flex items-center gap-2 mb-3">
                          <div className="flex text-robitro-yellow text-sm">
                            {'★'.repeat(Math.floor(product.rating))}
                          </div>
                          <span className="text-sm font-semibold text-gray-700">{product.rating}</span>
                          <span className="text-xs text-gray-500">({product.reviews})</span>
                        </div>

                        {/* Price */}
                        <div className="flex items-center justify-between mt-auto pt-3 border-t border-gray-100">
                          <div>
                            <span className="text-lg font-black text-robitro-navy">£{product.price.toLocaleString('en-GB')}</span>
                            {product.originalPrice > product.price && (
                              <span className="text-xs text-gray-400 line-through ml-2">£{product.originalPrice.toLocaleString('en-GB')}</span>
                            )}
                          </div>
                          {product.stock <= 5 && (
                            <span className="text-xs text-red-500 font-semibold">{product.stock} left</span>
                          )}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ==================== WHY BUY FROM US ==================== */}
      <section className="w-full bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-6">
            {[
              { icon: '🚚', title: 'Free Delivery', description: 'On orders over £50' },
              { icon: '✅', title: 'Quality Assured', description: '30-day return policy' },
              { icon: '🎓', title: 'Learning Support', description: 'Video tutorials included' },
              { icon: '💬', title: 'Expert Help', description: 'Chat with our team' }
            ].map((item, idx) => (
              <div key={idx} className="text-center p-6 rounded-2xl bg-gray-50">
                <div className="text-4xl mb-3">{item.icon}</div>
                <h3 className="text-lg font-bold text-robitro-navy mb-1">{item.title}</h3>
                <p className="text-gray-600 text-sm">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
