import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { enrollmentService } from '../services/authService';
import Layout from '../components/Layout';

export default function MyCourses() {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all'); // all, ongoing, completed

  useEffect(() => {
    fetchMyCourses();
  }, []);

  useEffect(() => {
    applyFilter();
  }, [filter, courses]);

  const fetchMyCourses = async () => {
    try {
      setLoading(true);
      const response = await enrollmentService.getMyEnrolledCourses();
      setCourses(response.data.courses || []);
    } catch (err) {
      setError('Failed to load your courses: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  const applyFilter = () => {
    let filtered = courses;

    if (filter === 'ongoing') {
      filtered = courses.filter(c => c.progressPercentage < 100);
    } else if (filter === 'completed') {
      filtered = courses.filter(c => c.progressPercentage === 100);
    }

    setFilteredCourses(filtered);
  };

  const handleContinue = (courseId) => {
    navigate(`/lms/course/${courseId}/learn`);
  };

  const handleViewCertificate = (courseId) => {
    // TODO: Implement certificate view
    alert('Certificate view coming soon!');
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
    <Layout title="My Courses" subtitle="View and manage your enrolled courses">
      {/* Filter Tabs */}
      <div className="mb-8 flex gap-4 flex-wrap">
        <button
          onClick={() => setFilter('all')}
          className={`px-6 py-2 rounded-lg font-semibold transition-all ${
            filter === 'all'
              ? 'btn-primary'
              : 'bg-gray-100 text-dark hover:bg-gray-200'
          }`}
        >
          All Courses ({courses.length})
        </button>
        <button
          onClick={() => setFilter('ongoing')}
          className={`px-6 py-2 rounded-lg font-semibold transition-all ${
            filter === 'ongoing'
              ? 'btn-secondary'
              : 'bg-gray-100 text-dark hover:bg-gray-200'
          }`}
        >
          In Progress ({courses.filter(c => c.progressPercentage < 100).length})
        </button>
        <button
          onClick={() => setFilter('completed')}
          className={`px-6 py-2 rounded-lg font-semibold transition-all ${
            filter === 'completed'
              ? 'bg-green-500 text-white'
              : 'bg-gray-100 text-dark hover:bg-gray-200'
          }`}
        >
          Completed ({courses.filter(c => c.progressPercentage === 100).length})
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red/10 border-l-4 border-red text-red p-4 rounded-lg mb-8">
          <p className="font-semibold">{error}</p>
        </div>
      )}

      {/* Courses List */}
      {filteredCourses.length === 0 ? (
        <div className="card text-center py-16">
          <div className="text-6xl mb-4">📚</div>
          <h3 className="text-2xl font-bold text-dark mb-2">
            {courses.length === 0 ? 'No Courses Yet' : 'No Courses in This Category'}
          </h3>
          <p className="text-gray-600 mb-6">
            {courses.length === 0
              ? 'Start learning by exploring our course catalog'
              : 'Try selecting a different filter'}
          </p>
          {courses.length === 0 && (
            <button
              onClick={() => navigate('/courses')}
              className="btn-primary"
            >
              Browse Courses
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredCourses.map((course) => (
            <div
              key={course._id}
              className="card hover:shadow-lg transition-all"
            >
              <div className="grid md:grid-cols-12 gap-6 items-center">
                {/* Course Thumbnail */}
                <div className="md:col-span-2">
                  <div className="bg-gradient-to-r from-blue to-yellow h-24 rounded-lg flex items-center justify-center">
                    <div className="text-4xl">
                      {course.category === 'Robotics' && '🤖'}
                      {course.category === 'AI' && '🧠'}
                      {course.category === 'IoT' && '📡'}
                      {course.category === 'Electronics' && '⚡'}
                      {course.category === 'Coding' && '💻'}
                      {!['Robotics', 'AI', 'IoT', 'Electronics', 'Coding'].includes(course.category) && '📚'}
                    </div>
                  </div>
                </div>

                {/* Course Info */}
                <div className="md:col-span-5">
                  <h3 className="text-lg font-bold text-dark mb-1">
                    {course.title}
                  </h3>
                  <p className="text-sm text-gray-600 mb-2">
                    {course.description?.substring(0, 100)}...
                  </p>
                  <div className="flex gap-4 text-sm text-gray-500">
                    <span>📊 Level: {course.level || 'Beginner'}</span>
                    <span>👥 Age: {course.ageGroup || 'All'}</span>
                    <span>📖 {course.completedLessons?.length || 0} lessons</span>
                  </div>
                </div>

                {/* Progress */}
                <div className="md:col-span-3">
                  <div className="mb-2">
                    <div className="flex justify-between mb-1">
                      <p className="text-sm font-semibold text-dark">Progress</p>
                      <p className="text-sm font-bold text-blue">
                        {course.progressPercentage || 0}%
                      </p>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className="bg-gradient-to-r from-blue to-yellow h-3 rounded-full transition-all duration-300"
                        style={{ width: `${course.progressPercentage || 0}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Status */}
                  {course.progressPercentage === 100 ? (
                    <span className="inline-block bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                      ✓ Completed
                    </span>
                  ) : course.progressPercentage >= 50 ? (
                    <span className="inline-block bg-yellow text-dark text-xs font-bold px-3 py-1 rounded-full">
                      📖 In Progress
                    </span>
                  ) : (
                    <span className="inline-block bg-gray-300 text-dark text-xs font-bold px-3 py-1 rounded-full">
                      🎯 Just Started
                    </span>
                  )}
                </div>

                {/* Actions */}
                <div className="md:col-span-2 flex gap-2">
                  {course.progressPercentage < 100 ? (
                    <button
                      onClick={() => handleContinue(course._id)}
                      className="btn-primary w-full text-sm"
                    >
                      Continue
                    </button>
                  ) : (
                    <button
                      onClick={() => handleViewCertificate(course._id)}
                      className="btn-secondary w-full text-sm"
                    >
                      Certificate 🏆
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </Layout>
  );
}

