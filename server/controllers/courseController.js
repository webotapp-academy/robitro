import prisma from '../config/db.js';

// ==================== GET ALL COURSES ====================
export const getAllCourses = async (req, res) => {
  try {
    const { category, level, ageGroup, search, page = 1, limit = 10, skip = 0, status } = req.query;

    // Build filter object - don't filter by status if admin is requesting
    let where = {};

    // Only filter published courses if not from admin panel
    if (status) {
      where.status = status;
    } else if (!req.path.includes('/admin/')) {
      where.status = 'published';
    }

    if (category) where.category = category;
    if (level) where.level = level;
    if (ageGroup) where.ageGroup = ageGroup;
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    // Calculate pagination
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skipNum = skip ? parseInt(skip) : (pageNum - 1) * limitNum;

    // Get total count
    const total = await prisma.course.count({ where });

    // Get courses with pagination
    const courses = await prisma.course.findMany({
      where,
      take: limitNum,
      skip: skipNum,
      orderBy: { createdAt: 'desc' },
    });

    res.status(200).json({
      success: true,
      data: courses, // Changed from 'courses' to 'data' for admin panel compatibility
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        pages: Math.ceil(total / limitNum)
      },
      // Keep legacy fields for backward compatibility
      count: courses.length,
      courses,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==================== GET SINGLE COURSE ====================
export const getCourseById = async (req, res) => {
  try {
    const course = await prisma.course.findUnique({
      where: { id: req.params.id },
      include: {
        instructor: {
          select: { firstName: true, lastName: true, avatar: true, email: true, bio: true }
        },
        partner: {
          select: { name: true, partnerType: true, website: true }
        },
        modules: {
          include: {
            lessons: true
          },
          orderBy: { order: 'asc' }
        }
      },
    });

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found',
      });
    }

    res.status(200).json({
      success: true,
      course,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==================== CREATE COURSE (ADMIN/INSTRUCTOR) ====================
export const createCourse = async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      level,
      ageGroup,
      price,
      thumbnail,
      isLive,
      startDate,
      endDate,
      modules,
    } = req.body;

    // Validation
    if (!title || !description || !category || !ageGroup) {
      return res.status(400).json({
        success: false,
        message: 'Please provide title, description, category, and ageGroup',
      });
    }

    // Check if user is instructor or admin
    const user = await prisma.user.findUnique({ where: { id: req.user.id } });
    if (user.role !== 'instructor' && user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Only instructors and admins can create courses',
      });
    }

    // Create course with modules and lessons if provided
    const course = await prisma.course.create({
      data: {
        title,
        description,
        category,
        level: level || 'beginner',
        ageGroup,
        price: price ? parseFloat(price) : 0,
        thumbnail: thumbnail || 'https://via.placeholder.com/400x300',
        isLive: isLive || false,
        startDate: startDate ? new Date(startDate) : null,
        endDate: endDate ? new Date(endDate) : null,
        instructorId: req.user.id,
        status: 'draft',
        modules: {
          create: modules?.map((mod) => ({
            title: mod.title,
            order: parseInt(mod.order),
            lessons: {
              create: mod.lessons?.map((lesson) => ({
                title: lesson.title,
                videoUrl: lesson.videoUrl,
                duration: parseInt(lesson.duration),
                resources: lesson.resources || [],
                order: parseInt(lesson.order),
              }))
            }
          })) || []
        }
      },
      include: {
        modules: {
          include: {
            lessons: true
          }
        }
      }
    });

    res.status(201).json({
      success: true,
      message: 'Course created successfully',
      course,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==================== UPDATE COURSE ====================
export const updateCourse = async (req, res) => {
  try {
    const { title, description, category, level, ageGroup, price, status, modules } = req.body;

    // Find course
    const course = await prisma.course.findUnique({
      where: { id: req.params.id }
    });

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found',
      });
    }

    // Check authorization
    if (course.instructorId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this course',
      });
    }

    // Update fields
    const updateData = {};
    if (title) updateData.title = title;
    if (description) updateData.description = description;
    if (category) updateData.category = category;
    if (level) updateData.level = level;
    if (ageGroup) updateData.ageGroup = ageGroup;
    if (price !== undefined) updateData.price = parseFloat(price);
    if (status) updateData.status = status;

    // Handle modules update (complex)
    // For simplicity, we'll delete existing and recreate if modules are provided
    if (modules) {
      await prisma.module.deleteMany({ where: { courseId: req.params.id } });
      updateData.modules = {
        create: modules.map((mod) => ({
          title: mod.title,
          order: parseInt(mod.order),
          lessons: {
            create: mod.lessons?.map((lesson) => ({
              title: lesson.title,
              videoUrl: lesson.videoUrl,
              duration: parseInt(lesson.duration),
              resources: lesson.resources || [],
              order: parseInt(lesson.order),
            }))
          }
        }))
      };
    }

    const updatedCourse = await prisma.course.update({
      where: { id: req.params.id },
      data: updateData,
      include: {
        modules: {
          include: {
            lessons: true
          }
        }
      }
    });

    res.status(200).json({
      success: true,
      message: 'Course updated successfully',
      course: updatedCourse,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==================== DELETE COURSE ====================
export const deleteCourse = async (req, res) => {
  try {
    const course = await prisma.course.findUnique({
      where: { id: req.params.id }
    });

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found',
      });
    }

    // Check authorization
    if (course.instructorId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this course',
      });
    }

    await prisma.course.delete({
      where: { id: req.params.id },
    });

    res.status(200).json({
      success: true,
      message: 'Course deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==================== GET MY COURSES (INSTRUCTOR) ====================
export const getInstructorCourses = async (req, res) => {
  try {
    const courses = await prisma.course.findMany({
      where: { instructorId: req.user.id },
      include: {
        instructor: {
          select: { firstName: true, lastName: true, avatar: true }
        }
      },
      orderBy: { createdAt: 'desc' },
    });

    res.status(200).json({
      success: true,
      count: courses.length,
      courses,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
