import express from 'express';
import { protect, authorize } from '../middleware/auth.js';
import { upload } from '../utils/upload.js';
import {
    getDashboardStats,
    getUsers,
    createUser,
    updateUser,
    deleteUser,
    getPartners,
    createPartner,
    updatePartner,
    deletePartner,
    getOrders,
    updateOrder,
    getEnrollments,
    updateEnrollment,
    getCommunityPosts,
    updateCommunityPost,
    deleteCommunityPost,
    getHeroSections,
    createHeroSection,
    updateHeroSection,
    deleteHeroSection,
    getFeatureCards,
    createFeatureCard,
    updateFeatureCard,
    deleteFeatureCard,
    getTestimonials,
    createTestimonial,
    updateTestimonial,
    deleteTestimonial,
    getFAQs,
    createFAQ,
    updateFAQ,
    deleteFAQ,
    getSiteSettings,
    upsertSiteSetting,
    deleteSiteSetting,
    getBanners,
    createBanner,
    updateBanner,
    deleteBanner,
    getTechBites,
    createTechBite,
    updateTechBite,
    deleteTechBite,
    getMasterMakers,
    createMasterMaker,
    updateMasterMaker,
    deleteMasterMaker,
    getProjectShowcases,
    createProjectShowcase,
    updateProjectShowcase,
    deleteProjectShowcase,
    getChallenges,
    createChallenge,
    updateChallenge,
    deleteChallenge,
    getSocialLinks,
    createSocialLink,
    updateSocialLink,
    deleteSocialLink,
    getLeads,
    updateLead,
    deleteLead,
    getCallbacks,
    updateCallback,
    deleteCallback,
    getProductCategories,
    createProductCategory,
    updateProductCategory,
    deleteProductCategory,
    updateSiteSetting,
    getCourseCategories,
    createCourseCategory,
    updateCourseCategory,
    deleteCourseCategory
} from '../controllers/adminController.js';
import { getAllCourses, createCourse, updateCourse, deleteCourse } from '../controllers/courseController.js';
import { getAllProducts, createProduct, updateProduct, deleteProduct } from '../controllers/productController.js';

const router = express.Router();

// All admin routes require authentication + admin role
router.use(protect);
router.use(authorize('admin'));

// Dashboard
router.get('/dashboard', getDashboardStats);

// Users
router.get('/users', getUsers);
router.post('/users', createUser);
router.put('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);

// Partners
router.get('/partners', getPartners);
router.post('/partners', createPartner);
router.put('/partners/:id', updatePartner);
router.delete('/partners/:id', deletePartner);

// Orders
router.get('/orders', getOrders);
router.put('/orders/:id', updateOrder);

// Enrollments
router.get('/enrollments', getEnrollments);
router.put('/enrollments/:id', updateEnrollment);

// Community
router.get('/community', getCommunityPosts);
router.put('/community/:id', updateCommunityPost);
router.delete('/community/:id', deleteCommunityPost);

// Courses
router.get('/courses', getAllCourses);
router.post('/courses', createCourse);
router.put('/courses/:id', updateCourse);
router.delete('/courses/:id', deleteCourse);

// Products
router.get('/products', getAllProducts);
router.post('/products', createProduct);
router.put('/products/:id', updateProduct);
router.delete('/products/:id', deleteProduct);

// CMS: Hero Sections
router.get('/cms/hero', getHeroSections);
router.post('/cms/hero', createHeroSection);
router.put('/cms/hero/:id', updateHeroSection);
router.delete('/cms/hero/:id', deleteHeroSection);

// CMS: Feature Cards
router.get('/cms/features', getFeatureCards);
router.post('/cms/features', createFeatureCard);
router.put('/cms/features/:id', updateFeatureCard);
router.delete('/cms/features/:id', deleteFeatureCard);

// CMS: Testimonials
router.get('/cms/testimonials', getTestimonials);
router.post('/cms/testimonials', createTestimonial);
router.put('/cms/testimonials/:id', updateTestimonial);
router.delete('/cms/testimonials/:id', deleteTestimonial);

// CMS: FAQs
router.get('/cms/faqs', getFAQs);
router.post('/cms/faqs', createFAQ);
router.put('/cms/faqs/:id', updateFAQ);
router.delete('/cms/faqs/:id', deleteFAQ);

// CMS: Site Settings
router.get('/cms/settings', getSiteSettings);
router.post('/cms/settings', upsertSiteSetting);
router.put('/cms/settings/:id', updateSiteSetting);
router.delete('/cms/settings/:id', deleteSiteSetting);

// CMS: Banners
router.get('/cms/banners', getBanners);
router.post('/cms/banners', createBanner);
router.put('/cms/banners/:id', updateBanner);
router.delete('/cms/banners/:id', deleteBanner);

// CMS: Tech Bites
router.get('/cms/tech-bites', getTechBites);
router.post('/cms/tech-bites', createTechBite);
router.put('/cms/tech-bites/:id', updateTechBite);
router.delete('/cms/tech-bites/:id', deleteTechBite);

// CMS: Master Makers
router.get('/cms/makers', getMasterMakers);
router.post('/cms/makers', createMasterMaker);
router.put('/cms/makers/:id', updateMasterMaker);
router.delete('/cms/makers/:id', deleteMasterMaker);

// CMS: Project Showcase
router.get('/cms/projects', getProjectShowcases);
router.post('/cms/projects', createProjectShowcase);
router.put('/cms/projects/:id', updateProjectShowcase);
router.delete('/cms/projects/:id', deleteProjectShowcase);

// CMS: Challenges
router.get('/cms/challenges', getChallenges);
router.post('/cms/challenges', createChallenge);
router.put('/cms/challenges/:id', updateChallenge);
router.delete('/cms/challenges/:id', deleteChallenge);

// CMS: Social Links
router.get('/cms/social-links', getSocialLinks);
router.post('/cms/social-links', createSocialLink);
router.put('/cms/social-links/:id', updateSocialLink);
router.delete('/cms/social-links/:id', deleteSocialLink);

// Leads
router.get('/leads', getLeads);
router.put('/leads/:id', updateLead);
router.delete('/leads/:id', deleteLead);

// Callbacks
router.get('/callbacks', getCallbacks);
router.put('/callbacks/:id', updateCallback);
router.delete('/callbacks/:id', deleteCallback);

// Product Categories
router.get('/product-categories', getProductCategories);
router.post('/product-categories', createProductCategory);
router.put('/product-categories/:id', updateProductCategory);
router.delete('/product-categories/:id', deleteProductCategory);

// File Upload
router.post('/upload', upload.single('image'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ success: false, message: 'No file uploaded' });
    }
    const url = `/uploads/${req.file.filename}`;
    res.json({ success: true, url });
});

// Course Categories
router.get('/course-categories', getCourseCategories);
router.post('/course-categories', createCourseCategory);
router.put('/course-categories/:id', updateCourseCategory);
router.delete('/course-categories/:id', deleteCourseCategory);

export default router;
