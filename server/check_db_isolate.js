import prisma from './config/db.js';

async function check() {
    console.log('Testing query with instructor only...');
    let start = Date.now();
    try {
        const courses = await prisma.course.findMany({
            take: 1,
            include: { instructor: { select: { firstName: true } } }
        });
        console.log(`Success! Found ${courses.length} courses with instructor in ${Date.now() - start}ms`);
    } catch (e) { console.error('Instructor include failed:', e); }

    console.log('Testing query with partner only...');
    start = Date.now();
    try {
        const courses = await prisma.course.findMany({
            take: 1,
            include: { partner: { select: { name: true } } }
        });
        console.log(`Success! Found ${courses.length} courses with partner in ${Date.now() - start}ms`);
    } catch (e) { console.error('Partner include failed:', e); }
}

check()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
