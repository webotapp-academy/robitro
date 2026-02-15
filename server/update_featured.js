import prisma from './config/db.js';

async function main() {
    // Get first 4 active products and mark them as featured
    const products = await prisma.product.findMany({
        take: 4,
        where: { status: 'active' },
        orderBy: { createdAt: 'desc' }
    });

    console.log(`Found ${products.length} products to mark as featured`);

    for (const product of products) {
        await prisma.product.update({
            where: { id: product.id },
            data: { featured: true }
        });
        console.log(`✅ Marked "${product.name}" as featured`);
    }

    console.log('\n✅ Done! Featured products updated.');

    // Verify
    const featured = await prisma.product.findMany({
        where: { featured: true }
    });
    console.log(`\n📊 Total featured products: ${featured.length}`);
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
