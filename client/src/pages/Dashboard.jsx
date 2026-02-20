import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { enrollmentService } from '../services/authService';
import Layout from '../components/Layout';
import CertificateModal from '../components/CertificateModal';

export default function Dashboard() {
  const navigate = useNavigate();
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedCertCourse, setSelectedCertCourse] = useState(null);
  const [stats, setStats] = useState({
    totalCourses: 0,
    completedCourses: 0,
    averageProgress: 0,
    hoursLearned: 0,
  });

  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    fetchEnrolledCourses();
  }, []);

  // Scroll reveal
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add('revealed');
        });
      },
      { threshold: 0.1 }
    );
    document.querySelectorAll('.scroll-reveal').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [loading]);

  const fetchEnrolledCourses = async () => {
    try {
      setLoading(true);
      const response = await enrollmentService.getMyEnrolledCourses();
      const courses = response.data.courses || [];
      setEnrolledCourses(courses);

      const completed = courses.filter(c => c.progressPercentage === 100).length;
      const avgProgress = courses.length > 0
        ? Math.round(courses.reduce((sum, c) => sum + c.progressPercentage, 0) / courses.length)
        : 0;

      setStats({
        totalCourses: courses.length,
        completedCourses: completed,
        averageProgress: avgProgress,
        hoursLearned: courses.length * 10,
      });
    } catch (err) {
      setError('Failed to load courses: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  const handleContinueLearning = (courseId) => {
    navigate(`/lms/course/${courseId}/learn`);
  };

  const getCategoryEmoji = (category) => {
    const map = {
      'Robotics': '🤖', 'AI': '🧠', 'IoT': '📡',
      'Electronics': '⚡', 'Coding': '💻', 'Game Development': '🎮'
    };
    return map[category] || '📚';
  };

  const getCategoryGradient = (category) => {
    const map = {
      'Robotics': 'from-yellow-400 to-orange-500',
      'AI': 'from-teal-400 to-cyan-500',
      'IoT': 'from-purple-400 to-pink-500',
      'Electronics': 'from-orange-400 to-red-500',
      'Coding': 'from-blue-400 to-indigo-500',
      'Game Development': 'from-green-400 to-teal-500'
    };
    return map[category] || 'from-blue-400 to-indigo-500';
  };

  if (loading) {
    return (
      <Layout>
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-16 w-16 border-b-4 border-robitro-blue mb-4"></div>
            <h3 className="text-xl font-bold text-robitro-navy mb-2">Loading your dashboard...</h3>
            <p className="text-robitro-gray">Preparing your learning journey</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* ==================== HERO / WELCOME SECTION ==================== */}
      <section className="mesh-gradient relative overflow-hidden py-16 lg:py-20">
        {/* Floating particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(10)].map((_, i) => (
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
          <div className="absolute top-10 right-10 text-5xl opacity-20 animate-bounce hidden lg:block" style={{ animationDuration: '3s' }}>🎓</div>
          <div className="absolute bottom-10 left-10 text-4xl opacity-15 animate-bounce hidden lg:block" style={{ animationDuration: '4s', animationDelay: '1s' }}>🚀</div>
          <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-gradient-to-br from-robitro-teal/20 to-robitro-blue/10 rounded-full blur-3xl" style={{ animation: 'pulse-soft 6s ease-in-out infinite' }} />
          <div className="absolute -bottom-20 -left-20 w-[300px] h-[300px] bg-gradient-to-tr from-robitro-yellow/15 to-robitro-teal/10 rounded-full blur-3xl" style={{ animation: 'pulse-soft 8s ease-in-out infinite 2s' }} />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-5 gap-8 items-center">
            {/* Welcome Text */}
            <div className="lg:col-span-3 space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-robitro-yellow/20 rounded-full">
                <span className="w-2 h-2 bg-robitro-yellow rounded-full animate-pulse" />
                <span className="text-sm font-semibold text-robitro-navy">📚 Your Learning Dashboard</span>
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-robitro-navy leading-tight">
                Welcome back, <span className="text-robitro-teal">{user.firstName || 'Student'}</span>! 👋
              </h1>

              <p className="text-lg md:text-xl text-robitro-gray font-medium leading-relaxed max-w-xl">
                Continue your learning journey and master next-gen technologies. Your progress matters!
              </p>

              <div className="flex flex-wrap gap-4 pt-2">
                {enrolledCourses.some(c => c.progressPercentage < 100) && (
                  <button
                    onClick={() => {
                      const inProgress = enrolledCourses.find(c => c.progressPercentage < 100);
                      if (inProgress) handleContinueLearning(inProgress.id);
                    }}
                    className="btn-primary shadow-xl hover:shadow-2xl text-lg"
                  >
                    ▶️ Resume Learning
                  </button>
                )}
                <Link to="/courses" className="btn-secondary shadow-lg hover:shadow-xl text-lg">
                  🎓 Explore Courses
                </Link>
              </div>
            </div>

            {/* Profile Card */}
            <div className="lg:col-span-2 scroll-reveal">
              <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-gray-100 p-8 text-center">
                <div className="w-24 h-24 mx-auto bg-gradient-to-br from-robitro-yellow to-robitro-teal rounded-full flex items-center justify-center text-4xl shadow-lg mb-4">
                  {user.firstName ? user.firstName[0].toUpperCase() : '👤'}
                </div>
                <h3 className="text-2xl font-bold text-robitro-navy mb-1">
                  {user.firstName} {user.lastName}
                </h3>
                <p className="text-robitro-gray font-medium mb-4">{user.email}</p>
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-robitro-blue/10 rounded-full mb-6">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  <span className="text-sm font-semibold text-robitro-blue capitalize">{user.role || 'Student'}</span>
                </div>

                {/* Mini Stats */}
                <div className="grid grid-cols-3 gap-4 pt-6 border-t border-gray-100">
                  <div className="text-center">
                    <p className="text-2xl font-black text-robitro-yellow">{stats.totalCourses}</p>
                    <p className="text-xs text-robitro-gray font-medium">Enrolled</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-black text-robitro-teal">{stats.completedCourses}</p>
                    <p className="text-xs text-robitro-gray font-medium">Done</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-black text-robitro-blue">{stats.averageProgress}%</p>
                    <p className="text-xs text-robitro-gray font-medium">Avg</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== STATS STRIP ==================== */}
      <section className="w-full py-8 bg-white border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: '📚', value: stats.totalCourses, label: 'Enrolled Courses', color: 'text-robitro-blue' },
              { icon: '🏆', value: stats.completedCourses, label: 'Completed', color: 'text-robitro-yellow' },
              { icon: '📈', value: `${stats.averageProgress}%`, label: 'Average Progress', color: 'text-robitro-teal' },
              { icon: '⏱️', value: `${stats.hoursLearned}h`, label: 'Study Time', color: 'text-green-500' },
            ].map((stat, idx) => (
              <div key={idx} className="flex items-center gap-4 scroll-reveal" style={{ transitionDelay: `${idx * 100}ms` }}>
                <div className="w-14 h-14 rounded-2xl bg-gray-50 flex items-center justify-center text-2xl shadow-sm">
                  {stat.icon}
                </div>
                <div>
                  <p className={`text-2xl font-black ${stat.color}`}>{stat.value}</p>
                  <p className="text-sm text-robitro-gray font-medium">{stat.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== ENROLLED COURSES ==================== */}
      <section className="w-full bg-gradient-to-br from-white via-gray-50 to-blue-50 py-16 lg:py-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(31,78,216,0.3) 1px, transparent 0)', backgroundSize: '24px 24px' }} />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-12 scroll-reveal">
            <span className="inline-block px-4 py-2 bg-robitro-teal/10 text-robitro-teal text-sm font-bold rounded-full mb-4">MY COURSES</span>
            <h2 className="section-title">Your Learning Journey</h2>
            <p className="section-subtitle">Track your progress and continue where you left off</p>
            <div className="shine-separator"></div>
          </div>

          {/* Error */}
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-6 rounded-2xl mb-8 scroll-reveal">
              <p className="font-semibold">{error}</p>
              <button onClick={fetchEnrolledCourses} className="text-sm text-red-500 underline hover:no-underline mt-2">
                Try again
              </button>
            </div>
          )}

          {enrolledCourses.length === 0 ? (
            <div className="scroll-reveal bg-white rounded-3xl shadow-xl border border-gray-100 text-center py-20 px-8 max-w-2xl mx-auto">
              <div className="w-24 h-24 mx-auto bg-gradient-to-br from-robitro-yellow/20 to-robitro-teal/20 rounded-full flex items-center justify-center text-5xl mb-6">
                📚
              </div>
              <h3 className="text-3xl font-black text-robitro-navy mb-4">Start Your Journey!</h3>
              <p className="text-robitro-gray text-lg mb-8 max-w-md mx-auto">
                You haven't enrolled in any courses yet. Explore our catalog and begin your learning adventure!
              </p>
              <Link to="/courses" className="btn-primary text-lg shadow-xl">
                🎓 Browse Courses
              </Link>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {enrolledCourses.map((course, idx) => (
                <div
                  key={course.id}
                  className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 scroll-reveal border border-gray-100"
                  style={{ transitionDelay: `${idx * 100}ms` }}
                >
                  {/* Course Image / Gradient Header */}
                  <div className="relative h-44 overflow-hidden">
                    <div className={`w-full h-full bg-gradient-to-br ${getCategoryGradient(course.category)} flex items-center justify-center`}>
                      <span className="text-7xl opacity-80 group-hover:scale-110 transition-transform duration-500">
                        {getCategoryEmoji(course.category)}
                      </span>
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

                    {/* Status Badge */}
                    <div className="absolute top-4 left-4">
                      {course.progressPercentage === 100 ? (
                        <span className="px-3 py-1.5 bg-green-500 text-white text-xs font-bold rounded-full shadow-lg">
                          ✅ Completed
                        </span>
                      ) : course.progressPercentage >= 50 ? (
                        <span className="px-3 py-1.5 bg-robitro-yellow text-gray-900 text-xs font-bold rounded-full shadow-lg">
                          📖 In Progress
                        </span>
                      ) : (
                        <span className="px-3 py-1.5 bg-white/90 backdrop-blur-sm text-robitro-navy text-xs font-bold rounded-full shadow-lg">
                          🎯 Just Started
                        </span>
                      )}
                    </div>

                    {/* Category + Level */}
                    <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                      <span className="text-xs font-bold text-white bg-black/40 backdrop-blur-sm px-3 py-1.5 rounded-full">
                        {course.category || 'General'}
                      </span>
                      <span className="text-xs font-bold text-white bg-black/40 backdrop-blur-sm px-3 py-1.5 rounded-full">
                        {course.level || 'Beginner'}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-robitro-navy mb-3 group-hover:text-robitro-blue transition-colors line-clamp-2">
                      {course.title}
                    </h3>

                    {/* Progress Bar */}
                    <div className="mb-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-semibold text-robitro-gray">Progress</span>
                        <span className="text-sm font-bold text-robitro-blue">{course.progressPercentage || 0}%</span>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
                        <div
                          className={`h-3 rounded-full transition-all duration-700 ${course.progressPercentage === 100
                            ? 'bg-gradient-to-r from-green-400 to-green-500'
                            : 'bg-gradient-to-r from-robitro-blue to-robitro-teal'
                            }`}
                          style={{ width: `${course.progressPercentage || 0}%` }}
                        ></div>
                      </div>
                    </div>

                    {/* Lessons Info */}
                    <p className="text-sm text-robitro-gray mb-4">
                      <span className="font-semibold">{course.completedLessons?.length || 0}</span> lessons completed
                    </p>

                    {/* Action Button */}
                    {course.progressPercentage < 100 ? (
                      <button
                        onClick={() => handleContinueLearning(course.id)}
                        className="w-full py-3 bg-gradient-to-r from-robitro-blue to-robitro-teal text-white font-bold rounded-xl hover:shadow-lg hover:scale-[1.02] transition-all duration-300 flex items-center justify-center gap-2"
                      >
                        ▶️ Continue Learning
                      </button>
                    ) : (
                      <button
                        onClick={() => setSelectedCertCourse(course)}
                        className="w-full py-3 bg-gradient-to-r from-green-400 to-green-500 text-white font-bold rounded-xl hover:shadow-lg hover:scale-[1.02] transition-all duration-300 flex items-center justify-center gap-2"
                      >
                        🏆 View Certificate
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ==================== QUICK ACTIONS ==================== */}
      <section className="w-full bg-white py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 scroll-reveal">
            <span className="inline-block px-4 py-2 bg-robitro-yellow/10 text-robitro-navy text-sm font-bold rounded-full mb-4">QUICK ACTIONS</span>
            <h2 className="section-title">What Would You Like To Do?</h2>
            <div className="shine-separator-rtl"></div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: '🎓',
                title: 'Browse Courses',
                desc: 'Discover new skills and advance your learning',
                gradient: 'from-blue-400 to-indigo-500',
                link: '/courses'
              },
              {
                icon: '🛒',
                title: 'Shop Kits',
                desc: 'Get hands-on with robotics and electronics kits',
                gradient: 'from-yellow-400 to-orange-500',
                link: '/shop'
              },
              {
                icon: '👥',
                title: 'Community',
                desc: 'Connect with fellow innovators worldwide',
                gradient: 'from-green-400 to-teal-500',
                link: '/community'
              },
              {
                icon: '📖',
                title: 'My Courses',
                desc: 'View all your enrolled courses and progress',
                gradient: 'from-purple-400 to-pink-500',
                link: '/lms/my-courses'
              },
            ].map((action, idx) => (
              <Link
                key={idx}
                to={action.link}
                className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 scroll-reveal border border-gray-100"
                style={{ transitionDelay: `${idx * 100}ms` }}
              >
                <div className={`h-3 bg-gradient-to-r ${action.gradient}`} />
                <div className="p-6">
                  <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${action.gradient} flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                    {action.icon}
                  </div>
                  <h3 className="text-xl font-bold text-robitro-navy mb-2 group-hover:text-robitro-blue transition-colors">{action.title}</h3>
                  <p className="text-robitro-gray text-sm leading-relaxed">{action.desc}</p>
                  <div className="mt-4 flex items-center gap-2 text-robitro-blue font-semibold text-sm group-hover:gap-3 transition-all">
                    <span>Go</span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== MOTIVATION CTA ==================== */}
      <section className="w-full py-16 lg:py-20 relative overflow-hidden" style={{
        background: 'linear-gradient(135deg, #2563EB 0%, #1E3A8A 30%, #7C3AED 60%, #06B6D4 100%)'
      }}>
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-10 left-10 text-5xl opacity-20 animate-bounce" style={{ animationDuration: '3s' }}>🤖</div>
          <div className="absolute top-20 right-20 text-4xl opacity-15 animate-bounce" style={{ animationDuration: '4s', animationDelay: '1s' }}>⚙️</div>
          <div className="absolute bottom-10 left-20 text-4xl opacity-20 animate-bounce" style={{ animationDuration: '2.5s', animationDelay: '0.5s' }}>💡</div>
          <div className="absolute bottom-20 right-10 text-5xl opacity-15 animate-bounce" style={{ animationDuration: '3.5s', animationDelay: '1.5s' }}>🚀</div>
          <div className="absolute -top-20 -right-20 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-yellow-400/20 rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center scroll-reveal">
            <h2 className="text-3xl md:text-5xl font-black text-white mb-6 drop-shadow-lg">
              🔥 Keep the Momentum Going!
            </h2>
            <p className="text-xl text-white/90 mb-10 max-w-2xl mx-auto">
              Consistency is key. Every lesson completed is one step closer to mastering the skills of tomorrow!
            </p>

            <div className="grid grid-cols-3 gap-8 max-w-lg mx-auto mb-10">
              <div className="text-center">
                <div className="text-4xl font-black text-robitro-yellow">{stats.totalCourses}</div>
                <p className="text-sm text-white/70 mt-1 font-medium">Courses</p>
              </div>
              <div className="text-center">
                <div className="text-4xl font-black text-green-400">{stats.completedCourses}</div>
                <p className="text-sm text-white/70 mt-1 font-medium">Completed</p>
              </div>
              <div className="text-center">
                <div className="text-4xl font-black text-cyan-300">{stats.hoursLearned}h</div>
                <p className="text-sm text-white/70 mt-1 font-medium">Studied</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link to="/courses" className="bg-robitro-yellow text-gray-900 px-8 py-4 rounded-2xl font-bold text-lg shadow-2xl hover:scale-105 hover:shadow-yellow-400/30 transition-all duration-300">
                🎯 Explore New Courses
              </Link>
              <Link to="/shop" className="bg-white/20 backdrop-blur-sm text-white border-2 border-white/50 px-8 py-4 rounded-2xl font-bold text-lg hover:bg-white/30 transition-all duration-300">
                🛒 Shop Learning Kits
              </Link>
            </div>
          </div>
        </div>
      </section>
      {selectedCertCourse && (
        <CertificateModal
          course={selectedCertCourse}
          user={user}
          onClose={() => setSelectedCertCourse(null)}
        />
      )}
    </Layout>
  );
}
