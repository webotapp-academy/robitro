import 'dotenv/config';
import pg from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';
import bcryptjs from 'bcryptjs';

const connectionString = process.env.DATABASE_URL;
const pool = new pg.Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
    console.log('Seeding global sample data...');

    // 1. Ensure Admin Exists
    const adminEmail = 'admin@robitro.com';
    let admin = await prisma.user.findUnique({ where: { email: adminEmail } });

    if (!admin) {
        console.log('Creating admin user...');
        const salt = await bcryptjs.genSalt(10);
        const hashedPassword = await bcryptjs.hash('admin123', salt);
        admin = await prisma.user.create({
            data: {
                firstName: 'System',
                lastName: 'Admin',
                email: adminEmail,
                password: hashedPassword,
                role: 'admin',
                status: 'active',
                isVerified: true,
            },
        });
    }

    // 2. Ensure Test User Exists
    const userEmail = 'test@robitro.com';
    let testUser = await prisma.user.findUnique({ where: { email: userEmail } });

    if (!testUser) {
        console.log('Creating test user...');
        const salt = await bcryptjs.genSalt(10);
        const hashedPassword = await bcryptjs.hash('password123', salt);
        testUser = await prisma.user.create({
            data: {
                firstName: 'Test',
                lastName: 'User',
                email: userEmail,
                password: hashedPassword,
                role: 'student',
                status: 'active',
                isVerified: true,
            },
        });
    }

    // 3. Seed Hero Section
    await prisma.heroSection.upsert({
        where: { id: 'home-hero' },
        update: {},
        create: {
            id: 'home-hero',
            page: 'home',
            title: 'Master the Future with Robotics',
            subtitle: 'Join the next generation of innovators with our hands-on robotics courses and kits.',
            ctaText: 'Explore Courses',
            ctaLink: '/courses',
            badgeText: 'New: AI & Robotics 2024',
            isActive: true
        }
    });

    // 4. Seed Feature Cards
    const features = [
        {
            icon: 'Robot',
            title: 'Hands-on Learning',
            description: 'Build real robots from day one with our expert-led guidance.',
            gradient: 'bg-gradient-to-br from-blue-500 to-cyan-500',
            displayOrder: 1
        },
        {
            icon: 'Code',
            title: 'Coding Foundations',
            description: 'Learn C++, Python, and Arduino IDE to bring your creations to life.',
            gradient: 'bg-gradient-to-br from-purple-500 to-pink-500',
            displayOrder: 2
        },
        {
            icon: 'Users',
            title: 'Community Access',
            description: 'Join thousands of young makers and share your projects.',
            gradient: 'bg-gradient-to-br from-orange-500 to-yellow-500',
            displayOrder: 3
        }
    ];

    for (const feature of features) {
        const exists = await prisma.featureCard.findFirst({ where: { title: feature.title } });
        if (!exists) {
            await prisma.featureCard.create({ data: feature });
        }
    }

    // 5. Seed Courses with metadata
    const courses = [
        {
            title: 'Introduction to Arduino',
            description: 'Start your journey into the world of electronics and microcontrollers.',
            ageGroup: '10+ Ages',
            level: 'beginner',
            price: 29.99,
            category: 'Electronics',
            status: 'published',
            instructorId: admin.id,
            thumbnail: 'https://images.unsplash.com/photo-1553406830-ef2513450d76?w=800&q=80',
            metadata: {
                color: 'from-blue-500 to-cyan-500',
                icon: '🔌',
                duration: '4 weeks',
                sessions: 8,
                features: ['Hardware Kit Included', 'Certificate', 'Lifetime Access']
            }
        },
        {
            title: 'Advanced Drone Building',
            description: 'Learn to build and program a fully functional racing drone.',
            ageGroup: '14+ Ages',
            level: 'advanced',
            price: 99.00,
            category: 'Drones',
            status: 'published',
            instructorId: admin.id,
            thumbnail: 'https://images.unsplash.com/photo-1508614589041-895b88991e3e?w=800&q=80',
            metadata: {
                color: 'from-purple-500 to-pink-500',
                icon: '🚁',
                duration: '6 weeks',
                sessions: 12,
                features: ['Drone Kit Included', 'Flight Training', 'Competition Entry']
            }
        },
        {
            title: 'Python for Robotics',
            description: 'Master Python programming specifically for robotic control systems.',
            ageGroup: '12+ Ages',
            level: 'intermediate',
            price: 45.00,
            category: 'Programming',
            status: 'published',
            instructorId: admin.id,
            thumbnail: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&q=80',
            metadata: {
                color: 'from-green-500 to-emerald-500',
                icon: '🐍',
                duration: '5 weeks',
                sessions: 10,
                features: ['Live Coding', 'Project Review', 'GitHub Portfolio']
            }
        }
    ];

    for (const course of courses) {
        const exists = await prisma.course.findFirst({ where: { title: course.title } });
        if (exists) {
            // Update metadata if exists
            await prisma.course.update({
                where: { id: exists.id },
                data: { metadata: course.metadata }
            });
        } else {
            await prisma.course.create({ data: course });
        }
    }

    console.log('✅ Global seeding completed: Users, Hero, Features, and Courses (with metadata) added.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await pool.end();
    });
