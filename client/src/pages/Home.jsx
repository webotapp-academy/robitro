import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';

// Counter animation hook
function useCountUp(end, duration = 2000, startOnView = true) {
  const [count, setCount] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!startOnView) {
      animateCount();
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasStarted) {
          setHasStarted(true);
          animateCount();
        }
      },
      { threshold: 0.3 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [hasStarted]);

  const animateCount = () => {
    const startTime = Date.now();
    const numericEnd = parseInt(end.replace(/[^0-9]/g, ''));

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * numericEnd));

      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  };

  return { count, ref };
}

// FAQ Component
function FAQItem({ question, answer, isOpen, onClick }) {
  return (
    <div className={`faq-item ${isOpen ? 'open' : ''}`} onClick={onClick}>
      <div className="faq-question">
        <span>{question}</span>
        <svg className="faq-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>
      <div className="faq-answer">
        <p>{answer}</p>
      </div>
    </div>
  );
}

// Hero Image Slider Component
function HeroSlider() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      image: '/images/hero-1.png',
      title: 'Collaborative Robotics',
      subtitle: 'Build real robots with friends'
    },
    {
      image: '/images/hero-2.png',
      title: 'Learn to Code',
      subtitle: 'Master programming skills'
    },
    {
      image: '/images/hero-3.png',
      title: 'AI & Automation',
      subtitle: 'Explore the future of tech'
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative w-full h-full rounded-3xl overflow-hidden shadow-2xl">
      {/* Images */}
      {slides.map((slide, idx) => (
        <div
          key={idx}
          className={`absolute inset-0 transition-all duration-700 ease-in-out ${idx === currentSlide ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
            }`}
        >
          <img
            src={slide.image}
            alt={slide.title}
            className="w-full h-full object-cover"
          />
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-robitro-navy/80 via-transparent to-transparent" />

          {/* Slide caption */}
          <div className={`absolute bottom-8 left-8 right-8 text-white transition-all duration-500 ${idx === currentSlide ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
            }`}>
            <h3 className="text-2xl md:text-3xl font-bold mb-2">{slide.title}</h3>
            <p className="text-gray-200 text-lg">{slide.subtitle}</p>
          </div>
        </div>
      ))}

      {/* Navigation dots */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
        {slides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentSlide(idx)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${idx === currentSlide
              ? 'bg-robitro-yellow w-8'
              : 'bg-white/50 hover:bg-white/80'
              }`}
          />
        ))}
      </div>

      {/* Navigation arrows */}
      <button
        onClick={() => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)}
        className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/40 transition-all z-10"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <button
        onClick={() => setCurrentSlide((prev) => (prev + 1) % slides.length)}
        className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/40 transition-all z-10"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Decorative border glow */}
      <div className="absolute inset-0 rounded-3xl ring-2 ring-robitro-yellow/30 pointer-events-none" />
    </div>
  );
}

// Draggable Marquee Component
function DraggableMarquee({ children }) {
  const scrollRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const startX = useRef(0);
  const scrollLeftStart = useRef(0);
  const requestRef = useRef();
  const lastTimeRef = useRef();
  const speed = 0.5; // Pixels per frame

  const animate = (time) => {
    if (lastTimeRef.current !== undefined && !isDragging && scrollRef.current) {
      const delta = time - lastTimeRef.current;
      // Use delta for frame-rate independence if desired, otherwise just constant increment
      scrollRef.current.scrollLeft += speed;

      // Infinite loop check: scrollRef.current.scrollWidth / 2 is the actual content width
      const contentWidth = scrollRef.current.scrollWidth / 2;
      if (scrollRef.current.scrollLeft >= contentWidth) {
        scrollRef.current.scrollLeft -= contentWidth;
      }
    }
    lastTimeRef.current = time;
    requestRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    requestRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(requestRef.current);
  }, [isDragging]);

  const handleMouseDown = (e) => {
    setIsDragging(true);
    startX.current = e.pageX - scrollRef.current.offsetLeft;
    scrollLeftStart.current = scrollRef.current.scrollLeft;
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX.current) * 1.5;
    scrollRef.current.scrollLeft = scrollLeftStart.current - walk;
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleTouchStart = (e) => {
    setIsDragging(true);
    startX.current = e.touches[0].pageX - scrollRef.current.offsetLeft;
    scrollLeftStart.current = scrollRef.current.scrollLeft;
  };

  const handleTouchMove = (e) => {
    if (!isDragging) return;
    const x = e.touches[0].pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX.current) * 1.5;
    scrollRef.current.scrollLeft = scrollLeftStart.current - walk;
  };

  return (
    <div
      ref={scrollRef}
      className={`flex overflow-x-hidden hide-scrollbar cursor-grab active:cursor-grabbing pb-8 select-none ${isDragging ? 'grabbing' : ''}`}
      onMouseDown={handleMouseDown}
      onMouseLeave={handleMouseUp}
      onMouseUp={handleMouseUp}
      onMouseMove={handleMouseMove}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleMouseUp}
      onTouchMove={handleTouchMove}
    >
      <div className={`flex gap-8 w-max px-4 ${isDragging ? 'pointer-events-none' : ''}`}>
        {children}
        {children}
      </div>
    </div>
  );
}

export default function Home() {
  const [openFAQ, setOpenFAQ] = useState(null);

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

    document.querySelectorAll('.scroll-reveal, .scroll-reveal-left, .scroll-reveal-right').forEach((el) => {
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const stats = [
    { number: '10000', suffix: '+', label: 'Young Innovators', icon: '👥' },
    { number: '500', suffix: '+', label: 'Courses & Modules', icon: '📚' },
    { number: '150', suffix: '+', label: 'Expert Instructors', icon: '🎓' },
    { number: '50', suffix: '+', label: 'Countries Reached', icon: '🌍' },
  ];

  const faqs = [
    { question: 'What age groups can enroll?', answer: 'Robitro courses are designed for young innovators aged 6-18. We have age-appropriate tracks for beginners (6-10), intermediate (11-14), and advanced (15-18) learners.' },
    { question: 'Do I need any prior coding experience?', answer: 'No prior experience is required! Our courses start from the basics and progressively build up. We have specialized beginner tracks that make learning fun and accessible.' },
    { question: 'How are the courses delivered?', answer: 'Courses are delivered through live online sessions with expert instructors, complemented by recorded lessons, interactive exercises, and hands-on projects you can complete at your own pace.' },
    { question: 'Will I receive a certificate?', answer: 'Yes! Upon successful completion of each course, you will receive a verified digital certificate that you can share on social media and add to your portfolio.' },
    { question: 'What equipment do I need?', answer: 'For most coding and AI courses, you just need a computer with internet access. For robotics courses, we provide optional hardware kits that can be purchased separately or you can use our virtual simulation environment.' },
  ];

  const partners = [
    { name: 'Google', logo: '🔍' },
    { name: 'Microsoft', logo: '🪟' },
    { name: 'STEM.org', logo: '🔬' },
    { name: 'National Geographic', logo: '📸' },
    { name: 'MIT', logo: '🏛️' },
    { name: 'NASA', logo: '🚀' },
  ];

  return (
    <Layout>
      {/* ==================== HERO SECTION ==================== */}
      <section className="min-h-screen mesh-gradient flex items-center relative overflow-hidden">
        {/* Animated particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Small floating particles */}
          {[...Array(15)].map((_, i) => (
            <div
              key={i}
              className={`particle particle-${(i % 3) + 1}`}
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animation: `float ${5 + Math.random() * 5}s ease-in-out infinite ${Math.random() * 2}s`,
                opacity: 0.3 + Math.random() * 0.4,
              }}
            />
          ))}

          {/* Large floating emoji decorations */}
          <div className="absolute top-20 left-10 text-6xl opacity-20 animate-bounce hidden lg:block" style={{ animationDuration: '3s' }}>🤖</div>
          <div className="absolute top-40 right-16 text-5xl opacity-15 animate-bounce hidden lg:block" style={{ animationDuration: '4s', animationDelay: '1s' }}>⚙️</div>
          <div className="absolute bottom-40 left-20 text-4xl opacity-20 animate-bounce hidden lg:block" style={{ animationDuration: '2.5s', animationDelay: '0.5s' }}>💡</div>
          <div className="absolute bottom-32 right-24 text-5xl opacity-15 animate-bounce hidden lg:block" style={{ animationDuration: '3.5s', animationDelay: '1.5s' }}>🚀</div>
          <div className="absolute top-1/3 left-6 text-4xl opacity-10 animate-pulse hidden md:block">⭐</div>
          <div className="absolute top-2/3 right-8 text-3xl opacity-10 animate-pulse hidden md:block" style={{ animationDelay: '0.5s' }}>✨</div>
          <div className="absolute top-1/2 left-1/4 text-3xl opacity-10 animate-pulse hidden lg:block" style={{ animationDelay: '1s' }}>🔧</div>
          <div className="absolute bottom-1/4 right-1/3 text-4xl opacity-10 animate-pulse hidden lg:block" style={{ animationDelay: '1.5s' }}>💻</div>

          {/* Large gradient orbs */}
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-br from-robitro-teal/20 to-robitro-blue/10 rounded-full blur-3xl" style={{ animation: 'pulse-soft 6s ease-in-out infinite' }} />
          <div className="absolute -bottom-32 -left-32 w-[500px] h-[500px] bg-gradient-to-tr from-robitro-yellow/15 to-robitro-teal/10 rounded-full blur-3xl" style={{ animation: 'pulse-soft 8s ease-in-out infinite 2s' }} />
        </div>

        <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-20 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Hero Text */}
            <div className="scroll-reveal-left revealed space-y-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-robitro-yellow/20 rounded-full">
                <span className="w-2 h-2 bg-robitro-yellow rounded-full animate-pulse" />
                <span className="text-sm font-semibold text-robitro-navy">🚀 #1 Tech Learning Platform for Kids</span>
              </div>

              <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-robitro-navy leading-tight">
                Master the <span className="text-robitro-teal">Future</span> of Technology
              </h1>

              <p className="text-xl md:text-2xl text-robitro-gray font-medium leading-relaxed max-w-xl">
                World-class online education in <span className="text-robitro-blue font-semibold">Robotics</span>, <span className="text-robitro-teal font-semibold">AI</span>, <span className="text-robitro-yellow font-semibold">Coding</span> & <span className="text-robitro-navy font-semibold">Electronics</span> for young innovators aged 6-18.
              </p>

              <div className="flex flex-wrap gap-4 pt-4">
                <Link to="/courses" className="btn-primary shadow-xl hover:shadow-2xl text-lg">
                  🎓 Explore Courses
                </Link>
                <Link to="/register" className="btn-secondary shadow-lg hover:shadow-xl text-lg">
                  Start Free Trial →
                </Link>
              </div>

              {/* Trust indicators */}
              <div className="flex flex-wrap items-center gap-8 pt-8 border-t border-gray-200/50">
                <div className="text-center">
                  <p className="text-3xl font-black text-robitro-yellow">10K+</p>
                  <p className="text-xs text-robitro-gray font-medium">Students</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-black text-robitro-teal">4.9★</p>
                  <p className="text-xs text-robitro-gray font-medium">Rating</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-black text-robitro-blue">50+</p>
                  <p className="text-xs text-robitro-gray font-medium">Countries</p>
                </div>
              </div>
            </div>

            {/* Hero Visual - Image Slider */}
            <div className="scroll-reveal-right revealed relative h-[400px] lg:h-[500px]">
              <HeroSlider />
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="text-center">
            <p className="text-sm text-robitro-gray font-medium mb-2">Scroll to explore</p>
            <svg className="w-6 h-6 mx-auto text-robitro-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </div>
        </div>
      </section>

      {/* ==================== TRUSTED BY SECTION ==================== */}
      <section className="w-full py-12 bg-white border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm font-semibold text-robitro-gray uppercase tracking-wider mb-8">Trusted by learners from world-leading organizations</p>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16">
            {partners.map((partner, idx) => (
              <div key={idx} className="partner-logo flex items-center gap-2 text-2xl md:text-3xl cursor-pointer transition-all duration-300 hover:scale-110">
                <span>{partner.logo}</span>
                <span className="font-bold text-gray-400 text-base md:text-lg">{partner.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== FEATURES SECTION ==================== */}
      <section className="w-full mesh-gradient py-20 lg:py-28 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16 scroll-reveal">
            <span className="inline-block px-4 py-2 bg-robitro-blue/10 text-robitro-blue text-sm font-bold rounded-full mb-4">WHY ROBITRO</span>
            <h2 className="section-title">World-Class Learning Experience</h2>
            <p className="section-subtitle">Everything you need to become a next-generation innovator</p>
            <div className="shine-separator"></div>
          </div>

          <div className="relative overflow-hidden w-full section-scroll-container group">
            <DraggableMarquee>
              {[
                { icon: '🎓', title: 'Expert Instructors', desc: 'Learn from industry professionals with 10+ years of teaching experience at top tech companies.', gradient: 'from-yellow-400 to-orange-500', image: '/images/feature-instructors.png' },
                { icon: '🏆', title: 'Global Competitions', desc: 'Compete in international robotics and coding competitions. Win prizes and get recognized worldwide.', gradient: 'from-purple-400 to-pink-500', image: '/images/feature-competitions.png' },
                { icon: '👥', title: 'Active Community', desc: 'Join 10,000+ young innovators worldwide. Collaborate on projects and make lifelong friends.', gradient: 'from-green-400 to-teal-500', image: '/images/feature-community.png' },
                { icon: '📚', title: 'Structured Curriculum', desc: 'From basics to advanced. Clear learning paths with milestones and progress tracking.', gradient: 'from-blue-400 to-indigo-500', image: '/images/feature-curriculum.png' },
                { icon: '🛠️', title: 'Hands-On Projects', desc: 'Build 50+ real-world projects. Create robots, apps, AI models, and IoT devices.', gradient: 'from-red-400 to-rose-500', image: '/images/feature-projects.png' },
                { icon: '📜', title: 'Verified Certificates', desc: 'Earn industry-recognized certificates. Boost your portfolio for college applications.', gradient: 'from-teal-400 to-cyan-500', image: '/images/feature-certificates.png' },
              ].map((feature, idx) => (
                <div key={idx} className="glass-feature group cursor-grab active:cursor-grabbing overflow-hidden w-[350px] shrink-0">
                  {/* Feature Image */}
                  <div className="relative h-40 -mx-8 -mt-8 mb-6 overflow-hidden pointer-events-none">
                    <img
                      src={feature.image}
                      alt={feature.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent" />
                  </div>
                  <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg pointer-events-none`}>
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold text-robitro-navy mb-2 group-hover:text-robitro-blue transition-colors pointer-events-none">{feature.title}</h3>
                  <p className="text-robitro-gray text-sm leading-relaxed pointer-events-none">{feature.desc}</p>
                </div>
              ))}
            </DraggableMarquee>
          </div>
        </div>
      </section>

      {/* ==================== COURSES SECTION ==================== */}
      <section className="w-full bg-gradient-to-br from-white via-gray-50 to-blue-50 py-20 lg:py-28 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(31,78,216,0.3) 1px, transparent 0)', backgroundSize: '24px 24px' }} />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16 scroll-reveal">
            <span className="inline-block px-4 py-2 bg-robitro-teal/10 text-robitro-teal text-sm font-bold rounded-full mb-4">LEARNING PATHS</span>
            <h2 className="section-title">Master Future-Ready Skills</h2>
            <p className="section-subtitle">Comprehensive courses designed by industry experts for young innovators</p>
            <div className="shine-separator-rtl"></div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: '🤖', name: 'Robotics', desc: 'Build and program real robots. From basic motors to advanced autonomous systems.', color: 'bg-yellow-500', students: '3,500+', image: '/images/course-robotics.png' },
              { icon: '🧠', name: 'AI & Machine Learning', desc: 'Create intelligent systems. Learn neural networks, computer vision, and NLP.', color: 'bg-teal-500', students: '2,800+', image: '/images/course-ai.png' },
              { icon: '💻', name: 'Python & Coding', desc: 'Master programming fundamentals. Build apps, games, and automation tools.', color: 'bg-blue-500', students: '4,200+', image: '/images/course-coding.png' },
              { icon: '📡', name: 'IoT & Smart Devices', desc: 'Connect the physical and digital world. Build smart home and wearable projects.', color: 'bg-purple-500', students: '1,900+', image: '/images/course-iot.png' },
              { icon: '⚡', name: 'Electronics', desc: 'Understand circuits and components. From LED projects to advanced sensors.', color: 'bg-orange-500', students: '2,100+', image: '/images/course-electronics.png' },
              { icon: '🎮', name: 'Game Development', desc: 'Create your own video games. Learn Unity, Scratch, and game design principles.', color: 'bg-green-500', students: '3,100+', image: '/images/course-gamedev.png' },
            ].map((course, idx) => (
              <Link
                key={idx}
                to={`/courses?category=${course.name}`}
                className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 scroll-reveal border border-gray-100"
                style={{ transitionDelay: `${idx * 100}ms` }}
              >
                {/* Course Image */}
                <div className="relative h-44 overflow-hidden">
                  <img
                    src={course.image}
                    alt={course.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                  {/* Floating Icon Badge */}
                  <div className={`absolute bottom-4 left-4 w-14 h-14 ${course.color} rounded-xl flex items-center justify-center text-2xl shadow-lg transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-300`}>
                    {course.icon}
                  </div>

                  {/* Student Count */}
                  <span className="absolute top-4 right-4 text-xs font-bold text-white bg-black/40 backdrop-blur-sm px-3 py-1.5 rounded-full">
                    {course.students} students
                  </span>
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-robitro-navy mb-2 group-hover:text-robitro-blue transition-colors">
                    {course.name}
                  </h3>
                  <p className="text-robitro-gray text-sm mb-4 leading-relaxed line-clamp-2">
                    {course.desc}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-robitro-blue font-semibold text-sm group-hover:underline">
                      View courses
                    </span>
                    <div className={`w-8 h-8 ${course.color} rounded-full flex items-center justify-center group-hover:translate-x-1 transition-transform`}>
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className="text-center mt-12 scroll-reveal">
            <Link to="/courses" className="btn-primary text-lg">
              🎯 Browse All Courses
            </Link>
          </div>
        </div>
      </section>

      {/* ==================== FEATURED TOOL KITS SECTION ==================== */}
      <section className="w-full bg-white py-20 lg:py-28 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16 scroll-reveal">
            <span className="inline-block px-4 py-2 bg-robitro-yellow/10 text-robitro-navy text-sm font-bold rounded-full mb-4">TOOL KITS</span>
            <h2 className="section-title">Featured Learning Kits</h2>
            <p className="section-subtitle">Hands-on robotics and electronics kits to bring your projects to life</p>
            <div className="shine-separator"></div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                id: 1,
                name: 'MEX DIY Robotics Kit 2.0',
                description: 'Build hundreds of robots with 300+ parts',
                price: 125,
                originalPrice: 130,
                rating: 4.8,
                image: 'https://images.unsplash.com/photo-1561557944-6e7860d1a7eb?w=400&h=400&fit=crop',
                badge: 'Best Seller',
                badgeColor: 'bg-robitro-yellow'
              },
              {
                id: 2,
                name: 'Arduino Ultimate Pack',
                description: 'Master Arduino with 40+ components',
                price: 40,
                originalPrice: 60,
                rating: 4.7,
                image: 'https://images.unsplash.com/photo-1553406830-ef2513450d76?w=400&h=400&fit=crop',
                badge: 'Popular',
                badgeColor: 'bg-robitro-blue'
              },
              {
                id: 7,
                name: 'Coding Robot Buddy',
                description: 'Programmable robot for young coders',
                price: 35,
                originalPrice: 50,
                rating: 4.9,
                image: 'https://images.unsplash.com/photo-1535378917042-10a22c95931a?w=400&h=400&fit=crop',
                badge: 'Kids Favorite',
                badgeColor: 'bg-robitro-teal'
              },
              {
                id: 4,
                name: 'Drone Building Kit',
                description: 'Build your own quadcopter drone',
                price: 90,
                originalPrice: 130,
                rating: 4.9,
                image: 'https://images.unsplash.com/photo-1508614589041-895b88991e3e?w=400&h=400&fit=crop',
                badge: 'Premium',
                badgeColor: 'bg-gradient-to-r from-purple-500 to-pink-500'
              }
            ].map((product, idx) => (
              <Link
                key={product.id}
                to={`/shop`}
                className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 scroll-reveal border border-gray-100"
                style={{ transitionDelay: `${idx * 100}ms` }}
              >
                {/* Product Image */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                  {/* Badge */}
                  {product.badge && (
                    <span className={`absolute top-4 left-4 ${product.badgeColor} text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg`}>
                      {product.badge}
                    </span>
                  )}

                  {/* Rating */}
                  <div className="absolute bottom-4 left-4 flex items-center gap-1 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full">
                    <span className="text-robitro-yellow text-sm">★</span>
                    <span className="text-sm font-bold text-robitro-navy">{product.rating}</span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="text-lg font-bold text-robitro-navy mb-2 group-hover:text-robitro-blue transition-colors line-clamp-1">
                    {product.name}
                  </h3>
                  <p className="text-robitro-gray text-sm mb-4 line-clamp-2">
                    {product.description}
                  </p>

                  {/* Price */}
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-2xl font-black text-robitro-navy">£{product.price.toLocaleString()}</span>
                      {product.originalPrice > product.price && (
                        <span className="ml-2 text-sm text-gray-400 line-through">£{product.originalPrice.toLocaleString()}</span>
                      )}
                    </div>
                    <div className="w-10 h-10 bg-robitro-yellow rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                      <svg className="w-5 h-5 text-robitro-navy" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className="text-center mt-12 scroll-reveal">
            <Link to="/shop" className="btn-primary text-lg">
              🛒 View All Products
            </Link>
          </div>
        </div>
      </section>

      {/* ==================== STATS SECTION ==================== */}
      <section className="w-full mesh-gradient-dark py-20 lg:py-28 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, idx) => {
              const { count, ref } = useCountUp(stat.number);
              return (
                <div key={idx} ref={ref} className="text-center scroll-reveal" style={{ transitionDelay: `${idx * 150}ms` }}>
                  <div className="text-5xl mb-4">{stat.icon}</div>
                  <div className="counter-value">{count.toLocaleString()}{stat.suffix}</div>
                  <p className="text-gray-300 font-medium mt-2">{stat.label}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ==================== TESTIMONIALS SECTION ==================== */}
      <section className="w-full bg-gradient-to-br from-white to-gray-50 py-20 lg:py-28 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 scroll-reveal">
            <span className="inline-block px-4 py-2 bg-robitro-yellow/10 text-robitro-navy text-sm font-bold rounded-full mb-4">TESTIMONIALS</span>
            <h2 className="section-title">Loved by Students Worldwide</h2>
            <p className="section-subtitle">Hear from young innovators who transformed their future with Robitro</p>
            <div className="shine-separator"></div>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { name: 'Aarav Singh', age: 11, country: 'India', quote: 'Robitro made learning robotics so much fun! I built my first working robot and even won a local competition.', avatar: '👦', color: 'border-robitro-yellow' },
              { name: 'Emma Chen', age: 14, country: 'USA', quote: 'The AI course was incredible. I created my own image recognition app! The instructors explain complex topics so clearly.', avatar: '👧', color: 'border-robitro-blue' },
              { name: 'Lucas Müller', age: 12, country: 'Germany', quote: 'Best platform for young coders. The community is amazing and I made friends from all over the world.', avatar: '👦', color: 'border-robitro-teal' },
            ].map((testimonial, idx) => (
              <div key={idx} className={`bg-white rounded-2xl p-8 shadow-lg border-t-4 ${testimonial.color} scroll-reveal group hover:scale-105 hover:shadow-xl transition-all duration-300`} style={{ transitionDelay: `${idx * 150}ms` }}>
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => <span key={i} className="text-robitro-yellow text-xl">★</span>)}
                </div>
                <p className="text-gray-700 font-medium mb-6 leading-relaxed text-lg italic">"{testimonial.quote}"</p>
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-robitro-yellow to-robitro-orange flex items-center justify-center text-2xl shadow-md">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <p className="font-bold text-robitro-navy text-lg">{testimonial.name}</p>
                    <p className="text-sm text-gray-500">Age {testimonial.age} • {testimonial.country}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== FAQ SECTION ==================== */}
      <section className="w-full bg-white py-20 lg:py-28">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 scroll-reveal">
            <span className="inline-block px-4 py-2 bg-robitro-blue/10 text-robitro-blue text-sm font-bold rounded-full mb-4">FAQ</span>
            <h2 className="section-title">Frequently Asked Questions</h2>
            <p className="section-subtitle">Everything you need to know about learning with Robitro</p>
            <div className="shine-separator-rtl"></div>
          </div>

          <div className="scroll-reveal">
            {faqs.map((faq, idx) => (
              <FAQItem
                key={idx}
                question={faq.question}
                answer={faq.answer}
                isOpen={openFAQ === idx}
                onClick={() => setOpenFAQ(openFAQ === idx ? null : idx)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ==================== CTA SECTION ==================== */}
      <section className="w-full py-20 lg:py-28 relative overflow-hidden" style={{
        background: 'linear-gradient(135deg, #2563EB 0%, #1E3A8A 30%, #7C3AED 60%, #06B6D4 100%)'
      }}>
        {/* Floating decorative elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Floating robots and shapes */}
          <div className="absolute top-10 left-10 text-6xl opacity-20 animate-bounce" style={{ animationDuration: '3s' }}>🤖</div>
          <div className="absolute top-20 right-20 text-5xl opacity-15 animate-bounce" style={{ animationDuration: '4s', animationDelay: '1s' }}>⚙️</div>
          <div className="absolute bottom-20 left-20 text-4xl opacity-20 animate-bounce" style={{ animationDuration: '2.5s', animationDelay: '0.5s' }}>💡</div>
          <div className="absolute bottom-10 right-10 text-5xl opacity-15 animate-bounce" style={{ animationDuration: '3.5s', animationDelay: '1.5s' }}>🚀</div>
          <div className="absolute top-1/2 left-5 text-3xl opacity-10 animate-pulse">⭐</div>
          <div className="absolute top-1/3 right-10 text-4xl opacity-10 animate-pulse" style={{ animationDelay: '0.5s' }}>✨</div>

          {/* Gradient orbs */}
          <div className="absolute -top-20 -right-20 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-yellow-400/20 rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center scroll-reveal">
            <h2 className="text-4xl md:text-5xl font-black text-white mb-6 drop-shadow-lg">Ready to Shape the Future?</h2>
            <p className="text-xl text-white/90 mb-10 max-w-2xl mx-auto">
              Join 10,000+ young innovators learning the skills of tomorrow. Start your free trial today!
            </p>

            <div className="flex flex-col sm:flex-row justify-center gap-4 mb-12">
              <Link to="/register" className="bg-robitro-yellow text-gray-900 px-8 py-4 rounded-2xl font-bold text-lg shadow-2xl hover:scale-105 hover:shadow-yellow-400/30 transition-all duration-300">
                🚀 Start Free Trial
              </Link>
              <Link to="/courses" className="bg-white/20 backdrop-blur-sm text-white border-2 border-white/50 px-8 py-4 rounded-2xl font-bold text-lg hover:bg-white/30 transition-all duration-300">
                Browse Courses →
              </Link>
            </div>

            {/* Newsletter */}
            <div className="mt-12 pt-12 border-t border-white/20">
              <p className="text-white font-semibold mb-4">📧 Subscribe to our newsletter for tips & updates</p>
              <form className="flex max-w-md mx-auto" onSubmit={(e) => e.preventDefault()}>
                <input type="email" placeholder="Enter your email" className="flex-1 px-6 py-4 bg-white/20 backdrop-blur-sm border border-white/30 rounded-l-2xl text-white placeholder-white/60 focus:outline-none focus:border-white/50" />
                <button type="submit" className="px-8 py-4 bg-robitro-yellow text-gray-900 font-bold rounded-r-2xl hover:bg-yellow-300 transition-colors">Subscribe</button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
