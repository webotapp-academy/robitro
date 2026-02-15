import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { enrollmentService } from '../services/authService';

export default function MyCourses({ user }) {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => { fetchMyCourses(); }, []);

  const fetchMyCourses = async () => {
    try {
      setLoading(true);
      const response = await enrollmentService.getMyEnrolledCourses();
      setCourses(response.data.courses || []);
    } catch (err) {
      setError('Failed to load your courses');
    } finally {
      setLoading(false);
    }
  };

  const filtered = courses.filter(c => {
    const matchFilter = filter === 'all' || (filter === 'ongoing' && c.progressPercentage < 100) || (filter === 'completed' && c.progressPercentage === 100);
    const matchSearch = !searchQuery || c.title?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchFilter && matchSearch;
  });

  const stats = {
    total: courses.length,
    ongoing: courses.filter(c => c.progressPercentage < 100).length,
    completed: courses.filter(c => c.progressPercentage === 100).length,
    avgProgress: courses.length ? Math.round(courses.reduce((a, c) => a + (c.progressPercentage || 0), 0) / courses.length) : 0,
  };

  const getCourseIcon = (category) => {
    const icons = { Robotics: '🤖', AI: '🧠', IoT: '📡', Electronics: '⚡', Coding: '💻', Python: '🐍' };
    return icons[category] || '📚';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-robitro-yellow border-t-robitro-blue mx-auto mb-6"></div>
          <p className="text-robitro-navy font-semibold text-lg">Loading your courses...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Header */}
      <section className="relative overflow-hidden py-12 lg:py-16">
        <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, #1e3a8a 0%, #2563eb 40%, #7c3aed 70%, #06b6d4 100%)' }}></div>
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-20 -right-20 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-yellow-400/20 rounded-full blur-3xl"></div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <p className="text-white/80 text-sm font-semibold mb-2">Welcome back, {user?.firstName || 'Student'} 👋</p>
              <h1 className="text-3xl md:text-4xl font-black text-white mb-2">My Learning Journey</h1>
              <p className="text-white/70">Track your progress and continue learning</p>
            </div>
            <div className="flex gap-4">
              <Link to="/courses" className="bg-white/20 backdrop-blur-sm text-white px-6 py-3 rounded-xl font-semibold hover:bg-white/30 transition-all">
                Browse Courses
              </Link>
              <Link to="/lms/dashboard" className="bg-robitro-yellow text-gray-900 px-6 py-3 rounded-xl font-bold hover:shadow-lg transition-all">
                Dashboard
              </Link>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
            {[
              { label: 'Total Courses', value: stats.total, icon: '📚', color: 'bg-white/20' },
              { label: 'In Progress', value: stats.ongoing, icon: '📖', color: 'bg-white/20' },
              { label: 'Completed', value: stats.completed, icon: '✅', color: 'bg-white/20' },
              { label: 'Avg Progress', value: `${stats.avgProgress}%`, icon: '📊', color: 'bg-white/20' },
            ].map((stat, i) => (
              <div key={i} className={`${stat.color} backdrop-blur-sm rounded-2xl p-4 text-center`}>
                <span className="text-2xl block mb-1">{stat.icon}</span>
                <p className="text-2xl font-black text-white">{stat.value}</p>
                <p className="text-white/70 text-xs font-semibold">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search & Filter Bar */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-8 flex flex-col sm:flex-row gap-4 items-center">
          {/* Search */}
          <div className="relative flex-1 w-full">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
            <input
              type="text"
              placeholder="Search your courses..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-robitro-blue/30 text-gray-900"
            />
          </div>
          {/* Filter Pills */}
          <div className="flex gap-2 flex-shrink-0">
            {[
              { key: 'all', label: 'All', count: stats.total },
              { key: 'ongoing', label: 'In Progress', count: stats.ongoing },
              { key: 'completed', label: 'Completed', count: stats.completed },
            ].map(f => (
              <button
                key={f.key}
                onClick={() => setFilter(f.key)}
                className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${filter === f.key
                  ? 'bg-robitro-blue text-white shadow-md'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
              >
                {f.label} ({f.count})
              </button>
            ))}
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-lg mb-8">
            <p className="font-semibold">{error}</p>
          </div>
        )}

        {/* Empty State */}
        {filtered.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 text-center py-20">
            <div className="text-7xl mb-6">
              {courses.length === 0 ? '🎯' : '🔍'}
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">
              {courses.length === 0 ? 'Start Your Learning Journey' : 'No Matching Courses'}
            </h3>
            <p className="text-gray-500 mb-8 max-w-md mx-auto">
              {courses.length === 0
                ? 'Explore our exciting courses in Robotics, AI, and more. Enroll today and start building the future!'
                : 'Try adjusting your search or filter criteria'}
            </p>
            {courses.length === 0 && (
              <Link to="/courses" className="inline-block bg-gradient-to-r from-robitro-blue to-robitro-teal text-white px-8 py-4 rounded-2xl font-bold text-lg hover:shadow-lg transition-all">
                🚀 Explore Courses
              </Link>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((course) => (
              <div key={course.id || course._id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
                {/* Course Thumbnail */}
                <div className="relative h-40 bg-gradient-to-br from-robitro-blue via-purple-600 to-robitro-teal flex items-center justify-center overflow-hidden">
                  {course.thumbnail ? (
                    <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  ) : (
                    <span className="text-6xl opacity-80 group-hover:scale-125 transition-transform duration-500">{getCourseIcon(course.category)}</span>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                  {/* Progress Badge */}
                  <div className="absolute top-3 right-3">
                    {course.progressPercentage === 100 ? (
                      <span className="bg-green-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">✅ Completed</span>
                    ) : course.progressPercentage >= 50 ? (
                      <span className="bg-robitro-yellow text-gray-900 text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">📖 In Progress</span>
                    ) : (
                      <span className="bg-white/90 text-gray-700 text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">🎯 Started</span>
                    )}
                  </div>
                  {/* Category Badge */}
                  <div className="absolute bottom-3 left-3">
                    <span className="bg-white/20 backdrop-blur-sm text-white text-xs font-semibold px-3 py-1 rounded-full">
                      {course.category || 'General'}
                    </span>
                  </div>
                </div>

                {/* Course Info */}
                <div className="p-5">
                  <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-robitro-blue transition-colors">{course.title}</h3>
                  <p className="text-sm text-gray-500 mb-4 line-clamp-2">{course.description?.substring(0, 120)}</p>

                  {/* Meta Info */}
                  <div className="flex items-center gap-3 text-xs text-gray-400 mb-4">
                    <span className="flex items-center gap-1">📊 {course.level || 'Beginner'}</span>
                    <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                    <span className="flex items-center gap-1">👥 {course.ageGroup || 'All Ages'}</span>
                    {course.completedLessons && (
                      <>
                        <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                        <span className="flex items-center gap-1">📝 {course.completedLessons.length} lessons done</span>
                      </>
                    )}
                  </div>

                  {/* Progress Bar */}
                  <div className="mb-4">
                    <div className="flex justify-between text-xs mb-1.5">
                      <span className="font-semibold text-gray-600">Progress</span>
                      <span className="font-bold text-robitro-blue">{course.progressPercentage || 0}%</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
                      <div
                        className="h-2.5 rounded-full transition-all duration-500"
                        style={{
                          width: `${course.progressPercentage || 0}%`,
                          background: course.progressPercentage === 100
                            ? 'linear-gradient(90deg, #22c55e, #16a34a)'
                            : 'linear-gradient(90deg, #2563eb, #7c3aed)'
                        }}
                      ></div>
                    </div>
                  </div>

                  {/* Action Button */}
                  <button
                    onClick={() => navigate(`/lms/course/${course.id || course._id}/learn`)}
                    className={`w-full py-3 rounded-xl font-bold text-sm transition-all ${course.progressPercentage === 100
                      ? 'bg-green-50 text-green-700 hover:bg-green-100 border border-green-200'
                      : 'bg-gradient-to-r from-robitro-blue to-robitro-teal text-white hover:shadow-lg hover:shadow-blue-200'
                      }`}
                  >
                    {course.progressPercentage === 100 ? '🏆 View Certificate' : course.progressPercentage > 0 ? '▶️ Continue Learning' : '🚀 Start Course'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
