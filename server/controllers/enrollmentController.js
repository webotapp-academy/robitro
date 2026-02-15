import prisma from '../config/db.js';

// ==================== ENROLL IN COURSE ====================
export const enrollCourse = async (req, res) => {
  try {
    const { courseId, transactionNumber, customerName, customerEmail, customerPhone } = req.body;

    if (!courseId) {
      return res.status(400).json({
        success: false,
        message: 'Please provide courseId',
      });
    }

    // Check if course exists
    const course = await prisma.course.findUnique({
      where: { id: courseId }
    });

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found',
      });
    }

    // Check if already enrolled
    const existingEnrollment = await prisma.enrollment.findUnique({
      where: {
        userId_courseId: {
          userId: req.user.id,
          courseId,
        }
      }
    });

    if (existingEnrollment) {
      return res.status(409).json({
        success: false,
        message: 'You are already enrolled in this course',
      });
    }

    // Handle payment proof file
    let paymentProofPath = null;
    if (req.file) {
      paymentProofPath = `/uploads/enrollment-proofs/${req.file.filename}`;
    }

    // Create enrollment with payment info
    const enrollment = await prisma.enrollment.create({
      data: {
        userId: req.user.id,
        courseId,
        status: 'ongoing',
        enrolledAt: new Date(),
        paymentStatus: 'pending',
        paymentAmount: course.price || 0,
        paymentProof: paymentProofPath,
        transactionNumber: transactionNumber || null,
        customerName: customerName || `${req.user.firstName} ${req.user.lastName}`,
        customerEmail: customerEmail || req.user.email,
        customerPhone: customerPhone || null,
      },
    });

    // Update course enrollment count
    await prisma.course.update({
      where: { id: courseId },
      data: {
        enrollmentCount: {
          increment: 1
        }
      }
    });

    res.status(201).json({
      success: true,
      message: 'Enrolled in course successfully! Payment is being verified.',
      enrollment,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==================== GET MY ENROLLED COURSES ====================
export const getMyEnrolledCourses = async (req, res) => {
  try {
    const { limit = 10, skip = 0 } = req.query;

    // Get total count
    const total = await prisma.enrollment.count({
      where: { userId: req.user.id }
    });

    // Get enrollments
    const enrollments = await prisma.enrollment.findMany({
      where: { userId: req.user.id },
      include: {
        course: {
          select: {
            id: true,
            title: true,
            description: true,
            category: true,
            level: true,
            thumbnail: true,
            price: true,
            instructor: {
              select: { firstName: true, lastName: true, avatar: true }
            }
          }
        }
      },
      take: parseInt(limit),
      skip: parseInt(skip),
      orderBy: { enrolledAt: 'desc' },
    });

    const courses = enrollments.map((enrollment) => ({
      enrollmentId: enrollment.id,
      enrolledAt: enrollment.enrolledAt,
      progress: enrollment.progressPercentage,
      status: enrollment.status,
      certificateIssued: enrollment.certificateIssued,
      ...enrollment.course,
    }));

    res.status(200).json({
      success: true,
      count: courses.length,
      total,
      skip: parseInt(skip),
      limit: parseInt(limit),
      courses,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==================== GET ENROLLMENT DETAILS ====================
export const getEnrollmentDetails = async (req, res) => {
  try {
    const enrollment = await prisma.enrollment.findUnique({
      where: { id: req.params.enrollmentId },
      include: {
        user: {
          select: { firstName: true, lastName: true, email: true, avatar: true }
        },
        course: {
          include: {
            modules: {
              include: {
                lessons: true
              }
            }
          }
        },
        completedLessons: true,
      }
    });

    if (!enrollment) {
      return res.status(404).json({
        success: false,
        message: 'Enrollment not found',
      });
    }

    // Check authorization
    if (enrollment.userId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this enrollment',
      });
    }

    res.status(200).json({
      success: true,
      enrollment,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==================== MARK LESSON AS COMPLETE ====================
export const completeLessonProgress = async (req, res) => {
  try {
    const { enrollmentId, lessonId } = req.body;

    if (!enrollmentId || !lessonId) {
      return res.status(400).json({
        success: false,
        message: 'Please provide enrollmentId and lessonId',
      });
    }

    const enrollment = await prisma.enrollment.findUnique({
      where: { id: enrollmentId },
      include: {
        completedLessons: true,
        course: {
          include: {
            modules: {
              include: {
                lessons: true
              }
            }
          }
        }
      }
    });

    if (!enrollment) {
      return res.status(404).json({
        success: false,
        message: 'Enrollment not found',
      });
    }

    // Check authorization
    if (enrollment.userId !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized',
      });
    }

    // Check if lesson already completed
    const alreadyCompleted = enrollment.completedLessons.some(
      (lesson) => lesson.lessonId === lessonId
    );

    if (!alreadyCompleted) {
      await prisma.completedLesson.create({
        data: {
          enrollmentId,
          lessonId,
          completedAt: new Date(),
        }
      });

      // Fetch fresh completed lessons count
      const completedCount = await prisma.completedLesson.count({
        where: { enrollmentId }
      });

      // Calculate progress percentage
      const totalLessons = enrollment.course.modules.reduce(
        (acc, module) => acc + module.lessons.length,
        0
      );

      const progressPercentage = Math.round((completedCount / totalLessons) * 100);

      // Check if course completed
      const updateData = {
        progressPercentage
      };

      if (progressPercentage === 100) {
        updateData.status = 'completed';
        updateData.certificateIssued = true;
        updateData.certificateIssuedAt = new Date();
      }

      const updatedEnrollment = await prisma.enrollment.update({
        where: { id: enrollmentId },
        data: updateData,
        include: { completedLessons: true }
      });

      return res.status(200).json({
        success: true,
        message: 'Lesson marked as complete',
        enrollment: updatedEnrollment,
      });
    }

    res.status(200).json({
      success: true,
      message: 'Lesson already marked as complete',
      enrollment,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==================== GET COURSE ENROLLMENTS (INSTRUCTOR) ====================
export const getCourseEnrollments = async (req, res) => {
  try {
    const { courseId } = req.params;

    // Verify course belongs to instructor
    const course = await prisma.course.findUnique({
      where: { id: courseId }
    });

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found',
      });
    }

    if (course.instructorId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view enrollments',
      });
    }

    const enrollments = await prisma.enrollment.findMany({
      where: { courseId },
      include: {
        user: {
          select: { firstName: true, lastName: true, email: true, avatar: true }
        }
      },
      orderBy: { enrolledAt: 'desc' },
    });

    res.status(200).json({
      success: true,
      count: enrollments.length,
      enrollments,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
