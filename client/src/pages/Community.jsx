import { useState, useEffect, useRef } from 'react';
import { Play, Heart, MessageCircle, Youtube, Facebook, Linkedin, Instagram, Sparkles, ArrowRight, Star, TrendingUp, Eye, ChevronRight, Trophy, Flame, Clock, Globe, Zap, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';

// Counter animation hook
function useCountUp(end, duration = 2000) {
  const [count, setCount] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasStarted) {
          setHasStarted(true);
        }
      },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [hasStarted]);

  useEffect(() => {
    if (!hasStarted) return;
    const startTime = Date.now();
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * end));
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [hasStarted, end, duration]);

  return { count, ref };
}

export default function Community() {
  const [activeTab, setActiveTab] = useState('all');
  const [hoveredCard, setHoveredCard] = useState(null);

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

  const stat1 = useCountUp(50, 2000);
  const stat2 = useCountUp(12, 2000);
  const stat3 = useCountUp(200, 2000);

  const projectTabs = [
    { id: 'all', label: '🔥 All Projects' },
    { id: 'robotics', label: '🤖 Robotics' },
    { id: 'coding', label: '💻 Coding' },
    { id: 'iot', label: '📡 IoT' },
    { id: 'creative', label: '🎨 Creative' },
  ];

  return (
    <Layout>
      {/* ==================== HERO SECTION ==================== */}
      <section className="min-h-screen mesh-gradient flex items-center relative overflow-hidden">
        {/* Animated particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
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
          <div className="absolute top-40 right-16 text-5xl opacity-15 animate-bounce hidden lg:block" style={{ animationDuration: '4s', animationDelay: '1s' }}>⚡</div>
          <div className="absolute bottom-40 left-20 text-4xl opacity-20 animate-bounce hidden lg:block" style={{ animationDuration: '2.5s', animationDelay: '0.5s' }}>💡</div>
          <div className="absolute bottom-32 right-24 text-5xl opacity-15 animate-bounce hidden lg:block" style={{ animationDuration: '3.5s', animationDelay: '1.5s' }}>🚀</div>
          <div className="absolute top-1/3 left-6 text-4xl opacity-10 animate-pulse hidden md:block">⭐</div>
          <div className="absolute top-2/3 right-8 text-3xl opacity-10 animate-pulse hidden md:block" style={{ animationDelay: '0.5s' }}>✨</div>

          {/* Large gradient orbs */}
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-br from-robitro-teal/20 to-robitro-blue/10 rounded-full blur-3xl" style={{ animation: 'pulse-soft 6s ease-in-out infinite' }} />
          <div className="absolute -bottom-32 -left-32 w-[500px] h-[500px] bg-gradient-to-tr from-robitro-yellow/15 to-robitro-teal/10 rounded-full blur-3xl" style={{ animation: 'pulse-soft 8s ease-in-out infinite 2s' }} />
        </div>

        <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-20 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Hero Text */}
            <div className="scroll-reveal-left revealed space-y-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-robitro-yellow/20 rounded-full">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
                </span>
                <span className="text-sm font-semibold text-robitro-navy">🔥 4,200+ makers online now</span>
              </div>

              <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-robitro-navy leading-tight">
                Where <span className="text-robitro-teal">Makers</span> Build The <span className="text-robitro-yellow">Future</span>
              </h1>

              <p className="text-xl md:text-2xl text-robitro-gray font-medium leading-relaxed max-w-xl">
                Join <span className="text-robitro-blue font-semibold">50,000+</span> young innovators sharing robotics, coding, and DIY tech projects. Learn, share, and create what's never been built before.
              </p>

              <div className="flex flex-wrap gap-4 pt-4">
                <Link to="/register" className="btn-primary shadow-xl hover:shadow-2xl text-lg">
                  🚀 Join The Community
                </Link>
                <button className="btn-secondary shadow-lg hover:shadow-xl text-lg">
                  <Play size={18} className="inline mr-2" /> Watch Showcase
                </button>
              </div>

              {/* Trust indicators */}
              <div className="flex flex-wrap items-center gap-8 pt-8 border-t border-gray-200/50">
                <div ref={stat1.ref} className="text-center">
                  <p className="text-3xl font-black text-robitro-yellow">{stat1.count}K+</p>
                  <p className="text-xs text-robitro-gray font-medium">Makers</p>
                </div>
                <div ref={stat2.ref} className="text-center">
                  <p className="text-3xl font-black text-robitro-teal">{stat2.count}K+</p>
                  <p className="text-xs text-robitro-gray font-medium">Projects</p>
                </div>
                <div ref={stat3.ref} className="text-center">
                  <p className="text-3xl font-black text-robitro-blue">{stat3.count}K+</p>
                  <p className="text-xs text-robitro-gray font-medium">Discussions</p>
                </div>
              </div>
            </div>

            {/* Hero Visual */}
            <div className="scroll-reveal-right revealed relative h-[400px] lg:h-[500px] hidden lg:block">
              <div className="relative w-full h-full rounded-3xl overflow-hidden shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1612611741189-a9b9eb01d515?w=900&auto=format&fit=crop&q=80"
                  alt="Robitro Community"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-robitro-navy/80 via-transparent to-transparent" />

                {/* Overlay content */}
                <div className="absolute bottom-8 left-8 right-8 text-white">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="flex -space-x-2">
                      {['🧑‍💻', '👩‍🔬', '🧑‍🚀'].map((e, i) => (
                        <div key={i} className="w-8 h-8 rounded-full bg-white/90 flex items-center justify-center text-sm border-2 border-white shadow-sm">
                          {e}
                        </div>
                      ))}
                    </div>
                    <span className="text-white/80 text-sm font-medium">+2,847 makers this week</span>
                  </div>
                  <h3 className="text-2xl md:text-3xl font-bold mb-2">Global Robotics Challenge 2026</h3>
                  <p className="text-gray-200 text-lg">Featured Community Event</p>
                </div>

                {/* Decorative ring */}
                <div className="absolute inset-0 rounded-3xl ring-2 ring-robitro-yellow/30 pointer-events-none" />
              </div>

              {/* Floating card: Top Right */}
              <div className="absolute -top-4 -right-4 z-20" style={{ animation: 'float 6s ease-in-out infinite' }}>
                <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-4 flex items-center gap-3 shadow-xl border border-gray-100">
                  <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-robitro-yellow to-robitro-orange flex items-center justify-center text-white shadow-lg">
                    <Trophy size={20} />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-robitro-gray uppercase tracking-widest">New Record</p>
                    <p className="text-sm font-black text-robitro-navy">#1 Trending</p>
                  </div>
                </div>
              </div>

              {/* Floating card: Bottom Left */}
              <div className="absolute -bottom-4 -left-4 z-20" style={{ animation: 'float 7s ease-in-out infinite 2s' }}>
                <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-4 flex items-center gap-3 shadow-xl border border-gray-100">
                  <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-green-400 to-robitro-teal flex items-center justify-center text-white shadow-lg">
                    <TrendingUp size={20} />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-robitro-gray uppercase tracking-widest">This Month</p>
                    <p className="text-sm font-black text-robitro-navy">+127% Growth</p>
                  </div>
                </div>
              </div>
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

      {/* ==================== SCROLLING TRUST STRIP ==================== */}
      <section className="w-full py-12 bg-white border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16">
            {[
              '🤖 50K+ Active Makers',
              '🏆 Global Championships',
              '⚡ Daily Challenges',
              '🎓 Expert Mentors',
              '🌍 120+ Countries',
              '💡 12K+ Projects',
            ].map((item, i) => (
              <div key={i} className="partner-logo flex items-center gap-2 text-base cursor-pointer transition-all duration-300 hover:scale-110">
                <span className="font-bold text-robitro-gray">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== TECH BITES (SHORTS) ==================== */}
      <section className="w-full mesh-gradient py-20 lg:py-28 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16 scroll-reveal">
            <span className="inline-block px-4 py-2 bg-robitro-red/10 text-robitro-red text-sm font-bold rounded-full mb-4">🔥 TRENDING NOW</span>
            <h2 className="section-title">Tech Bites</h2>
            <p className="section-subtitle">Quick-fire tutorials and amazing mechanisms in under 60 seconds</p>
            <div className="shine-separator"></div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5">
            {[
              { title: "Building a Spider-Bot", views: "12.4K", duration: "0:45", thumb: "https://img.youtube.com/vi/6pW_Xp1_07A/mqdefault.jpg" },
              { title: "Hand-Gesture Control", views: "8.6K", duration: "0:38", thumb: "https://img.youtube.com/vi/C83U6sX9GvI/mqdefault.jpg" },
              { title: "Advanced Line Follower", views: "23.1K", duration: "0:52", thumb: "https://img.youtube.com/vi/bYCHmRE88X8/mqdefault.jpg" },
              { title: "Gravity-Defying Scissor Lift", views: "5.4K", duration: "0:41", thumb: "https://img.youtube.com/vi/T9kE1z2t94k/mqdefault.jpg" },
              { title: "First Flight: DIY Drone", views: "45.2K", duration: "0:59", thumb: "https://img.youtube.com/vi/L9OIn6P_q9E/mqdefault.jpg" },
              { title: "Arduino Smart Mirror", views: "15.9K", duration: "0:55", thumb: "https://img.youtube.com/vi/v5u7LzB7q4g/mqdefault.jpg" },
              { title: "Voice-Activated Lights", views: "9.2K", duration: "0:48", thumb: "https://img.youtube.com/vi/C_U6Fqf0QfA/mqdefault.jpg" },
              { title: "Solar Tracker Prototype", views: "11.7K", duration: "0:50", thumb: "https://img.youtube.com/vi/Gz0O8vV08l8/mqdefault.jpg" },
            ].map((item, idx) => (
              <div
                key={idx}
                className="group relative aspect-[9/16] rounded-3xl overflow-hidden cursor-pointer transition-all duration-500 hover:-translate-y-3 hover:shadow-2xl scroll-reveal border border-gray-200"
                style={{ transitionDelay: `${idx * 100}ms` }}
                onMouseEnter={() => setHoveredCard(`short-${idx}`)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <img
                  src={item.thumb}
                  alt={item.title}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-robitro-navy/90 via-black/20 to-transparent" />

                {/* Duration badge */}
                <div className="absolute top-4 right-4 z-10">
                  <span className="px-2.5 py-1 bg-robitro-navy/60 backdrop-blur-sm text-white text-[11px] font-bold rounded-lg">
                    {item.duration}
                  </span>
                </div>

                {/* Play button */}
                <div className="absolute inset-0 flex items-center justify-center z-10 opacity-0 group-hover:opacity-100 transition-all duration-300">
                  <div className="w-16 h-16 bg-robitro-yellow/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-2xl transform scale-75 group-hover:scale-100 transition-transform duration-300">
                    <Play size={24} className="text-robitro-navy ml-1" fill="currentColor" />
                  </div>
                </div>

                {/* Bottom content */}
                <div className="absolute bottom-0 left-0 right-0 p-5 z-10">
                  <h3 className="text-white font-bold text-sm leading-tight mb-2">{item.title}</h3>
                  <div className="flex items-center gap-2 text-white/70 text-xs font-medium">
                    <Eye size={12} />
                    <span>{item.views} views</span>
                  </div>
                </div>

                {hoveredCard === `short-${idx}` && (
                  <div className="absolute inset-0 rounded-3xl border-2 border-robitro-yellow/50 pointer-events-none" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== MASTER MAKERS ==================== */}
      <section className="w-full bg-gradient-to-br from-white via-gray-50 to-blue-50 py-20 lg:py-28 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(31,78,216,0.3) 1px, transparent 0)', backgroundSize: '24px 24px' }} />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16 scroll-reveal">
            <span className="inline-block px-4 py-2 bg-purple-500/10 text-purple-600 text-sm font-bold rounded-full mb-4">⭐ TOP CREATORS</span>
            <h2 className="section-title">Master Makers</h2>
            <p className="section-subtitle">Connect with the most innovative minds in our global community</p>
            <div className="shine-separator-rtl"></div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { name: "Aarav Patel", level: 12, role: "Robotics Innovator", avatar: "👨‍💻", projects: 34, followers: "2.1K", badge: "🏆", gradient: "from-robitro-blue to-robitro-teal" },
              { name: "Sneha Gupta", level: 8, role: "Code Creator", avatar: "👩‍🔧", projects: 21, followers: "1.5K", badge: "⚡", gradient: "from-purple-500 to-pink-400" },
              { name: "Rohan Kumar", level: 15, role: "Grand Master", avatar: "🧑‍🚀", projects: 56, followers: "5.2K", badge: "👑", gradient: "from-robitro-yellow to-robitro-orange" },
              { name: "Priya Singh", level: 5, role: "IoT Builder", avatar: "👩‍🔬", projects: 12, followers: "890", badge: "🌟", gradient: "from-robitro-teal to-green-400" },
            ].map((profile, idx) => (
              <div
                key={idx}
                className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 scroll-reveal border border-gray-100 text-center p-8"
                style={{ transitionDelay: `${idx * 100}ms` }}
              >
                {/* Background accent */}
                <div className={`absolute top-0 left-0 right-0 h-24 bg-gradient-to-br ${profile.gradient} opacity-5 group-hover:opacity-10 transition-opacity`} />

                {/* Avatar */}
                <div className="relative inline-block mb-6">
                  <div className={`inline-block p-[3px] rounded-[28px] bg-gradient-to-r ${profile.gradient}`}>
                    <div className="w-20 h-20 rounded-[24px] bg-white flex items-center justify-center text-4xl">
                      {profile.avatar}
                    </div>
                  </div>
                  <div className={`absolute -bottom-2 -right-2 w-8 h-8 rounded-xl bg-gradient-to-br ${profile.gradient} flex items-center justify-center text-white text-xs font-black shadow-lg`}>
                    {profile.level}
                  </div>
                </div>

                {/* Badge */}
                <div className="absolute top-6 right-6 text-2xl">{profile.badge}</div>

                <h3 className="text-lg font-bold text-robitro-navy mb-1 group-hover:text-robitro-blue transition-colors">{profile.name}</h3>
                <p className="text-sm text-robitro-gray font-medium mb-5">{profile.role}</p>

                {/* Stats */}
                <div className="flex justify-center gap-6 mb-6">
                  <div>
                    <p className="text-lg font-black text-robitro-navy">{profile.projects}</p>
                    <p className="text-[10px] font-bold text-robitro-gray uppercase tracking-wider">Projects</p>
                  </div>
                  <div className="w-px bg-gray-200" />
                  <div>
                    <p className="text-lg font-black text-robitro-navy">{profile.followers}</p>
                    <p className="text-[10px] font-bold text-robitro-gray uppercase tracking-wider">Followers</p>
                  </div>
                </div>

                <button className="w-full py-3 px-4 bg-gray-50 hover:bg-robitro-blue text-robitro-navy hover:text-white text-sm font-bold rounded-xl transition-all duration-300 group-hover:bg-robitro-blue group-hover:text-white">
                  View Profile
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== TRENDING INNOVATION LAB ==================== */}
      <section className="w-full mesh-gradient py-20 lg:py-28 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col lg:flex-row gap-14 items-start">
            <div className="lg:w-2/5 lg:sticky lg:top-8 scroll-reveal-left">
              <span className="inline-block px-4 py-2 bg-robitro-blue/10 text-robitro-blue text-sm font-bold rounded-full mb-4">🔬 HOT RIGHT NOW</span>
              <h2 className="text-4xl md:text-5xl font-bold text-robitro-navy mb-6 leading-tight">
                Trending
                <br />
                <span className="text-robitro-teal">Innovation Lab</span>
              </h2>
              <p className="text-robitro-gray text-lg mb-8 leading-relaxed">
                The most ambitious builds from the past 24 hours. These projects are redefining what's possible.
              </p>
              <Link to="/community" className="btn-primary text-base">
                Explore All <ArrowRight size={16} className="inline ml-2" />
              </Link>
            </div>

            <div className="lg:w-3/5 grid sm:grid-cols-2 gap-6 w-full">
              {[
                { title: "Automatic Plant Watering", author: "Team EcoBot", icon: "🌿", likes: 124, comments: 45, time: "2h ago" },
                { title: "Buzz Wire Game", author: "Circuit Masters", icon: "⚡", likes: 89, comments: 32, time: "4h ago" },
                { title: "Smart Home Dashboard", author: "IoT Wizards", icon: "🏠", likes: 203, comments: 67, time: "6h ago" },
                { title: "Obstacle Avoider Bot", author: "RoboRookies", icon: "🤖", likes: 156, comments: 51, time: "8h ago" },
              ].map((maker, idx) => (
                <div key={idx} className="group bg-white rounded-2xl p-5 border border-gray-100 hover:border-robitro-yellow/50 transition-all duration-300 cursor-pointer hover:shadow-xl hover:scale-105 scroll-reveal" style={{ transitionDelay: `${idx * 100}ms` }}>
                  <div className="flex gap-4">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center text-3xl shrink-0 group-hover:scale-110 transition-transform duration-300 border border-gray-100">
                      {maker.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-robitro-navy leading-tight mb-1 group-hover:text-robitro-blue transition-colors text-sm">{maker.title}</h3>
                      <p className="text-sm text-robitro-gray mb-3">by {maker.author}</p>
                      <div className="flex items-center gap-4 text-xs text-robitro-gray">
                        <span className="flex items-center gap-1">
                          <Heart size={12} className="text-robitro-red" /> {maker.likes}
                        </span>
                        <span className="flex items-center gap-1">
                          <MessageCircle size={12} className="text-robitro-blue" /> {maker.comments}
                        </span>
                        <span className="flex items-center gap-1 ml-auto">
                          <Clock size={12} /> {maker.time}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ==================== PROJECT SHOWCASE ==================== */}
      <section className="w-full bg-gradient-to-br from-white to-gray-50 py-20 lg:py-28 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(6,182,212,0.3) 1px, transparent 0)', backgroundSize: '24px 24px' }} />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16 scroll-reveal">
            <span className="inline-block px-4 py-2 bg-robitro-teal/10 text-robitro-teal text-sm font-bold rounded-full mb-4">✨ COMMUNITY BUILDS</span>
            <h2 className="section-title">Project Showcase</h2>
            <p className="section-subtitle">The latest breakthroughs from the Robitro global community</p>
            <div className="shine-separator"></div>
          </div>

          {/* Tabs */}
          <div className="flex gap-3 mb-10 overflow-x-auto pb-2 justify-center flex-wrap scroll-reveal">
            {projectTabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-5 py-2.5 rounded-full text-sm font-bold whitespace-nowrap transition-all duration-300
                  ${activeTab === tab.id
                    ? 'bg-gradient-to-r from-robitro-blue to-robitro-teal text-white shadow-lg'
                    : 'bg-white text-robitro-gray border border-gray-200 hover:border-robitro-blue/50 hover:text-robitro-blue'
                  }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { title: "Jurassic World Diorama", author: "DinoFan99", tag: "Creative", img: "🦖", color: "from-robitro-yellow to-robitro-orange", likes: 342 },
              { title: "Mars Rover Prototype", author: "SpaceCadet", tag: "Robotics", img: "🚀", color: "from-robitro-blue to-indigo-600", likes: 567 },
              { title: "Voice Controlled Car", author: "AutoBot", tag: "Coding", img: "🚗", color: "from-robitro-teal to-green-500", likes: 234 },
              { title: "Smart Traffic Light", author: "CityPlanner", tag: "IoT", img: "🚦", color: "from-robitro-red to-rose-500", likes: 189 },
            ].map((project, idx) => (
              <div key={idx} className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 scroll-reveal cursor-pointer border border-gray-100" style={{ transitionDelay: `${idx * 100}ms` }}>
                {/* Image area */}
                <div className={`relative h-44 bg-gradient-to-br ${project.color} flex items-center justify-center overflow-hidden`}>
                  <div className="absolute inset-0 bg-black/5" />
                  <span className="text-7xl relative z-10 group-hover:scale-125 transition-transform duration-700 drop-shadow-2xl">
                    {project.img}
                  </span>

                  {/* Tag */}
                  <div className="absolute top-4 left-4 z-10">
                    <span className="px-3 py-1.5 bg-white/90 backdrop-blur-sm text-robitro-navy text-[10px] font-black rounded-full uppercase tracking-widest shadow-sm">
                      {project.tag}
                    </span>
                  </div>

                  {/* Like button */}
                  <div className="absolute top-4 right-4 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="w-9 h-9 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-robitro-gray hover:text-robitro-red transition-colors shadow-sm">
                      <Heart size={16} />
                    </button>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="text-lg font-bold text-robitro-navy mb-4 group-hover:text-robitro-blue transition-colors leading-tight">
                    {project.title}
                  </h3>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-robitro-blue to-robitro-teal flex items-center justify-center text-xs font-black text-white">
                        {project.author[0]}
                      </div>
                      <span className="text-sm text-robitro-gray font-semibold">{project.author}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-robitro-gray text-sm">
                      <Heart size={14} className="text-robitro-red" fill="currentColor" />
                      <span className="font-bold">{project.likes}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== THE CHALLENGE ==================== */}
      <section className="w-full py-20 lg:py-28 relative overflow-hidden" style={{
        background: 'linear-gradient(135deg, #1E3A8A 0%, #2563EB 30%, #06B6D4 60%, #7C3AED 100%)'
      }}>
        {/* Floating decorative elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-10 left-10 text-6xl opacity-20 animate-bounce" style={{ animationDuration: '3s' }}>🏆</div>
          <div className="absolute top-20 right-20 text-5xl opacity-15 animate-bounce" style={{ animationDuration: '4s', animationDelay: '1s' }}>⚙️</div>
          <div className="absolute bottom-20 left-20 text-4xl opacity-20 animate-bounce" style={{ animationDuration: '2.5s', animationDelay: '0.5s' }}>💡</div>
          <div className="absolute bottom-10 right-10 text-5xl opacity-15 animate-bounce" style={{ animationDuration: '3.5s', animationDelay: '1.5s' }}>🚀</div>
          <div className="absolute -top-20 -right-20 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-yellow-400/20 rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <div className="lg:w-3/5 text-center lg:text-left scroll-reveal">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-robitro-yellow text-robitro-navy text-xs font-black rounded-full mb-8 tracking-widest uppercase shadow-lg shadow-yellow-400/20">
                <Zap size={14} fill="currentColor" /> LIVE CHALLENGE
              </div>
              <h2 className="text-4xl md:text-6xl font-black text-white mb-6 leading-tight drop-shadow-lg">
                WC 2026:
                <br />
                <span className="text-robitro-yellow">
                  Code of Duty
                </span>
              </h2>
              <p className="text-white/80 text-lg mb-10 max-w-xl leading-relaxed">
                The global championship for young innovators. Battle the best, solve real-world problems, and win over ₹1,00,000 in prizes.
              </p>
              <div className="flex flex-wrap gap-6 justify-center lg:justify-start items-center">
                <Link to="/register" className="bg-robitro-yellow text-robitro-navy px-8 py-4 rounded-2xl font-bold text-lg shadow-2xl hover:scale-105 hover:shadow-yellow-400/30 transition-all duration-300 flex items-center gap-2">
                  Register For Free
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </Link>

                <div className="flex items-center gap-8 border-l border-white/20 pl-8">
                  {[
                    { value: '450+', label: 'Registered' },
                    { value: '12d', label: 'Remaining' },
                    { value: '₹1L+', label: 'Prizes' },
                  ].map((s, i) => (
                    <div key={i} className="text-center">
                      <p className="text-xl font-black text-robitro-yellow">{s.value}</p>
                      <p className="text-[10px] font-bold text-white/50 uppercase tracking-wider">{s.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Trophy visual */}
            <div className="lg:w-2/5 flex justify-center scroll-reveal-right">
              <div className="relative">
                <div className="w-48 h-48 md:w-64 md:h-64 bg-gradient-to-br from-robitro-yellow to-robitro-orange rounded-full flex items-center justify-center text-8xl md:text-9xl shadow-2xl" style={{ animation: 'float 6s ease-in-out infinite', boxShadow: '0 0 100px rgba(251, 191, 36, 0.3), 0 0 200px rgba(251, 191, 36, 0.1)' }}>
                  🏆
                </div>
                {/* Orbiting badges */}
                {['🥇', '🥈', '🥉'].map((medal, i) => (
                  <div key={i} className="absolute top-1/2 left-1/2 w-0 h-0 hidden md:block">
                    <div style={{ animation: `spin ${15}s linear infinite ${i * 5}s`, transformOrigin: '0 0' }}>
                      <div className="w-12 h-12 rounded-full bg-white shadow-xl flex items-center justify-center text-xl" style={{ transform: `translateX(${120 + i * 10}px) translateY(-50%)` }}>
                        {medal}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* ==================== FINAL CTA ==================== */}
      <section className="w-full py-20 lg:py-28 relative overflow-hidden" style={{
        background: 'linear-gradient(135deg, #2563EB 0%, #1E3A8A 30%, #7C3AED 60%, #06B6D4 100%)'
      }}>
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-10 left-10 text-6xl opacity-20 animate-bounce" style={{ animationDuration: '3s' }}>🤖</div>
          <div className="absolute bottom-10 right-10 text-5xl opacity-15 animate-bounce" style={{ animationDuration: '4s', animationDelay: '1s' }}>⚙️</div>
          <div className="absolute -top-20 -right-20 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-yellow-400/20 rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center scroll-reveal">
            <h2 className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tight leading-tight drop-shadow-lg">
              Ready to Build
              <br />
              <span className="text-robitro-yellow">Something Amazing?</span>
            </h2>
            <p className="text-white/80 text-xl mb-10 max-w-2xl mx-auto leading-relaxed">
              Join the fastest-growing maker community and turn your ideas into reality. No experience needed — just curiosity.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4 mb-12">
              <Link to="/register" className="bg-robitro-yellow text-robitro-navy px-8 py-4 rounded-2xl font-bold text-lg shadow-2xl hover:scale-105 hover:shadow-yellow-400/30 transition-all duration-300">
                🚀 Get Started Free
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
                <button type="submit" className="px-8 py-4 bg-robitro-yellow text-robitro-navy font-bold rounded-r-2xl hover:bg-yellow-300 transition-colors">Subscribe</button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}