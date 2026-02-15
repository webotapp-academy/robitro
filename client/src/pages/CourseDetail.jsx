import { useEffect, useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import Swal from 'sweetalert2';

export default function CourseDetail() {
  const { id } = useParams();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showEnrollModal, setShowEnrollModal] = useState(false);
  const [showCallbackModal, setShowCallbackModal] = useState(false);
  const [enrollData, setEnrollData] = useState({ name: '', email: '', phone: '' });
  const [callbackData, setCallbackData] = useState({ name: '', phone: '', preferredTime: '' });

  // Refs for scrolling to sections
  const overviewRef = useRef(null);
  const curriculumRef = useRef(null);
  const instructorRef = useRef(null);
  const reviewsRef = useRef(null);

  const [course, setCourse] = useState(null);
  const [courses, setCourses] = useState([]); // For related courses
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        setLoading(true);
        // Fetch specific course
        const response = await api.get(`/courses/${id}`);
        if (response.data.success) {
          const rawCourse = response.data.course;
          // Map DB format to UI format
          const mappedCourse = {
            ...rawCourse,
            ...rawCourse.metadata,
            longDescription: rawCourse.description, // Use description as longDescription if not separate
            icon: rawCourse.metadata?.icon || '🎓',
            color: rawCourse.metadata?.color || 'from-blue-500 to-indigo-600',
            duration: rawCourse.metadata?.duration || '8 weeks',
            sessions: rawCourse.metadata?.sessions || 16,
            students: rawCourse.enrollmentCount || 0,
            projects: rawCourse.metadata?.projects || 5,
            level: rawCourse.level.charAt(0).toUpperCase() + rawCourse.level.slice(1),
            features: rawCourse.metadata?.features || ['Live Classes', 'Certificate', 'Expert Mentors'],
            instructor: {
              name: `${rawCourse.instructor?.firstName} ${rawCourse.instructor?.lastName}` || 'Expert Instructor',
              title: 'Senior Educator',
              avatar: rawCourse.instructor?.avatar || '👨‍🏫',
              bio: rawCourse.instructor?.bio || 'Experienced educator passionate about technology.',
              students: 5000,
              courses: 10,
              rating: 4.8
            },
            // Map modules to curriculum
            curriculum: rawCourse.modules?.map(mod => ({
              week: mod.order,
              title: mod.title,
              duration: `${mod.lessons?.reduce((acc, l) => acc + (l.duration || 0), 0)} mins` || '2 hours',
              topics: mod.lessons?.map(l => l.title) || []
            })) || [],
            whatYouWillLearn: rawCourse.metadata?.whatYouWillLearn || [
              'Master core concepts and principles',
              'Build real-world hands-on projects',
              'Collaborate with peers on challenges',
              'Get certified upon completion'
            ],
            reviewsList: [
              { name: 'Parent of Alex', rating: 5, date: '1 week ago', text: 'Amazing course! My child learned so much.' },
              { name: 'Parent of Sam', rating: 5, date: '2 weeks ago', text: 'Highly recommended for young tech enthusiasts.' }
            ],
            reviews: 120, // Static for now
            originalPrice: rawCourse.price + (rawCourse.metadata?.discountValue || 30)
          };
          setCourse(mappedCourse);
        }

        // Fetch all courses for related section
        const coursesResponse = await api.get('/courses');
        if (coursesResponse.data.success) {
          setCourses(coursesResponse.data.courses.map(c => ({
            ...c,
            ...c.metadata,
            color: c.metadata?.color || 'from-blue-500 to-indigo-600',
            icon: c.metadata?.icon || '🎓'
          })));
        }
      } catch (err) {
        console.error('Error fetching course:', err);
        setError('Failed to load course details');
      } finally {
        setLoading(false);
      }
    };

    fetchCourseData();
  }, [id]);

  // Auto-slide for image slider
  useEffect(() => {
    if (!course) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % 3);
    }, 4000);
    return () => clearInterval(interval);
  }, [course]);

  // Scroll reveal effect
  useEffect(() => {
    if (loading || !course) return;
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
  }, [loading, course]);

  const scrollToSection = (ref) => {
    ref.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleEnrollSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/enquiry/lead', {
        ...enrollData,
        courseId: id,
        type: 'enrollment'
      });
      if (response.data.success) {
        Swal.fire({
          title: 'Enrollment Successful!',
          text: 'Thank you for enrolling! Our team will contact you shortly with next steps.',
          icon: 'success',
          confirmButtonColor: '#F59E0B'
        });
        setShowEnrollModal(false);
        setEnrollData({ name: '', email: '', phone: '' });
      }
    } catch (err) {
      console.error('Enrollment error:', err);
      Swal.fire({
        title: 'Error!',
        text: 'Failed to submit enrollment. Please try again or contact support.',
        icon: 'error',
        confirmButtonColor: '#EF4444'
      });
    }
  };

  const handleCallbackSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/enquiry/callback', {
        ...callbackData,
        courseId: id
      });
      if (response.data.success) {
        Swal.fire({
          title: 'Request Sent!',
          text: 'Thank you! Our team will call you back shortly.',
          icon: 'success',
          confirmButtonColor: '#F59E0B'
        });
        setShowCallbackModal(false);
        setCallbackData({ name: '', phone: '', preferredTime: '' });
      }
    } catch (err) {
      console.error('Callback error:', err);
      Swal.fire({
        title: 'Error!',
        text: 'Failed to submit callback request. Please try again.',
        icon: 'error',
        confirmButtonColor: '#EF4444'
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-robitro-yellow border-t-robitro-blue mx-auto mb-6"></div>
          <p className="text-robitro-navy font-semibold text-lg">Loading Course Details...</p>
        </div>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-8xl mb-6">🔍</div>
          <h1 className="text-3xl font-bold text-robitro-navy mb-4">{error || 'Course Not Found'}</h1>
          <p className="text-gray-600 mb-8">The course you're looking for doesn't exist or failed to load.</p>
          <Link to="/courses" className="btn-primary">Browse All Courses</Link>
        </div>
      </div>
    );
  }

  // Fallback images for slider
  // Handle images - use thumbnail from DB or fallback to gradient
  const sliderImages = course.images || (course.thumbnail ? [course.thumbnail, course.thumbnail, course.thumbnail] : null);

  return (
    <div className="w-full bg-white">
      {/* Enroll Modal */}
      {showEnrollModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 relative">
            <button onClick={() => setShowEnrollModal(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl">×</button>
            <h3 className="text-2xl font-bold text-robitro-navy mb-2">Enroll in {course.title}</h3>
            <p className="text-gray-600 mb-6">Fill in your details to get started</p>
            <form onSubmit={handleEnrollSubmit} className="space-y-4">
              <input type="text" required placeholder="Your Name" value={enrollData.name} onChange={(e) => setEnrollData({ ...enrollData, name: e.target.value })} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-robitro-blue text-gray-900" />
              <input type="email" required placeholder="Email Address" value={enrollData.email} onChange={(e) => setEnrollData({ ...enrollData, email: e.target.value })} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-robitro-blue text-gray-900" />
              <input type="tel" required placeholder="Phone Number" value={enrollData.phone} onChange={(e) => setEnrollData({ ...enrollData, phone: e.target.value })} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-robitro-blue text-gray-900" />
              <button type="submit" className="w-full py-4 bg-robitro-yellow text-gray-900 rounded-xl font-bold text-lg hover:shadow-lg transition-all">🎓 Enroll Now - £{course.price}</button>
            </form>
          </div>
        </div>
      )}

      {/* Callback Modal */}
      {showCallbackModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 relative">
            <button onClick={() => setShowCallbackModal(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl">×</button>
            <h3 className="text-2xl font-bold text-robitro-navy mb-2">Request a Callback</h3>
            <p className="text-gray-600 mb-6">Our experts will call you to discuss this course and answer your questions.</p>
            <form onSubmit={handleCallbackSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Your Name</label>
                <input type="text" required placeholder="Enter your name" value={callbackData.name} onChange={(e) => setCallbackData({ ...callbackData, name: e.target.value })} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-robitro-blue text-gray-900" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Phone Number</label>
                <input type="tel" required placeholder="+44 7XXX XXXXXX" value={callbackData.phone} onChange={(e) => setCallbackData({ ...callbackData, phone: e.target.value })} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-robitro-blue text-gray-900" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Preferred Time</label>
                <select value={callbackData.preferredTime} onChange={(e) => setCallbackData({ ...callbackData, preferredTime: e.target.value })} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-robitro-blue text-gray-900">
                  <option value="">Select a time</option>
                  <option value="morning">Morning (9am - 12pm)</option>
                  <option value="afternoon">Afternoon (12pm - 5pm)</option>
                  <option value="evening">Evening (5pm - 8pm)</option>
                </select>
              </div>
              <button type="submit" className="w-full py-4 bg-robitro-yellow text-gray-900 rounded-xl font-bold text-lg hover:shadow-lg transition-all">📞 Request Callback</button>
            </form>
          </div>
        </div>
      )}

      {/* ==================== HERO SECTION ==================== */}
      <section className="relative overflow-hidden py-16 lg:py-24">
        {/* Background */}
        <div className="absolute inset-0">
          <div className={`absolute inset-0 bg-gradient-to-br ${course.color}`}></div>
          <div className="absolute inset-0" style={{
            background: 'linear-gradient(135deg, rgba(37, 99, 235, 0.9) 0%, rgba(30, 58, 138, 0.9) 40%, rgba(124, 58, 237, 0.85) 70%, rgba(6, 182, 212, 0.85) 100%)'
          }}></div>
        </div>

        {/* Floating Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-10 left-10 text-7xl opacity-20 animate-bounce" style={{ animationDuration: '3s' }}>{course.icon}</div>
          <div className="absolute bottom-10 right-10 text-6xl opacity-15 animate-bounce" style={{ animationDuration: '4s' }}>✨</div>
          <div className="absolute -top-20 -right-20 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-yellow-400/20 rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="scroll-reveal">
              {/* Breadcrumb - More Visible */}
              <div className="flex items-center gap-2 mb-6">
                <Link to="/courses" className="text-white font-semibold hover:text-robitro-yellow transition-colors flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  Courses
                </Link>
                <span className="text-white/60">/</span>
                <span className="text-robitro-yellow font-semibold">{course.category}</span>
              </div>

              {/* Badges */}
              <div className="flex flex-wrap gap-3 mb-6">
                <span className="px-4 py-2 bg-white/20 backdrop-blur-sm text-white text-sm font-bold rounded-full">{course.level}</span>
                <span className="px-4 py-2 bg-robitro-yellow text-gray-900 text-sm font-bold rounded-full">{course.ageGroup}</span>
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-6 drop-shadow-lg">{course.title}</h1>
              <p className="text-xl text-white/90 mb-8">{course.description}</p>

              {/* Stats */}
              <div className="flex flex-wrap gap-6 mb-8">
                <div className="flex items-center gap-2 text-white">
                  <span className="text-robitro-yellow text-xl">★</span>
                  <span className="font-bold">{course.rating}</span>
                  <span className="text-white/70">({course.reviews} reviews)</span>
                </div>
                <div className="flex items-center gap-2 text-white">
                  <span>👥</span>
                  <span>{course.students.toLocaleString()} students</span>
                </div>
                <div className="flex items-center gap-2 text-white">
                  <span>📅</span>
                  <span>{course.duration}</span>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <button onClick={() => setShowEnrollModal(true)} className="bg-robitro-yellow text-gray-900 px-8 py-4 rounded-2xl font-bold text-lg shadow-2xl hover:scale-105 hover:shadow-yellow-400/30 transition-all duration-300">
                  🎓 Enroll Now - £{course.price}
                </button>
                <button onClick={() => setShowCallbackModal(true)} className="bg-white/20 backdrop-blur-sm text-white border-2 border-white/50 px-8 py-4 rounded-2xl font-bold text-lg hover:bg-white/30 transition-all duration-300">
                  📞 Get a Callback
                </button>
              </div>
            </div>

            {/* Right - Image Slider (Homepage Style) */}
            <div className="scroll-reveal hidden lg:block">
              <div className="relative w-full h-96 rounded-3xl overflow-hidden shadow-2xl">
                {/* Slide Images */}
                {sliderImages.map((img, idx) => (
                  <div
                    key={idx}
                    className={`absolute inset-0 transition-all duration-700 ease-in-out ${currentSlide === idx ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
                      }`}
                  >
                    {/* Actual image with gradient background */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${course.color}`}></div>
                    {sliderImages ? (
                      <img
                        src={img}
                        alt={`${course.title} - ${idx + 1}`}
                        className="w-full h-full object-cover relative z-10"
                        onError={(e) => {
                          e.target.style.display = 'none';
                        }}
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center z-10">
                        <span className="text-9xl opacity-30">{course.icon}</span>
                      </div>
                    )}
                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-robitro-navy/80 via-transparent to-transparent z-20" />

                    {/* Slide caption */}
                    <div className={`absolute bottom-8 left-8 right-8 text-white transition-all duration-500 z-30 ${currentSlide === idx ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
                      }`}>
                      <h3 className="text-2xl font-bold mb-1">{course.title}</h3>
                      <p className="text-gray-200">{course.features[idx] || course.category}</p>
                    </div>
                  </div>
                ))}

                {/* Navigation dots */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-40">
                  {[0, 1, 2].map((idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentSlide(idx)}
                      className={`w-3 h-3 rounded-full transition-all duration-300 ${currentSlide === idx
                        ? 'bg-robitro-yellow w-8'
                        : 'bg-white/50 hover:bg-white/80'
                        }`}
                    />
                  ))}
                </div>

                {/* Navigation arrows - Same as homepage */}
                <button
                  onClick={() => setCurrentSlide((prev) => (prev - 1 + 3) % 3)}
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/40 transition-all z-40"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button
                  onClick={() => setCurrentSlide((prev) => (prev + 1) % 3)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/40 transition-all z-40"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== NAVIGATION TABS ==================== */}
      <section className="w-full bg-white border-b border-gray-100 sticky top-20 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-8 overflow-x-auto">
            <button onClick={() => scrollToSection(overviewRef)} className="py-4 px-2 font-semibold border-b-2 border-transparent hover:border-robitro-blue hover:text-robitro-blue text-gray-600 transition-all whitespace-nowrap">
              Overview
            </button>
            <button onClick={() => scrollToSection(curriculumRef)} className="py-4 px-2 font-semibold border-b-2 border-transparent hover:border-robitro-blue hover:text-robitro-blue text-gray-600 transition-all whitespace-nowrap">
              Curriculum
            </button>
            <button onClick={() => scrollToSection(instructorRef)} className="py-4 px-2 font-semibold border-b-2 border-transparent hover:border-robitro-blue hover:text-robitro-blue text-gray-600 transition-all whitespace-nowrap">
              Instructor
            </button>
            <button onClick={() => scrollToSection(reviewsRef)} className="py-4 px-2 font-semibold border-b-2 border-transparent hover:border-robitro-blue hover:text-robitro-blue text-gray-600 transition-all whitespace-nowrap">
              Reviews
            </button>
          </div>
        </div>
      </section>

      {/* ==================== CONTENT SECTIONS ==================== */}
      <section className="w-full mesh-gradient py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-12">
              {/* OVERVIEW SECTION */}
              <div ref={overviewRef} className="scroll-reveal scroll-mt-32">
                <div className="bg-white rounded-2xl p-8 shadow-lg mb-8">
                  <h2 className="text-2xl font-bold text-robitro-navy mb-4">About This Course</h2>
                  <div className="text-gray-600 whitespace-pre-line leading-relaxed">{course.longDescription}</div>
                </div>

                <div className="bg-white rounded-2xl p-8 shadow-lg">
                  <h2 className="text-2xl font-bold text-robitro-navy mb-6">What You'll Learn</h2>
                  <div className="grid md:grid-cols-2 gap-4">
                    {course.whatYouWillLearn.map((item, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <svg className="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                        </svg>
                        <span className="text-gray-700">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* CURRICULUM SECTION */}
              <div ref={curriculumRef} className="bg-white rounded-2xl p-8 shadow-lg scroll-reveal scroll-mt-32">
                <h2 className="text-2xl font-bold text-robitro-navy mb-2">Course Curriculum</h2>
                <p className="text-gray-600 mb-8">{course.sessions} sessions over {course.duration}</p>

                <div className="space-y-4">
                  {course.curriculum && course.curriculum.length > 0 ? (
                    course.curriculum.map((week, i) => (
                      <div key={i} className="border border-gray-200 rounded-xl overflow-hidden">
                        <div className="bg-gray-50 px-6 py-4 flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <span className="w-10 h-10 bg-robitro-blue text-white rounded-full flex items-center justify-center font-bold">
                              {week.week}
                            </span>
                            <div>
                              <h3 className="font-bold text-robitro-navy">{week.title}</h3>
                              <p className="text-sm text-gray-500">{week.duration}</p>
                            </div>
                          </div>
                        </div>
                        <div className="px-6 py-4">
                          <ul className="space-y-2">
                            {week.topics.map((topic, j) => (
                              <li key={j} className="flex items-center gap-3 text-gray-600">
                                <span className="w-2 h-2 bg-robitro-teal rounded-full"></span>
                                {topic}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-12 bg-gray-50 rounded-xl">
                      <div className="text-6xl mb-4">📚</div>
                      <h3 className="text-xl font-bold text-robitro-navy mb-2">Curriculum Coming Soon</h3>
                      <p className="text-gray-600 max-w-md mx-auto">
                        The detailed curriculum for this course is being prepared. Contact us to learn more about what you'll study!
                      </p>
                      <button
                        onClick={() => setShowCallbackModal(true)}
                        className="mt-6 px-6 py-3 bg-robitro-yellow text-gray-900 rounded-xl font-bold hover:shadow-lg transition-all"
                      >
                        📞 Get Course Details
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* INSTRUCTOR SECTION */}
              <div ref={instructorRef} className="bg-white rounded-2xl p-8 shadow-lg scroll-reveal scroll-mt-32">
                <h2 className="text-2xl font-bold text-robitro-navy mb-6">Your Instructor</h2>

                <div className="flex flex-col md:flex-row items-start gap-6">
                  <div className="w-32 h-32 bg-gradient-to-br from-robitro-yellow to-orange-400 rounded-2xl flex items-center justify-center text-6xl flex-shrink-0">
                    {course.instructor.avatar}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-robitro-navy">{course.instructor.name}</h3>
                    <p className="text-robitro-blue font-semibold mb-4">{course.instructor.title}</p>
                    <p className="text-gray-600 mb-6 leading-relaxed">{course.instructor.bio}</p>
                    <div className="flex flex-wrap items-center gap-6 text-sm">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">👥</span>
                        <div>
                          <div className="font-bold text-robitro-navy">{course.instructor.students.toLocaleString()}</div>
                          <div className="text-gray-500">Students</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">📚</span>
                        <div>
                          <div className="font-bold text-robitro-navy">{course.instructor.courses}</div>
                          <div className="text-gray-500">Courses</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">⭐</span>
                        <div>
                          <div className="font-bold text-robitro-navy">{course.instructor.rating}</div>
                          <div className="text-gray-500">Rating</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* REVIEWS SECTION */}
              <div ref={reviewsRef} className="bg-white rounded-2xl p-8 shadow-lg scroll-reveal scroll-mt-32">
                <h2 className="text-2xl font-bold text-robitro-navy mb-6">Student Reviews</h2>

                {/* Rating Summary */}
                <div className="flex flex-col md:flex-row items-center gap-8 mb-8 pb-8 border-b border-gray-200">
                  <div className="text-center">
                    <div className="text-6xl font-black text-robitro-navy">{course.rating}</div>
                    <div className="flex gap-1 text-robitro-yellow text-2xl my-2">
                      {[...Array(5)].map((_, i) => <span key={i}>★</span>)}
                    </div>
                    <div className="text-gray-500">{course.reviews} reviews</div>
                  </div>
                  <div className="flex-1 space-y-2">
                    {[5, 4, 3, 2, 1].map((stars) => (
                      <div key={stars} className="flex items-center gap-3">
                        <span className="text-sm w-8">{stars} ★</span>
                        <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-robitro-yellow rounded-full"
                            style={{ width: stars === 5 ? '75%' : stars === 4 ? '20%' : '5%' }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Individual Reviews */}
                <div className="space-y-6">
                  {course.reviewsList.map((review, i) => (
                    <div key={i} className="pb-6 border-b border-gray-100 last:border-0">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-robitro-blue to-robitro-teal rounded-full flex items-center justify-center font-bold text-white text-lg">
                          {review.name.split(' ').pop().charAt(0)}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-1">
                            <p className="font-bold text-robitro-navy">{review.name}</p>
                            <span className="text-gray-400 text-sm">{review.date}</span>
                          </div>
                          <div className="flex gap-0.5 text-robitro-yellow mb-2">
                            {[...Array(review.rating)].map((_, i) => <span key={i}>★</span>)}
                          </div>
                          <p className="text-gray-600 leading-relaxed">{review.text}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="hidden lg:block">
              <div className="bg-white rounded-2xl p-6 shadow-lg sticky top-36">
                <h3 className="font-bold text-robitro-navy mb-4">This course includes:</h3>
                <div className="space-y-3 mb-6">
                  {course.features.map((feature, i) => (
                    <div key={i} className="flex items-center gap-3 text-gray-600">
                      <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                      </svg>
                      {feature}
                    </div>
                  ))}
                </div>

                <div className="border-t border-gray-200 pt-6 mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-3xl font-black text-robitro-navy">£{course.price}</span>
                    {course.originalPrice > course.price && (
                      <span className="text-lg text-gray-400 line-through">£{course.originalPrice}</span>
                    )}
                  </div>
                </div>

                <button onClick={() => setShowEnrollModal(true)} className="w-full py-4 bg-robitro-yellow text-gray-900 rounded-xl font-bold text-lg hover:shadow-lg transition-all mb-3">
                  Enroll Now - £{course.price}
                </button>
                <button onClick={() => setShowCallbackModal(true)} className="w-full py-3 border-2 border-robitro-blue text-robitro-blue rounded-xl font-bold hover:bg-robitro-blue hover:text-white transition-all">
                  📞 Get a Callback
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mobile Bottom Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 z-50">
        <div className="flex items-center justify-between gap-4">
          <div>
            <span className="text-2xl font-black text-robitro-navy">£{course.price}</span>
            {course.originalPrice > course.price && (
              <span className="text-sm text-gray-400 line-through ml-2">£{course.originalPrice}</span>
            )}
          </div>
          <button onClick={() => setShowEnrollModal(true)} className="bg-robitro-yellow text-gray-900 px-6 py-3 rounded-xl font-bold hover:shadow-lg transition-all">
            Enroll Now
          </button>
        </div>
      </div>

      {/* ==================== RELATED COURSES ==================== */}
      <section className="w-full bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-robitro-navy mb-8">Related Courses</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {courses.filter(c => c.category === course.category && c.id !== course.id).slice(0, 3).map((relatedCourse) => (
              <Link
                key={relatedCourse.id}
                to={`/courses/${relatedCourse.id}`}
                className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all border border-gray-100"
              >
                <div className={`h-32 bg-gradient-to-br ${relatedCourse.color} flex items-center justify-center`}>
                  <span className="text-5xl group-hover:scale-110 transition-transform">{relatedCourse.icon}</span>
                </div>
                <div className="p-6">
                  <h3 className="font-bold text-robitro-navy mb-2 group-hover:text-robitro-blue transition-colors">{relatedCourse.title}</h3>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-robitro-navy">£{relatedCourse.price}</span>
                    <span className="text-robitro-yellow">★ {relatedCourse.rating}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== CTA SECTION ==================== */}
      <section className="w-full py-16 relative overflow-hidden" style={{
        background: 'linear-gradient(135deg, #2563EB 0%, #1E3A8A 30%, #7C3AED 60%, #06B6D4 100%)'
      }}>
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-10 left-10 text-5xl opacity-20 animate-bounce" style={{ animationDuration: '3s' }}>🎓</div>
          <div className="absolute bottom-10 right-10 text-5xl opacity-15 animate-bounce" style={{ animationDuration: '4s' }}>🚀</div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h2 className="text-3xl md:text-4xl font-black text-white mb-6">
            Ready to Start {course.title}?
          </h2>
          <p className="text-xl text-white/90 mb-8">
            Join {course.students.toLocaleString()} students already learning with us!
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button onClick={() => setShowEnrollModal(true)} className="bg-robitro-yellow text-gray-900 px-10 py-5 rounded-2xl font-bold text-xl shadow-2xl hover:scale-105 transition-all">
              🎓 Enroll Now - £{course.price}
            </button>
            <button onClick={() => setShowCallbackModal(true)} className="bg-white/20 backdrop-blur-sm text-white border-2 border-white/50 px-10 py-5 rounded-2xl font-bold text-xl hover:bg-white/30 transition-all">
              📞 Get a Callback
            </button>
          </div>
        </div>
      </section>

      {/* Bottom padding for mobile */}
      <div className="lg:hidden h-24"></div>
    </div>
  );
}
