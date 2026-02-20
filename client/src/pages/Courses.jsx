import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import api from '../services/api';

export default function Courses() {
  const location = useLocation();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAge, setSelectedAge] = useState('All');
  const [showCallbackForm, setShowCallbackForm] = useState(false);
  const [callbackData, setCallbackData] = useState({ name: '', phone: '', email: '' });
  const [typingText, setTypingText] = useState('');
  const [isTyping, setIsTyping] = useState(true);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  // Handle URL filters
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const q = params.get('q');
    const cat = params.get('category');

    if (q) setSearchQuery(q);
    if (cat) setSelectedCategory(cat);
  }, [location.search]);

  const categories = ['All', 'Robotics', 'AI & ML', 'Coding', 'Electronics', 'Game Dev'];
  const ageGroups = ['All', '6-8 years', '9-12 years', '13-16 years', '16+ years'];

  // Typing animation for search placeholder
  const searchSuggestions = [
    'Robotics for Kids',
    'Python Programming',
    'AI & Machine Learning',
    'Game Development',
    'Electronics & IoT',
    'Web Development',
    'Arduino Projects',
    'Scratch Games'
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
        typingSpeed = 2000; // Pause at end
        isDeleting = true;
      } else if (isDeleting && currentText === '') {
        isDeleting = false;
        currentIndex = (currentIndex + 1) % searchSuggestions.length;
        typingSpeed = 500; // Pause before next word
      }

      setTimeout(type, typingSpeed);
    };

    const timer = setTimeout(type, 1000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        const response = await api.get('/courses');
        if (response.data.success) {
          // Map DB format to UI format using metadata
          const mappedCourses = response.data.courses.map(course => ({
            ...course,
            ...course.metadata,
            level: (course.level || 'Beginner').charAt(0).toUpperCase() + (course.level || 'beginner').slice(1),
            students: course.enrollmentCount || 0,
            originalPrice: Number((course.price + (course.metadata?.discountValue || 30)).toFixed(2)),
            image: course.thumbnail || '/images/course-placeholder.jpg',
            icon: course.metadata?.icon || '🎓',
            color: course.metadata?.color || 'from-blue-500 to-indigo-600',
            features: course.metadata?.features || ['Certification', 'Projects', 'Expert Support']
          }));
          setCourses(mappedCourses);
        }
      } catch (error) {
        console.error('Error fetching courses:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);



  const filteredCourses = courses.filter((course) => {
    const matchesCategory = selectedCategory === 'All' || course.category === selectedCategory;
    const matchesAge = selectedAge === 'All' || course.ageGroup === selectedAge;
    const matchesSearch = !searchQuery ||
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesAge && matchesSearch;
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
  }, [filteredCourses]);

  const handleCallbackSubmit = (e) => {
    e.preventDefault();
    alert('Thank you! Our team will call you back shortly.');
    setShowCallbackForm(false);
    setCallbackData({ name: '', phone: '', email: '' });
  };

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
            <h3 className="text-2xl font-bold text-robitro-navy mb-2">Request a Callback</h3>
            <p className="text-gray-600 mb-6">Our experts will call you to discuss the best courses for your child.</p>

            <form onSubmit={handleCallbackSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Your Name</label>
                <input
                  type="text"
                  required
                  value={callbackData.name}
                  onChange={(e) => setCallbackData({ ...callbackData, name: e.target.value })}
                  placeholder="Enter your name"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-robitro-blue focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Phone Number</label>
                <input
                  type="tel"
                  required
                  value={callbackData.phone}
                  onChange={(e) => setCallbackData({ ...callbackData, phone: e.target.value })}
                  placeholder="+44 7XXX XXXXXX"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-robitro-blue focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Email (Optional)</label>
                <input
                  type="email"
                  value={callbackData.email}
                  onChange={(e) => setCallbackData({ ...callbackData, email: e.target.value })}
                  placeholder="your@email.com"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-robitro-blue focus:border-transparent"
                />
              </div>
              <button
                type="submit"
                className="w-full py-4 bg-robitro-yellow text-gray-900 rounded-xl font-bold text-lg hover:shadow-lg transition-all duration-300"
              >
                📞 Request Callback
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ==================== HERO SECTION ==================== */}
      <section className="relative overflow-hidden py-16 lg:py-24">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img
            src="/images/hero-courses-bg.jpg"
            alt=""
            className="w-full h-full object-cover"
            onError={(e) => { e.target.style.display = 'none'; }}
          />
          <div className="absolute inset-0" style={{
            background: 'linear-gradient(135deg, rgba(37, 99, 235, 0.95) 0%, rgba(30, 58, 138, 0.95) 40%, rgba(124, 58, 237, 0.9) 70%, rgba(6, 182, 212, 0.9) 100%)'
          }}></div>
        </div>

        {/* Floating Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-10 left-10 text-6xl opacity-20 animate-bounce" style={{ animationDuration: '3s' }}>🤖</div>
          <div className="absolute top-20 right-20 text-5xl opacity-15 animate-bounce" style={{ animationDuration: '4s', animationDelay: '1s' }}>💻</div>
          <div className="absolute bottom-20 left-20 text-4xl opacity-20 animate-bounce" style={{ animationDuration: '2.5s', animationDelay: '0.5s' }}>🎮</div>
          <div className="absolute bottom-10 right-10 text-5xl opacity-15 animate-bounce" style={{ animationDuration: '3.5s', animationDelay: '1.5s' }}>⚡</div>

          {/* Gradient orbs */}
          <div className="absolute -top-20 -right-20 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-yellow-400/20 rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center">
            <span className="inline-block px-5 py-2.5 bg-robitro-yellow text-gray-900 text-sm font-bold rounded-full mb-6 shadow-lg">
              🎓 50+ Courses Available
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-6 drop-shadow-lg">
              Explore Our <span className="text-robitro-yellow">Courses</span>
            </h1>
            <p className="text-xl text-white/90 max-w-2xl mx-auto mb-8">
              World-class technology education designed for young innovators aged 6-16+
            </p>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto mb-4">
              <div className="relative">
                <input
                  type="search"
                  placeholder={searchQuery ? '' : `Search ${typingText}...`}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-6 py-4 pl-14 bg-white/20 backdrop-blur-sm border border-white/30 rounded-2xl text-white placeholder-white/70 focus:outline-none focus:border-white/50 focus:ring-2 focus:ring-white/20 transition-all text-lg"
                />
                <svg className="absolute left-5 top-1/2 -translate-y-1/2 w-6 h-6 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                {/* Blinking cursor for typing effect */}
                {!searchQuery && (
                  <span className="absolute left-14 top-1/2 -translate-y-1/2 text-white/70 text-lg pointer-events-none">
                    Search {typingText}<span className="animate-pulse">|</span>
                  </span>
                )}
              </div>
            </div>

            {/* Talk to Us Link */}
            <button
              onClick={() => setShowCallbackForm(true)}
              className="inline-flex items-center gap-2 text-white/90 hover:text-robitro-yellow font-semibold transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              Need help choosing? Talk to us →
            </button>
          </div>
        </div>
      </section>

      {/* ==================== FILTERS SECTION ==================== */}
      <section className="w-full bg-white py-8 border-b border-gray-100 sticky top-20 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-6 items-center justify-between">
            {/* Category Filters */}
            <div className="flex flex-wrap gap-2 justify-center">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-5 py-2.5 rounded-full font-semibold text-sm transition-all duration-300 ${selectedCategory === category
                    ? 'bg-robitro-blue text-white shadow-lg scale-105'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                >
                  {category}
                </button>
              ))}
            </div>

            {/* Age Filter */}
            <div className="flex items-center gap-3">
              <span className="text-gray-600 font-medium text-sm">Age:</span>
              <select
                value={selectedAge}
                onChange={(e) => setSelectedAge(e.target.value)}
                className="px-4 py-2.5 bg-gray-100 border-0 rounded-full text-gray-700 font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-robitro-blue cursor-pointer"
              >
                {ageGroups.map((age) => (
                  <option key={age} value={age}>{age}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== COURSES GRID ==================== */}
      <section className="w-full mesh-gradient py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center mb-12">
            <h2 className="section-title">All Courses</h2>
            <p className="section-subtitle">
              Showing {filteredCourses.length} course{filteredCourses.length !== 1 ? 's' : ''}
              {selectedCategory !== 'All' && ` in ${selectedCategory}`}
              {selectedAge !== 'All' && ` for ${selectedAge}`}
            </p>
            <div className="shine-separator"></div>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-robitro-yellow border-t-robitro-blue mb-4"></div>
              <p className="text-white font-semibold text-lg">Loading Awesome Courses...</p>
            </div>
          ) : filteredCourses.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredCourses.map((course, idx) => (
                <Link
                  key={course.id}
                  to={`/courses/${course.id}`}
                  className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 scroll-reveal border border-gray-100 flex flex-col h-full"
                  style={{ transitionDelay: `${idx * 50}ms` }}
                >
                  {/* Course Image */}
                  <div className="relative h-48 overflow-hidden flex-shrink-0">
                    <img
                      src={course.image}
                      alt={course.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }}
                    />
                    <div className={`absolute inset-0 bg-gradient-to-br ${course.color} hidden items-center justify-center`}>
                      <span className="text-7xl">{course.icon}</span>
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>

                    {/* Level Badge */}
                    <span className="absolute top-4 left-4 text-xs font-bold text-white bg-black/30 backdrop-blur-sm px-3 py-1.5 rounded-full">
                      {course.level}
                    </span>

                    {/* Discount Badge */}
                    {course.originalPrice > course.price && (
                      <span className="absolute top-4 right-4 text-xs font-bold text-white bg-robitro-red px-3 py-1.5 rounded-full">
                        {Math.round((1 - course.price / course.originalPrice) * 100)}% OFF
                      </span>
                    )}

                    {/* Student Count */}
                    <span className="absolute bottom-4 right-4 text-xs font-bold text-white bg-black/30 backdrop-blur-sm px-3 py-1.5 rounded-full flex items-center gap-1">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                      </svg>
                      {course.students.toLocaleString()}
                    </span>

                    {/* Icon Overlay */}
                    <div className="absolute bottom-4 left-4 w-12 h-12 bg-white rounded-xl flex items-center justify-center text-2xl shadow-lg">
                      {course.icon}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6 flex flex-col flex-grow">
                    {/* Category & Age */}
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-xs font-bold text-robitro-blue bg-blue-50 px-2 py-1 rounded-full">{course.category}</span>
                      <span className="text-xs font-bold text-gray-500 bg-gray-100 px-2 py-1 rounded-full">{course.ageGroup}</span>
                    </div>

                    {/* Title */}
                    <h3 className="text-xl font-bold text-robitro-navy mb-2 group-hover:text-robitro-blue transition-colors line-clamp-1">
                      {course.title}
                    </h3>

                    {/* Description */}
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2 flex-grow">
                      {course.description}
                    </p>

                    {/* Course Meta */}
                    <div className="flex items-center gap-4 text-sm text-gray-500 mb-4 pb-4 border-b border-gray-100">
                      <span className="flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {course.duration}
                      </span>
                      <span className="flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                        {course.sessions} sessions
                      </span>
                    </div>

                    {/* Price & Rating */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl font-black text-robitro-navy">£{course.price}</span>
                        {course.originalPrice > course.price && (
                          <span className="text-sm text-gray-400 line-through">£{course.originalPrice}</span>
                        )}
                      </div>
                      <div className="flex items-center gap-1 text-robitro-yellow">
                        <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                        </svg>
                        <span className="font-bold text-gray-700">{course.rating}</span>
                      </div>
                    </div>

                    {/* Features */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {course.features.map((feature, i) => (
                        <span key={i} className="text-xs font-medium text-gray-600 bg-gray-100 px-2 py-1 rounded-full flex items-center gap-1">
                          <svg className="w-3 h-3 text-green-500" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                          </svg>
                          {feature}
                        </span>
                      ))}
                    </div>

                    {/* CTA Button */}
                    <button className="w-full py-3 bg-robitro-yellow text-gray-900 rounded-xl font-bold hover:shadow-lg hover:scale-[1.02] transition-all duration-300 flex items-center justify-center gap-2 mt-auto">
                      View Course
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <div className="text-7xl mb-6">🔍</div>
              <h3 className="text-2xl font-bold text-robitro-navy mb-2">No courses found</h3>
              <p className="text-gray-600 mb-8">Try adjusting your filters or search terms</p>
              <button
                onClick={() => {
                  setSelectedCategory('All');
                  setSelectedAge('All');
                  setSearchQuery('');
                }}
                className="px-6 py-3 bg-robitro-blue text-white rounded-xl font-bold hover:shadow-lg transition-all"
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>
      </section>

      {/* ==================== WHY CHOOSE US ==================== */}
      <section className="w-full bg-white py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="inline-block px-4 py-2 bg-robitro-teal/10 text-robitro-teal text-sm font-bold rounded-full mb-4">WHY ROBITRO</span>
            <h2 className="section-title">Why Learn With Us?</h2>
            <p className="section-subtitle">Everything you need to become a next-generation innovator</p>
            <div className="shine-separator-rtl"></div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: '👨‍🏫', title: 'Expert Instructors', desc: 'Learn from industry professionals with 10+ years experience' },
              { icon: '🛠️', title: 'Hands-On Projects', desc: 'Build 50+ real-world projects with hardware kits' },
              { icon: '🎓', title: 'Certificates', desc: 'Earn industry-recognized certificates' },
              { icon: '💬', title: 'Live Support', desc: '24/7 doubt clearing and mentor support' },
            ].map((item, idx) => (
              <div key={idx} className="text-center p-8 bg-gradient-to-br from-gray-50 to-white rounded-2xl border border-gray-100 hover:shadow-lg transition-all duration-300 scroll-reveal" style={{ transitionDelay: `${idx * 100}ms` }}>
                <div className="text-5xl mb-4">{item.icon}</div>
                <h3 className="text-lg font-bold text-robitro-navy mb-2">{item.title}</h3>
                <p className="text-gray-600 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== CTA SECTION ==================== */}
      <section className="w-full py-16 lg:py-24 relative overflow-hidden" style={{
        background: 'linear-gradient(135deg, #2563EB 0%, #1E3A8A 30%, #7C3AED 60%, #06B6D4 100%)'
      }}>
        {/* Floating Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-10 left-10 text-5xl opacity-20 animate-bounce" style={{ animationDuration: '3s' }}>🎓</div>
          <div className="absolute bottom-10 right-10 text-5xl opacity-15 animate-bounce" style={{ animationDuration: '4s' }}>🚀</div>
          <div className="absolute -top-20 -right-20 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-yellow-400/20 rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-white mb-6 drop-shadow-lg">
            Ready to Start Learning?
          </h2>
          <p className="text-xl text-white/90 mb-10 max-w-2xl mx-auto">
            Join 10,000+ young innovators and unlock your child's potential today!
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/student-signup" className="bg-robitro-yellow text-gray-900 px-8 py-4 rounded-2xl font-bold text-lg shadow-2xl hover:scale-105 hover:shadow-yellow-400/30 transition-all duration-300">
              🎁 Start Free Trial
            </Link>
            <button
              onClick={() => setShowCallbackForm(true)}
              className="bg-white/20 backdrop-blur-sm text-white border-2 border-white/50 px-8 py-4 rounded-2xl font-bold text-lg hover:bg-white/30 transition-all duration-300"
            >
              📞 Talk to Expert
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
