import prisma from './config/db.js';

async function main() {
    try {
        const admin = await prisma.user.findFirst({
            where: { role: 'admin' }
        });
        if (admin) {
            console.log(`Admin ID: ${admin.id}`);
        } else {
            console.log('No admin found');
        }
    } catch (error) {
        console.error('Error:', error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
