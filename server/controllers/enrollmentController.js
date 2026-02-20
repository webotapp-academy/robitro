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
            metadata: true,
            instructor: {
              select: { firstName: true, lastName: true, avatar: true }
            }
          }
        },
        completedLessons: true,
      },
      take: parseInt(limit),
      skip: parseInt(skip),
      orderBy: { enrolledAt: 'desc' },
    });

    const courses = enrollments.map((enrollment) => ({
      enrollmentId: enrollment.id,
      enrolledAt: enrollment.enrolledAt,
      progressPercentage: enrollment.progressPercentage,
      progress: enrollment.progressPercentage,
      status: enrollment.status,
      certificateIssued: enrollment.certificateIssued,
      completedLessons: enrollment.completedLessons,
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
        course: true,
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

      // Calculate total lessons from metadata curriculum
      const metadata = enrollment.course.metadata || {};
      const curriculum = metadata.curriculum || [];
      let totalLessons = curriculum.reduce(
        (acc, chapter) => acc + (chapter.lessons ? chapter.lessons.length : 0),
        0
      );

      // Fallback: if no curriculum in metadata, try Module/Lesson tables
      if (totalLessons === 0) {
        const moduleCount = await prisma.lesson.count({
          where: { module: { courseId: enrollment.courseId } }
        });
        totalLessons = moduleCount;
      }

      // Avoid division by zero
      const progressPercentage = totalLessons > 0
        ? Math.round((completedCount / totalLessons) * 100)
        : 0;

      // Check if course completed
      const updateData = {
        progressPercentage
      };

      if (progressPercentage >= 100) {
        updateData.progressPercentage = 100;
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
