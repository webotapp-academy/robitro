import prisma from './config/db.js';

async function check() {
    console.log('Testing full query from controller...');
    const startTime = Date.now();
    try {
        const where = { status: 'published' };
        const courses = await prisma.course.findMany({
            where,
            include: {
                instructor: {
                    select: { firstName: true, lastName: true, avatar: true, email: true }
                },
                partner: {
                    select: { name: true, partnerType: true }
                }
            },
            take: 10,
            skip: 0,
            orderBy: { createdAt: 'desc' },
        });
        console.log(`Success! Found ${courses.length} courses in ${Date.now() - startTime}ms`);
        if (courses.length > 0) {
            console.log('First course instructor:', courses[0].instructor);
        }
    } catch (error) {
        console.error('Query failed:', error);
    }
}

check()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
