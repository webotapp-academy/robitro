import prisma from './config/db.js';

async function main() {
    try {
        const count = await prisma.product.count();
        console.log(`Total products: ${count}`);

        if (count > 0) {
            const products = await prisma.product.findMany({
                take: 5
            });
            console.log('Sample products:', JSON.stringify(products, null, 2));
        }

        const categoryCount = await prisma.productCategory.count();
        console.log(`Total categories: ${categoryCount}`);
    } catch (error) {
        console.error('Error:', error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
