import prisma from './config/db.js';

async function main() {
    try {
        const productCount = await prisma.product.count();
        const courseCount = await prisma.course.count();
        const categoryCount = await prisma.productCategory.count();
        const heroCount = await prisma.heroSection.count();
        const featureCount = await prisma.featureCard.count();
        const testimonialCount = await prisma.testimonial.count();
        const faqCount = await prisma.fAQ.count();
        const bannerCount = await prisma.banner.count();
        const techBiteCount = await prisma.techBite.count();
        const makerCount = await prisma.masterMaker.count();
        const projectCount = await prisma.projectShowcase.count();
        const challengeCount = await prisma.challenge.count();

        console.log(`--- Data Summary ---`);
        console.log(`Products: ${productCount}`);
        console.log(`Product Categories: ${categoryCount}`);
        console.log(`Courses: ${courseCount}`);
        console.log(`Hero Sections: ${heroCount}`);
        console.log(`Feature Cards: ${featureCount}`);
        console.log(`Testimonials: ${testimonialCount}`);
        console.log(`FAQs: ${faqCount}`);
        console.log(`Banners: ${bannerCount}`);
        console.log(`Tech Bites: ${techBiteCount}`);
        console.log(`Master Makers: ${makerCount}`);
        console.log(`Project Showcases: ${projectCount}`);
        console.log(`Challenges: ${challengeCount}`);

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
