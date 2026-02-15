import prisma from './config/db.js';

async function check() {
    const courseCount = await prisma.course.count();
    const productCount = await prisma.product.count();
    console.log(`Courses: ${courseCount}`);
    console.log(`Products: ${productCount}`);

    if (courseCount > 0) {
        const courses = await prisma.course.findMany({ take: 1 });
        console.log('Sample course:', JSON.stringify(courses[0], null, 2));
    }
}

check()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
