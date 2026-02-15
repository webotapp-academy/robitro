import api from './api';

/**
 * Authentication Service
 * Handles all authentication-related API calls
 */

export const authService = {
  /**
   * Student Signup
   * POST /api/auth/student-signup
   */
  studentSignup: async (formData) => {
    return api.post('/auth/student-signup', formData);
  },

  /**
   * Partner Signup
   * POST /api/auth/partner-signup
   */
  partnerSignup: async (formData) => {
    return api.post('/auth/partner-signup', formData);
  },

  /**
   * Login
   * POST /api/auth/login
   */
  login: async (email, password) => {
    return api.post('/auth/login', { email, password });
  },

  /**
   * Get User Profile
   * GET /api/auth/profile
   * Requires: JWT token
   */
  getProfile: async () => {
    return api.get('/auth/profile');
  },

  /**
   * Verify Email
   * POST /api/auth/verify-email
   * Requires: JWT token
   */
  verifyEmail: async (token) => {
    return api.post('/auth/verify-email', { token });
  },

  /**
   * Change Password
   * POST /api/auth/change-password
   * Requires: JWT token
   */
  changePassword: async (currentPassword, newPassword) => {
    return api.post('/auth/change-password', { currentPassword, newPassword });
  },

  /**
   * Logout
   * POST /api/auth/logout
   * Requires: JWT token
   */
  logout: async () => {
    return api.post('/auth/logout');
  },
};

/**
 * Course Service
 * Handles all course-related API calls
 */

export const courseService = {
  /**
   * Get All Courses
   * GET /api/courses
   * Query params: search, category, level, ageGroup, limit, skip
   */
  getAllCourses: async (filters = {}) => {
    const params = new URLSearchParams();
    Object.keys(filters).forEach(key => {
      if (filters[key]) params.append(key, filters[key]);
    });
    return api.get(`/courses?${params.toString()}`);
  },

  /**
   * Get Course by ID
   * GET /api/courses/:id
   */
  getCourse: async (courseId) => {
    return api.get(`/courses/${courseId}`);
  },

  /**
   * Create Course
   * POST /api/courses
   * Requires: JWT token, instructor/admin role
   */
  createCourse: async (courseData) => {
    return api.post('/courses', courseData);
  },

  /**
   * Update Course
   * PUT /api/courses/:id
   * Requires: JWT token, instructor/admin role
   */
  updateCourse: async (courseId, courseData) => {
    return api.put(`/courses/${courseId}`, courseData);
  },

  /**
   * Delete Course
   * DELETE /api/courses/:id
   * Requires: JWT token, instructor/admin role
   */
  deleteCourse: async (courseId) => {
    return api.delete(`/courses/${courseId}`);
  },

  /**
   * Get My Courses (Instructor)
   * GET /api/courses/instructor/my-courses
   * Requires: JWT token, instructor role
   */
  getInstructorCourses: async () => {
    return api.get('/courses/instructor/my-courses');
  },
};

/**
 * Product Service
 * Handles all product/shop-related API calls
 */

export const productService = {
  /**
   * Get All Products
   * GET /api/products
   * Query params: search, category, ageGroup, minPrice, maxPrice, limit, skip
   */
  getAllProducts: async (filters = {}) => {
    const params = new URLSearchParams();
    Object.keys(filters).forEach(key => {
      if (filters[key]) params.append(key, filters[key]);
    });
    return api.get(`/products?${params.toString()}`);
  },

  /**
   * Get Product by ID
   * GET /api/products/:id
   */
  getProduct: async (productId) => {
    return api.get(`/products/${productId}`);
  },

  /**
   * Create Product
   * POST /api/products
   * Requires: JWT token, admin/partner role
   */
  createProduct: async (productData) => {
    return api.post('/products', productData);
  },

  /**
   * Update Product
   * PUT /api/products/:id
   * Requires: JWT token, admin/partner role
   */
  updateProduct: async (productId, productData) => {
    return api.put(`/products/${productId}`, productData);
  },

  /**
   * Delete Product
   * DELETE /api/products/:id
   * Requires: JWT token, admin/partner role
   */
  deleteProduct: async (productId) => {
    return api.delete(`/products/${productId}`);
  },
};

/**
 * Enrollment Service
 * Handles all enrollment and course learning-related API calls
 */

export const enrollmentService = {
  /**
   * Enroll in Course
   * POST /api/enrollments/enroll
   * Requires: JWT token
   */
  enrollInCourse: async (courseId) => {
    return api.post('/enrollments/enroll', { courseId });
  },

  /**
   * Get My Enrolled Courses
   * GET /api/enrollments/my-courses
   * Requires: JWT token
   */
  getMyEnrolledCourses: async () => {
    return api.get('/enrollments/my-courses');
  },

  /**
   * Get Enrollment Details
   * GET /api/enrollments/:enrollmentId
   * Requires: JWT token
   */
  getEnrollmentDetails: async (enrollmentId) => {
    return api.get(`/enrollments/${enrollmentId}`);
  },

  /**
   * Mark Lesson as Complete
   * POST /api/enrollments/progress/complete-lesson
   * Requires: JWT token
   */
  completeLessonProgress: async (enrollmentId, lessonId) => {
    return api.post('/enrollments/progress/complete-lesson', {
      enrollmentId,
      lessonId,
    });
  },

  /**
   * Get Course Enrollments (Instructor)
   * GET /api/enrollments/course/:courseId/enrollments
   * Requires: JWT token, instructor role
   */
  getCourseEnrollments: async (courseId) => {
    return api.get(`/enrollments/course/${courseId}/enrollments`);
  },
};

/**
 * Community Service
 * Handles all community/posts-related API calls
 */

export const communityService = {
  /**
   * Create Post
   * POST /api/community
   * Requires: JWT token
   */
  createPost: async (postData) => {
    return api.post('/community', postData);
  },

  /**
   * Get All Posts
   * GET /api/community
   * Query params: category, sort, limit, skip
   */
  getAllPosts: async (filters = {}) => {
    const params = new URLSearchParams();
    Object.keys(filters).forEach(key => {
      if (filters[key]) params.append(key, filters[key]);
    });
    return api.get(`/community?${params.toString()}`);
  },

  /**
   * Get Post by ID
   * GET /api/community/post/:id
   */
  getPost: async (postId) => {
    return api.get(`/community/post/${postId}`);
  },

  /**
   * Update Post
   * PUT /api/community/:id
   * Requires: JWT token
   */
  updatePost: async (postId, postData) => {
    return api.put(`/community/${postId}`, postData);
  },

  /**
   * Delete Post
   * DELETE /api/community/:id
   * Requires: JWT token
   */
  deletePost: async (postId) => {
    return api.delete(`/community/${postId}`);
  },

  /**
   * Get User Posts
   * GET /api/community/user/:userId
   */
  getUserPosts: async (userId) => {
    return api.get(`/community/user/${userId}`);
  },

  /**
   * Like/Unlike Post
   * POST /api/community/:id/like
   * Requires: JWT token
   */
  toggleLikePost: async (postId) => {
    return api.post(`/community/${postId}/like`);
  },

  /**
   * Add Comment
   * POST /api/community/:id/comments
   * Requires: JWT token
   */
  addComment: async (postId, commentData) => {
    return api.post(`/community/${postId}/comments`, commentData);
  },

  /**
   * Delete Comment
   * DELETE /api/community/:postId/comments/:commentId
   * Requires: JWT token
   */
  deleteComment: async (postId, commentId) => {
    return api.delete(`/community/${postId}/comments/${commentId}`);
  },
};

export default {
  authService,
  courseService,
  productService,
  enrollmentService,
  communityService,
};
