import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { enrollmentService, courseService } from '../services/authService';
import Layout from '../components/Layout';

export default function Dashboard() {
  const navigate = useNavigate();
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
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

  const fetchEnrolledCourses = async () => {
    try {
      setLoading(true);
      const response = await enrollmentService.getMyEnrolledCourses();
      const courses = response.data.courses || [];
      
      setEnrolledCourses(courses);

      // Calculate stats
      const completed = courses.filter(c => c.progressPercentage === 100).length;
      const avgProgress = courses.length > 0
        ? Math.round(courses.reduce((sum, c) => sum + c.progressPercentage, 0) / courses.length)
        : 0;

      setStats({
        totalCourses: courses.length,
        completedCourses: completed,
        averageProgress: avgProgress,
        hoursLearned: courses.length * 10, // Placeholder calculation
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

  const handleRefresh = () => {
    fetchEnrolledCourses();
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-yellow border-t-blue mx-auto mb-4"></div>
            <p className="text-dark font-semibold">Loading your courses...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Welcome Section */}
      <div className="mb-12">
        <div className="gradient-bg text-white p-8 rounded-xl">
          <h1 className="text-4xl font-bold mb-2">Welcome back, {user.firstName}! 👋</h1>
          <p className="text-lg opacity-90">
            Continue your learning journey and master next-gen technologies
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid md:grid-cols-4 gap-6 mb-12">
        <div className="card bg-gradient-to-br from-blue/10 to-blue/5 border-l-4 border-blue">
          <div className="text-3xl font-bold text-blue mb-2">{stats.totalCourses}</div>
          <p className="text-gray-600 font-semibold">Enrolled Courses</p>
          <p className="text-sm text-gray-500 mt-1">Continue learning</p>
        </div>

        <div className="card bg-gradient-to-br from-yellow/10 to-yellow/5 border-l-4 border-yellow">
          <div className="text-3xl font-bold text-yellow mb-2">{stats.completedCourses}</div>
          <p className="text-gray-600 font-semibold">Completed</p>
          <p className="text-sm text-gray-500 mt-1">Great job!</p>
        </div>

        <div className="card bg-gradient-to-br from-red/10 to-red/5 border-l-4 border-red">
          <div className="text-3xl font-bold text-red mb-2">{stats.averageProgress}%</div>
          <p className="text-gray-600 font-semibold">Average Progress</p>
          <p className="text-sm text-gray-500 mt-1">Overall performance</p>
        </div>

        <div className="card bg-gradient-to-br from-green-500/10 to-green-500/5 border-l-4 border-green-500">
          <div className="text-3xl font-bold text-green-600 mb-2">{stats.hoursLearned}h</div>
          <p className="text-gray-600 font-semibold">Hours Learned</p>
          <p className="text-sm text-gray-500 mt-1">Total study time</p>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red/10 border-l-4 border-red text-red p-4 rounded-lg mb-8">
          <p className="font-semibold">{error}</p>
          <button
            onClick={handleRefresh}
            className="text-sm text-red underline hover:no-underline mt-2"
          >
            Try again
          </button>
        </div>
      )}

      {/* Enrolled Courses Section */}
      <div className="mb-12">
        <div className="flex justify-between items-center mb-8">
          <h2 className="section-title">Your Courses</h2>
          <button
            onClick={handleRefresh}
            className="btn-outline text-sm"
          >
            ↻ Refresh
          </button>
        </div>

        {enrolledCourses.length === 0 ? (
          <div className="card text-center py-16">
            <div className="text-6xl mb-4">📚</div>
            <h3 className="text-2xl font-bold text-dark mb-2">No Courses Yet</h3>
            <p className="text-gray-600 mb-6">
              Start learning by exploring our course catalog
            </p>
            <button
              onClick={() => navigate('/courses')}
              className="btn-primary"
            >
              Browse Courses
            </button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {enrolledCourses.map((course) => (
              <div key={course._id} className="card hover:shadow-xl transition-all">
                {/* Course Thumbnail */}
                <div className="bg-gradient-to-r from-blue to-yellow h-40 rounded-lg mb-4 flex items-center justify-center">
                  <div className="text-5xl">
                    {course.category === 'Robotics' && '🤖'}
                    {course.category === 'AI' && '🧠'}
                    {course.category === 'IoT' && '📡'}
                    {course.category === 'Electronics' && '⚡'}
                    {course.category === 'Coding' && '💻'}
                    {!['Robotics', 'AI', 'IoT', 'Electronics', 'Coding'].includes(course.category) && '📚'}
                  </div>
                </div>

                {/* Course Title */}
                <h3 className="text-lg font-bold text-dark mb-2 line-clamp-2">
                  {course.title}
                </h3>

                {/* Course Info */}
                <p className="text-sm text-gray-600 mb-1">
                  <span className="font-semibold">Level:</span> {course.level || 'Beginner'}
                </p>
                <p className="text-sm text-gray-600 mb-4">
                  <span className="font-semibold">Age Group:</span> {course.ageGroup || 'All'}
                </p>

                {/* Progress */}
                <div className="mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <p className="text-sm font-semibold text-dark">Progress</p>
                    <p className="text-sm font-bold text-blue">{course.progressPercentage || 0}%</p>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-blue to-yellow h-2 rounded-full transition-all duration-300"
                      style={{ width: `${course.progressPercentage || 0}%` }}
                    ></div>
                  </div>
                </div>

                {/* Status Badge */}
                <div className="flex items-center justify-between mb-4">
                  {course.progressPercentage === 100 ? (
                    <span className="bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                      ✓ Completed
                    </span>
                  ) : course.progressPercentage >= 50 ? (
                    <span className="bg-yellow text-dark text-xs font-bold px-3 py-1 rounded-full">
                      📖 In Progress
                    </span>
                  ) : (
                    <span className="bg-gray-300 text-dark text-xs font-bold px-3 py-1 rounded-full">
                      🎯 Just Started
                    </span>
                  )}

                  {/* Lesson Count */}
                  <p className="text-xs text-gray-500">
                    {course.completedLessons?.length || 0} lessons completed
                  </p>
                </div>

                {/* Continue Button */}
                {course.progressPercentage < 100 && (
                  <button
                    onClick={() => handleContinueLearning(course._id)}
                    className="btn-primary w-full"
                  >
                    Continue Learning →
                  </button>
                )}

                {course.progressPercentage === 100 && (
                  <button
                    onClick={() => navigate(`/courses/${course._id}`)}
                    className="btn-outline w-full"
                  >
                    View Certificate 🏆
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quick Actions Section */}
      {enrolledCourses.length > 0 && (
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          {/* Continue Latest */}
          {enrolledCourses.some(c => c.progressPercentage < 100) && (
            <div className="card bg-gradient-to-br from-blue/5 to-yellow/5">
              <h3 className="text-lg font-bold text-dark mb-2">📖 Continue Learning</h3>
              <p className="text-sm text-gray-600 mb-4">
                Pick up where you left off
              </p>
              <button
                onClick={() => {
                  const inProgress = enrolledCourses.find(c => c.progressPercentage < 100);
                  if (inProgress) handleContinueLearning(inProgress._id);
                }}
                className="btn-primary w-full"
              >
                Resume Course
              </button>
            </div>
          )}

          {/* Browse More Courses */}
          <div className="card bg-gradient-to-br from-green-500/5 to-blue/5">
            <h3 className="text-lg font-bold text-dark mb-2">🎓 Explore More</h3>
            <p className="text-sm text-gray-600 mb-4">
              Discover new skills and advance your learning
            </p>
            <button
              onClick={() => navigate('/courses')}
              className="btn-secondary w-full"
            >
              Browse Courses
            </button>
          </div>
        </div>
      )}

      {/* Learning Streak Section */}
      <div className="card bg-gradient-to-r from-yellow/10 via-blue/10 to-red/10">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-dark mb-1">🔥 Keep the Momentum</h3>
            <p className="text-gray-600">
              Stay consistent with your learning to build expertise
            </p>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-blue">12</div>
            <p className="text-sm text-gray-600">Day Streak</p>
          </div>
        </div>
      </div>
    </Layout>
  );
}
