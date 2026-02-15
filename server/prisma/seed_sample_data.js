import 'dotenv/config';
import pg from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';

const connectionString = process.env.DATABASE_URL;
const pool = new pg.Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
    console.log('Seeding sample products...');

    // Create categories
    const electronics = await prisma.productCategory.upsert({
        where: { name: 'Electronics' },
        update: {},
        create: {
            name: 'Electronics',
            slug: 'electronics',
            description: 'Robotics electronics and components'
        }
    });

    const kits = await prisma.productCategory.upsert({
        where: { name: 'Robotics Kits' },
        update: {},
        create: {
            name: 'Robotics Kits',
            slug: 'robotics-kits',
            description: 'Educational robotics kits for all ages'
        }
    });

    const accessories = await prisma.productCategory.upsert({
        where: { name: 'Accessories' },
        update: {},
        create: {
            name: 'Accessories',
            slug: 'accessories',
            description: 'Tools and accessories'
        }
    });

    // Create products
    const products = [
        {
            name: 'Arduino Uno Starter Kit',
            description: 'Everything you need to start with Arduino programming and electronics.',
            price: 49.99,
            ageGroup: '10+ Ages',
            images: ['https://images.unsplash.com/photo-1553406830-ef2513450d76?w=800&q=80'],
            stock: 25,
            rating: 4.8,
            reviewsCount: 12,
            status: 'active',
            categoryId: kits.id,
            categoryName: kits.name,
            metadata: { originalPrice: 65.00 }
        },
        {
            name: 'Mini Programmable Drone',
            description: 'Learn drone flight and basic scratch programming with this lightweight drone.',
            price: 89.00,
            ageGroup: '12+ Ages',
            images: ['https://images.unsplash.com/photo-1508614589041-895b88991e3e?w=800&q=80'],
            stock: 15,
            rating: 4.5,
            reviewsCount: 8,
            status: 'active',
            categoryId: kits.id,
            categoryName: kits.name,
            metadata: { originalPrice: 110.00 }
        },
        {
            name: 'Raspberry Pi 4 Model B',
            description: 'High-performance 4GB RAM single-board computer for advanced robotics projects.',
            price: 55.00,
            ageGroup: '14+ Ages',
            images: ['https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&q=80'],
            stock: 10,
            rating: 4.9,
            reviewsCount: 24,
            status: 'active',
            categoryId: electronics.id,
            categoryName: electronics.name,
            metadata: { originalPrice: 60.00 }
        },
        {
            name: 'Lego Education Spike Prime Set',
            description: 'The essential STEAM learning tool for students in grades 6-8.',
            price: 329.95,
            ageGroup: '10+ Ages',
            images: ['https://images.unsplash.com/photo-1585366119957-e55b23ba3c77?w=800&q=80'],
            stock: 5,
            rating: 5.0,
            reviewsCount: 15,
            status: 'active',
            categoryId: kits.id,
            categoryName: kits.name,
            metadata: { originalPrice: 350.00 }
        },
        {
            name: 'Digital Multimeter',
            description: 'Precision measuring tool for electronics troubleshooting.',
            price: 24.50,
            ageGroup: 'All',
            images: ['https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=800&q=80'],
            stock: 30,
            rating: 4.6,
            reviewsCount: 10,
            status: 'active',
            categoryId: accessories.id,
            categoryName: accessories.name,
            metadata: { originalPrice: 30.00 }
        },
        {
            name: 'Humanoid Biped Robot Kit',
            description: 'Advanced 17 DOF humanoid robot kit with servo motors.',
            price: 450.00,
            ageGroup: '14+ Ages',
            images: ['https://images.unsplash.com/photo-1546776310-eef45dd6d63c?w=800&q=80'],
            stock: 3,
            rating: 4.7,
            reviewsCount: 5,
            status: 'active',
            categoryId: kits.id,
            categoryName: kits.name,
            metadata: { originalPrice: 500.00 }
        }
    ];

    for (const productData of products) {
        await prisma.product.create({
            data: productData
        });
    }

    console.log('✅ Seeding completed: 3 categories and 6 products added.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await pool.end();
    });
