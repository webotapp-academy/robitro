import prisma from '../config/db.js';
import bcrypt from 'bcryptjs';

// ========================
// DASHBOARD
// ========================
export const getDashboardStats = async (req, res) => {
    try {
        const [users, courses, products, orders, enrollments, posts] = await Promise.all([
            prisma.user.count(),
            prisma.course.count(),
            prisma.product.count(),
            prisma.order.count(),
            prisma.enrollment.count(),
            prisma.communityPost.count(),
        ]);

        const recentUsers = await prisma.user.findMany({
            take: 5,
            orderBy: { createdAt: 'desc' },
            select: { id: true, firstName: true, lastName: true, email: true, role: true, createdAt: true }
        });

        const recentOrders = await prisma.order.findMany({
            take: 5,
            orderBy: { createdAt: 'desc' },
            include: { user: { select: { firstName: true, lastName: true } } }
        });

        res.json({ success: true, data: { stats: { users, courses, products, orders, enrollments, posts }, recentUsers, recentOrders } });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ========================
// USERS CRUD
// ========================
export const getUsers = async (req, res) => {
    try {
        const { page = 1, limit = 20, role, search } = req.query;
        const where = {};
        if (role) where.role = role;
        if (search) where.OR = [
            { firstName: { contains: search, mode: 'insensitive' } },
            { lastName: { contains: search, mode: 'insensitive' } },
            { email: { contains: search, mode: 'insensitive' } },
        ];
        const [users, total] = await Promise.all([
            prisma.user.findMany({ where, take: +limit, skip: (+page - 1) * +limit, orderBy: { createdAt: 'desc' }, select: { id: true, firstName: true, lastName: true, email: true, role: true, status: true, createdAt: true, avatar: true } }),
            prisma.user.count({ where }),
        ]);
        res.json({ success: true, data: users, pagination: { total, page: +page, pages: Math.ceil(total / +limit) } });
    } catch (error) { res.status(500).json({ success: false, message: error.message }); }
};

export const updateUser = async (req, res) => {
    try {
        const user = await prisma.user.update({ where: { id: req.params.id }, data: req.body });
        res.json({ success: true, data: user });
    } catch (error) { res.status(500).json({ success: false, message: error.message }); }
};

export const deleteUser = async (req, res) => {
    try {
        await prisma.user.delete({ where: { id: req.params.id } });
        res.json({ success: true, message: 'User deleted' });
    } catch (error) { res.status(500).json({ success: false, message: error.message }); }
};

export const createUser = async (req, res) => {
    try {
        const { firstName, lastName, email, password, role, status } = req.body;
        if (!password) {
            return res.status(400).json({ success: false, message: 'Password is required' });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await prisma.user.create({
            data: {
                firstName,
                lastName,
                email,
                password: hashedPassword,
                role: role || 'student',
                status: status || 'active'
            }
        });
        res.status(201).json({ success: true, data: user });
    } catch (error) { res.status(500).json({ success: false, message: error.message }); }
};

// ========================
// PARTNERS CRUD
// ========================
export const getPartners = async (req, res) => {
    try {
        const partners = await prisma.partner.findMany({ orderBy: { createdAt: 'desc' } });
        res.json({ success: true, data: partners });
    } catch (error) { res.status(500).json({ success: false, message: error.message }); }
};

export const createPartner = async (req, res) => {
    try {
        const partner = await prisma.partner.create({ data: req.body });
        res.status(201).json({ success: true, data: partner });
    } catch (error) { res.status(500).json({ success: false, message: error.message }); }
};

export const updatePartner = async (req, res) => {
    try {
        const partner = await prisma.partner.update({ where: { id: req.params.id }, data: req.body });
        res.json({ success: true, data: partner });
    } catch (error) { res.status(500).json({ success: false, message: error.message }); }
};

export const deletePartner = async (req, res) => {
    try {
        await prisma.partner.delete({ where: { id: req.params.id } });
        res.json({ success: true, message: 'Partner deleted' });
    } catch (error) { res.status(500).json({ success: false, message: error.message }); }
};

// ========================
// ORDERS MANAGEMENT
// ========================
export const getOrders = async (req, res) => {
    try {
        const { page = 1, limit = 20, status } = req.query;
        const where = {};
        if (status) where.status = status;
        const [orders, total] = await Promise.all([
            prisma.order.findMany({ where, take: +limit, skip: (+page - 1) * +limit, orderBy: { createdAt: 'desc' }, include: { user: { select: { firstName: true, lastName: true, email: true } } } }),
            prisma.order.count({ where }),
        ]);
        res.json({ success: true, data: orders, pagination: { total, page: +page, pages: Math.ceil(total / +limit) } });
    } catch (error) { res.status(500).json({ success: false, message: error.message }); }
};

export const updateOrder = async (req, res) => {
    try {
        const order = await prisma.order.update({ where: { id: req.params.id }, data: req.body });
        res.json({ success: true, data: order });
    } catch (error) { res.status(500).json({ success: false, message: error.message }); }
};

// ========================
// ENROLLMENTS MANAGEMENT
// ========================
export const getEnrollments = async (req, res) => {
    try {
        const { page = 1, limit = 20 } = req.query;
        const [enrollments, total] = await Promise.all([
            prisma.enrollment.findMany({
                take: +limit,
                skip: (+page - 1) * +limit,
                orderBy: { enrolledAt: 'desc' },
                include: {
                    user: { select: { firstName: true, lastName: true, email: true } },
                    course: { select: { title: true, price: true } }
                }
            }),
            prisma.enrollment.count(),
        ]);
        // Flatten for CrudPage table display
        const data = enrollments.map(e => ({
            ...e,
            studentName: e.customerName || `${e.user?.firstName || ''} ${e.user?.lastName || ''}`.trim(),
            studentEmail: e.customerEmail || e.user?.email || '',
            courseTitle: e.course?.title || '',
            coursePrice: e.course?.price || 0,
        }));
        res.json({ success: true, data, pagination: { total, page: +page, pages: Math.ceil(total / +limit) } });
    } catch (error) { res.status(500).json({ success: false, message: error.message }); }
};

export const updateEnrollment = async (req, res) => {
    try {
        const { paymentStatus, status } = req.body;
        const updateData = {};
        if (paymentStatus) updateData.paymentStatus = paymentStatus;
        if (status) updateData.status = status;
        const enrollment = await prisma.enrollment.update({
            where: { id: req.params.id },
            data: updateData,
            include: {
                user: { select: { firstName: true, lastName: true, email: true } },
                course: { select: { title: true, price: true } }
            }
        });
        res.json({ success: true, data: enrollment });
    } catch (error) { res.status(500).json({ success: false, message: error.message }); }
};

// ========================
// CMS: HERO SECTIONS
// ========================
export const getHeroSections = async (req, res) => {
    try {
        const data = await prisma.heroSection.findMany({ orderBy: { displayOrder: 'asc' } });
        res.json({ success: true, data });
    } catch (error) { res.status(500).json({ success: false, message: error.message }); }
};

export const createHeroSection = async (req, res) => {
    try {
        const data = await prisma.heroSection.create({ data: req.body });
        res.status(201).json({ success: true, data });
    } catch (error) { res.status(500).json({ success: false, message: error.message }); }
};

export const updateHeroSection = async (req, res) => {
    try {
        const data = await prisma.heroSection.update({ where: { id: req.params.id }, data: req.body });
        res.json({ success: true, data });
    } catch (error) { res.status(500).json({ success: false, message: error.message }); }
};

export const deleteHeroSection = async (req, res) => {
    try {
        await prisma.heroSection.delete({ where: { id: req.params.id } });
        res.json({ success: true, message: 'Hero section deleted' });
    } catch (error) { res.status(500).json({ success: false, message: error.message }); }
};

// ========================
// CMS: FEATURE CARDS
// ========================
export const getFeatureCards = async (req, res) => {
    try {
        const data = await prisma.featureCard.findMany({ orderBy: { displayOrder: 'asc' } });
        res.json({ success: true, data });
    } catch (error) { res.status(500).json({ success: false, message: error.message }); }
};

export const createFeatureCard = async (req, res) => {
    try {
        const data = await prisma.featureCard.create({ data: req.body });
        res.status(201).json({ success: true, data });
    } catch (error) { res.status(500).json({ success: false, message: error.message }); }
};

export const updateFeatureCard = async (req, res) => {
    try {
        const data = await prisma.featureCard.update({ where: { id: req.params.id }, data: req.body });
        res.json({ success: true, data });
    } catch (error) { res.status(500).json({ success: false, message: error.message }); }
};

export const deleteFeatureCard = async (req, res) => {
    try {
        await prisma.featureCard.delete({ where: { id: req.params.id } });
        res.json({ success: true, message: 'Feature card deleted' });
    } catch (error) { res.status(500).json({ success: false, message: error.message }); }
};

// ========================
// CMS: TESTIMONIALS
// ========================
export const getTestimonials = async (req, res) => {
    try {
        const data = await prisma.testimonial.findMany({ orderBy: { displayOrder: 'asc' } });
        res.json({ success: true, data });
    } catch (error) { res.status(500).json({ success: false, message: error.message }); }
};

export const createTestimonial = async (req, res) => {
    try {
        const data = await prisma.testimonial.create({ data: req.body });
        res.status(201).json({ success: true, data });
    } catch (error) { res.status(500).json({ success: false, message: error.message }); }
};

export const updateTestimonial = async (req, res) => {
    try {
        const data = await prisma.testimonial.update({ where: { id: req.params.id }, data: req.body });
        res.json({ success: true, data });
    } catch (error) { res.status(500).json({ success: false, message: error.message }); }
};

export const deleteTestimonial = async (req, res) => {
    try {
        await prisma.testimonial.delete({ where: { id: req.params.id } });
        res.json({ success: true, message: 'Testimonial deleted' });
    } catch (error) { res.status(500).json({ success: false, message: error.message }); }
};

// ========================
// CMS: FAQS
// ========================
export const getFAQs = async (req, res) => {
    try {
        const data = await prisma.fAQ.findMany({ orderBy: { displayOrder: 'asc' } });
        res.json({ success: true, data });
    } catch (error) { res.status(500).json({ success: false, message: error.message }); }
};

export const createFAQ = async (req, res) => {
    try {
        const data = await prisma.fAQ.create({ data: req.body });
        res.status(201).json({ success: true, data });
    } catch (error) { res.status(500).json({ success: false, message: error.message }); }
};

export const updateFAQ = async (req, res) => {
    try {
        const data = await prisma.fAQ.update({ where: { id: req.params.id }, data: req.body });
        res.json({ success: true, data });
    } catch (error) { res.status(500).json({ success: false, message: error.message }); }
};

export const deleteFAQ = async (req, res) => {
    try {
        await prisma.fAQ.delete({ where: { id: req.params.id } });
        res.json({ success: true, message: 'FAQ deleted' });
    } catch (error) { res.status(500).json({ success: false, message: error.message }); }
};

// ========================
// CMS: SITE SETTINGS
// ========================
export const getSiteSettings = async (req, res) => {
    try {
        const data = await prisma.siteSetting.findMany({ orderBy: { group: 'asc' } });
        res.json({ success: true, data });
    } catch (error) { res.status(500).json({ success: false, message: error.message }); }
};

export const upsertSiteSetting = async (req, res) => {
    try {
        const { key, value, type, group, label } = req.body;
        const data = await prisma.siteSetting.upsert({
            where: { key },
            update: { value, type, group, label },
            create: { key, value, type, group, label },
        });
        res.json({ success: true, data });
    } catch (error) { res.status(500).json({ success: false, message: error.message }); }
};

export const updateSiteSetting = async (req, res) => {
    try {
        const data = await prisma.siteSetting.update({
            where: { id: req.params.id },
            data: req.body
        });
        res.json({ success: true, data });
    } catch (error) { res.status(500).json({ success: false, message: error.message }); }
};

export const deleteSiteSetting = async (req, res) => {
    try {
        await prisma.siteSetting.delete({ where: { id: req.params.id } });
        res.json({ success: true, message: 'Setting deleted' });
    } catch (error) { res.status(500).json({ success: false, message: error.message }); }
};

// ========================
// CMS: BANNERS
// ========================
export const getBanners = async (req, res) => {
    try {
        const data = await prisma.banner.findMany({ orderBy: { displayOrder: 'asc' } });
        res.json({ success: true, data });
    } catch (error) { res.status(500).json({ success: false, message: error.message }); }
};

export const createBanner = async (req, res) => {
    try {
        const data = await prisma.banner.create({ data: req.body });
        res.status(201).json({ success: true, data });
    } catch (error) { res.status(500).json({ success: false, message: error.message }); }
};

export const updateBanner = async (req, res) => {
    try {
        const data = await prisma.banner.update({ where: { id: req.params.id }, data: req.body });
        res.json({ success: true, data });
    } catch (error) { res.status(500).json({ success: false, message: error.message }); }
};

export const deleteBanner = async (req, res) => {
    try {
        await prisma.banner.delete({ where: { id: req.params.id } });
        res.json({ success: true, message: 'Banner deleted' });
    } catch (error) { res.status(500).json({ success: false, message: error.message }); }
};

// ========================
// CMS: TECH BITES
// ========================
export const getTechBites = async (req, res) => {
    try {
        const data = await prisma.techBite.findMany({ orderBy: { displayOrder: 'asc' } });
        res.json({ success: true, data });
    } catch (error) { res.status(500).json({ success: false, message: error.message }); }
};

export const createTechBite = async (req, res) => {
    try {
        const data = await prisma.techBite.create({ data: req.body });
        res.status(201).json({ success: true, data });
    } catch (error) { res.status(500).json({ success: false, message: error.message }); }
};

export const updateTechBite = async (req, res) => {
    try {
        const data = await prisma.techBite.update({ where: { id: req.params.id }, data: req.body });
        res.json({ success: true, data });
    } catch (error) { res.status(500).json({ success: false, message: error.message }); }
};

export const deleteTechBite = async (req, res) => {
    try {
        await prisma.techBite.delete({ where: { id: req.params.id } });
        res.json({ success: true, message: 'Tech bite deleted' });
    } catch (error) { res.status(500).json({ success: false, message: error.message }); }
};

// ========================
// CMS: MASTER MAKERS
// ========================
export const getMasterMakers = async (req, res) => {
    try {
        const data = await prisma.masterMaker.findMany({ orderBy: { displayOrder: 'asc' } });
        res.json({ success: true, data });
    } catch (error) { res.status(500).json({ success: false, message: error.message }); }
};

export const createMasterMaker = async (req, res) => {
    try {
        const data = await prisma.masterMaker.create({ data: req.body });
        res.status(201).json({ success: true, data });
    } catch (error) { res.status(500).json({ success: false, message: error.message }); }
};

export const updateMasterMaker = async (req, res) => {
    try {
        const data = await prisma.masterMaker.update({ where: { id: req.params.id }, data: req.body });
        res.json({ success: true, data });
    } catch (error) { res.status(500).json({ success: false, message: error.message }); }
};

export const deleteMasterMaker = async (req, res) => {
    try {
        await prisma.masterMaker.delete({ where: { id: req.params.id } });
        res.json({ success: true, message: 'Master maker deleted' });
    } catch (error) { res.status(500).json({ success: false, message: error.message }); }
};

// ========================
// CMS: PROJECT SHOWCASE
// ========================
export const getProjectShowcases = async (req, res) => {
    try {
        const data = await prisma.projectShowcase.findMany({ orderBy: { displayOrder: 'asc' } });
        res.json({ success: true, data });
    } catch (error) { res.status(500).json({ success: false, message: error.message }); }
};

export const createProjectShowcase = async (req, res) => {
    try {
        const data = await prisma.projectShowcase.create({ data: req.body });
        res.status(201).json({ success: true, data });
    } catch (error) { res.status(500).json({ success: false, message: error.message }); }
};

export const updateProjectShowcase = async (req, res) => {
    try {
        const data = await prisma.projectShowcase.update({ where: { id: req.params.id }, data: req.body });
        res.json({ success: true, data });
    } catch (error) { res.status(500).json({ success: false, message: error.message }); }
};

export const deleteProjectShowcase = async (req, res) => {
    try {
        await prisma.projectShowcase.delete({ where: { id: req.params.id } });
        res.json({ success: true, message: 'Project deleted' });
    } catch (error) { res.status(500).json({ success: false, message: error.message }); }
};

// ========================
// CMS: CHALLENGES
// ========================
export const getChallenges = async (req, res) => {
    try {
        const data = await prisma.challenge.findMany({ orderBy: { createdAt: 'desc' } });
        res.json({ success: true, data });
    } catch (error) { res.status(500).json({ success: false, message: error.message }); }
};

export const createChallenge = async (req, res) => {
    try {
        const data = await prisma.challenge.create({ data: req.body });
        res.status(201).json({ success: true, data });
    } catch (error) { res.status(500).json({ success: false, message: error.message }); }
};

export const updateChallenge = async (req, res) => {
    try {
        const data = await prisma.challenge.update({ where: { id: req.params.id }, data: req.body });
        res.json({ success: true, data });
    } catch (error) { res.status(500).json({ success: false, message: error.message }); }
};

export const deleteChallenge = async (req, res) => {
    try {
        await prisma.challenge.delete({ where: { id: req.params.id } });
        res.json({ success: true, message: 'Challenge deleted' });
    } catch (error) { res.status(500).json({ success: false, message: error.message }); }
};

// ========================
// CMS: SOCIAL LINKS
// ========================
export const getSocialLinks = async (req, res) => {
    try {
        const data = await prisma.socialLink.findMany({ orderBy: { displayOrder: 'asc' } });
        res.json({ success: true, data });
    } catch (error) { res.status(500).json({ success: false, message: error.message }); }
};

export const createSocialLink = async (req, res) => {
    try {
        const data = await prisma.socialLink.create({ data: req.body });
        res.status(201).json({ success: true, data });
    } catch (error) { res.status(500).json({ success: false, message: error.message }); }
};

export const updateSocialLink = async (req, res) => {
    try {
        const data = await prisma.socialLink.update({ where: { id: req.params.id }, data: req.body });
        res.json({ success: true, data });
    } catch (error) { res.status(500).json({ success: false, message: error.message }); }
};

export const deleteSocialLink = async (req, res) => {
    try {
        await prisma.socialLink.delete({ where: { id: req.params.id } });
        res.json({ success: true, message: 'Social link deleted' });
    } catch (error) { res.status(500).json({ success: false, message: error.message }); }
};

// ========================
// COMMUNITY MANAGEMENT
// ========================
export const getCommunityPosts = async (req, res) => {
    try {
        const { page = 1, limit = 20 } = req.query;
        const [posts, total] = await Promise.all([
            prisma.communityPost.findMany({
                take: +limit,
                skip: (+page - 1) * +limit,
                orderBy: { createdAt: 'desc' },
                include: { author: { select: { firstName: true, lastName: true, email: true } } }
            }),
            prisma.communityPost.count(),
        ]);
        res.json({ success: true, data: posts, pagination: { total, page: +page, pages: Math.ceil(total / +limit) } });
    } catch (error) { res.status(500).json({ success: false, message: error.message }); }
};

export const updateCommunityPost = async (req, res) => {
    try {
        const post = await prisma.communityPost.update({ where: { id: req.params.id }, data: req.body });
        res.json({ success: true, data: post });
    } catch (error) { res.status(500).json({ success: false, message: error.message }); }
};

export const deleteCommunityPost = async (req, res) => {
    try {
        await prisma.communityPost.delete({ where: { id: req.params.id } });
        res.json({ success: true, message: 'Post deleted' });
    } catch (error) { res.status(500).json({ success: false, message: error.message }); }
};

// ========================
// LEADS MANAGEMENT
// ========================
export const getLeads = async (req, res) => {
    try {
        const { page = 1, limit = 20 } = req.query;
        const [data, total] = await Promise.all([
            prisma.lead.findMany({
                take: +limit,
                skip: (+page - 1) * +limit,
                orderBy: { createdAt: 'desc' },
                include: { course: { select: { title: true } } }
            }),
            prisma.lead.count(),
        ]);
        res.json({ success: true, data, pagination: { total, page: +page, pages: Math.ceil(total / +limit) } });
    } catch (error) { res.status(500).json({ success: false, message: error.message }); }
};

export const updateLead = async (req, res) => {
    try {
        const data = await prisma.lead.update({ where: { id: req.params.id }, data: req.body });
        res.json({ success: true, data });
    } catch (error) { res.status(500).json({ success: false, message: error.message }); }
};

export const deleteLead = async (req, res) => {
    try {
        await prisma.lead.delete({ where: { id: req.params.id } });
        res.json({ success: true, message: 'Lead deleted' });
    } catch (error) { res.status(500).json({ success: false, message: error.message }); }
};

// ========================
// CALLBACKS MANAGEMENT
// ========================
export const getCallbacks = async (req, res) => {
    try {
        const { page = 1, limit = 20 } = req.query;
        const [data, total] = await Promise.all([
            prisma.callbackRequest.findMany({
                take: +limit,
                skip: (+page - 1) * +limit,
                orderBy: { createdAt: 'desc' },
                include: { course: { select: { title: true } } }
            }),
            prisma.callbackRequest.count(),
        ]);
        res.json({ success: true, data, pagination: { total, page: +page, pages: Math.ceil(total / +limit) } });
    } catch (error) { res.status(500).json({ success: false, message: error.message }); }
};

export const updateCallback = async (req, res) => {
    try {
        const data = await prisma.callbackRequest.update({ where: { id: req.params.id }, data: req.body });
        res.json({ success: true, data });
    } catch (error) { res.status(500).json({ success: false, message: error.message }); }
};

export const deleteCallback = async (req, res) => {
    try {
        await prisma.callbackRequest.delete({ where: { id: req.params.id } });
        res.json({ success: true, message: 'Callback request deleted' });
    } catch (error) { res.status(500).json({ success: false, message: error.message }); }
};

// ========================
// PRODUCT CATEGORIES
// ========================
export const getProductCategories = async (req, res) => {
    try {
        const data = await prisma.productCategory.findMany({ orderBy: { name: 'asc' } });
        res.json({ success: true, data });
    } catch (error) { res.status(500).json({ success: false, message: error.message }); }
};

export const createProductCategory = async (req, res) => {
    try {
        const { name, slug, description } = req.body;
        const data = await prisma.productCategory.create({ data: { name, slug, description } });
        res.status(201).json({ success: true, data });
    } catch (error) { res.status(500).json({ success: false, message: error.message }); }
};

export const updateProductCategory = async (req, res) => {
    try {
        const data = await prisma.productCategory.update({ where: { id: req.params.id }, data: req.body });
        res.json({ success: true, data });
    } catch (error) { res.status(500).json({ success: false, message: error.message }); }
};

export const deleteProductCategory = async (req, res) => {
    try {
        await prisma.productCategory.delete({ where: { id: req.params.id } });
        res.json({ success: true, message: 'Category deleted' });
    } catch (error) { res.status(500).json({ success: false, message: error.message }); }
};
