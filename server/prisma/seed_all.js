import prisma from '../config/db.js';

const courses = [
    {
        title: 'Robotics Foundation',
        description: 'Build your first robot! Learn motors, sensors, and basic programming to create moving machines.',
        category: 'Robotics',
        ageGroup: '6-8 years',
        price: 49,
        level: 'beginner',
        status: 'published',
        thumbnail: 'https://images.unsplash.com/photo-1561557944-6e7860d1a7eb?w=400&h=300&fit=crop',
        metadata: {
            duration: '8 weeks',
            sessions: 16,
            projects: 6,
            icon: '🤖',
            color: 'from-yellow-400 to-orange-500',
            features: ['Live Classes', 'Project Kit', 'Certificate'],
            discountValue: 30
        }
    },
    {
        title: 'AI & Machine Learning for Kids',
        description: 'Explore artificial intelligence! Create smart apps that can recognize images, speech, and more.',
        category: 'AI & ML',
        ageGroup: '9-12 years',
        price: 69,
        level: 'intermediate',
        status: 'published',
        thumbnail: 'https://images.unsplash.com/photo-1535378620166-273708d44e4c?w=400&h=300&fit=crop',
        metadata: {
            duration: '12 weeks',
            sessions: 24,
            projects: 8,
            icon: '🧠',
            color: 'from-purple-400 to-pink-500',
            features: ['Live Classes', 'AI Tools Access', 'Certificate'],
            discountValue: 30
        }
    },
    {
        title: 'Python Programming Mastery',
        description: 'Master Python from scratch! Build games, automate tasks, and create cool applications.',
        category: 'Coding',
        ageGroup: '9-12 years',
        price: 54,
        level: 'beginner',
        status: 'published',
        thumbnail: 'https://images.unsplash.com/photo-1553406830-ef2513450d76?w=400&h=300&fit=crop',
        metadata: {
            duration: '10 weeks',
            sessions: 20,
            projects: 10,
            icon: '💻',
            color: 'from-blue-400 to-cyan-500',
            features: ['Live Classes', 'Coding Platform', 'Certificate'],
            discountValue: 30
        }
    },
    {
        title: 'Electronics & Circuits',
        description: 'Understand how electronics work! Build circuits, LED projects, and sensor-based gadgets.',
        category: 'Electronics',
        ageGroup: '9-12 years',
        price: 44,
        level: 'beginner',
        status: 'published',
        thumbnail: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&h=300&fit=crop',
        metadata: {
            duration: '8 weeks',
            sessions: 16,
            projects: 8,
            icon: '⚡',
            color: 'from-orange-400 to-red-500',
            features: ['Live Classes', 'Component Kit', 'Certificate'],
            discountValue: 25
        }
    },
    {
        title: 'Game Development with Scratch',
        description: 'Create your own video games! Learn game design, animations, and interactive storytelling.',
        category: 'Game Dev',
        ageGroup: '6-8 years',
        price: 39,
        level: 'beginner',
        status: 'published',
        thumbnail: 'https://images.unsplash.com/photo-1553481187-be93c21490a9?w=400&h=300&fit=crop',
        metadata: {
            duration: '6 weeks',
            sessions: 12,
            projects: 5,
            icon: '🎮',
            color: 'from-green-400 to-teal-500',
            features: ['Live Classes', 'Game Assets', 'Certificate'],
            discountValue: 20
        }
    },
    {
        title: 'Advanced Robotics & Arduino',
        description: 'Take robotics to the next level! Program Arduino boards and build autonomous robots.',
        category: 'Robotics',
        ageGroup: '13-16 years',
        price: 89,
        level: 'advanced',
        status: 'published',
        thumbnail: 'https://images.unsplash.com/photo-1561141286-a36fd5da04b5?w=400&h=300&fit=crop',
        metadata: {
            duration: '16 weeks',
            sessions: 32,
            projects: 12,
            icon: '🔧',
            color: 'from-teal-400 to-blue-500',
            features: ['Live Classes', 'Arduino Kit', 'Certificate'],
            discountValue: 40
        }
    },
    {
        title: 'Web Development Bootcamp',
        description: 'Build amazing websites! Learn HTML, CSS, JavaScript, and create your own portfolio.',
        category: 'Coding',
        ageGroup: '13-16 years',
        price: 64,
        level: 'intermediate',
        status: 'published',
        thumbnail: 'https://images.unsplash.com/photo-1547658719-da2b51169166?w=400&h=300&fit=crop',
        metadata: {
            duration: '12 weeks',
            sessions: 24,
            projects: 8,
            icon: '🌐',
            color: 'from-indigo-400 to-purple-500',
            features: ['Live Classes', 'Hosting Credit', 'Certificate'],
            discountValue: 30
        }
    },
    {
        title: 'IoT & Smart Home Projects',
        description: 'Connect devices to the internet! Build smart home gadgets and wearable technology.',
        category: 'Electronics',
        ageGroup: '13-16 years',
        price: 74,
        level: 'intermediate',
        status: 'published',
        thumbnail: 'https://images.unsplash.com/photo-1558346490-a72e53ae2d4f?w=400&h=300&fit=crop',
        metadata: {
            duration: '10 weeks',
            sessions: 20,
            projects: 6,
            icon: '📡',
            color: 'from-cyan-400 to-blue-500',
            features: ['Live Classes', 'IoT Kit', 'Certificate'],
            discountValue: 35
        }
    },
    {
        title: 'Unity Game Development',
        description: 'Create 3D games with Unity! Learn C# programming and professional game development.',
        category: 'Game Dev',
        ageGroup: '13-16 years',
        price: 99,
        level: 'advanced',
        status: 'published',
        thumbnail: 'https://images.unsplash.com/photo-1551033406-611cf9a28f67?w=400&h=300&fit=crop',
        metadata: {
            duration: '16 weeks',
            sessions: 32,
            projects: 4,
            icon: '🎯',
            color: 'from-rose-400 to-pink-500',
            features: ['Live Classes', 'Unity Pro', 'Certificate'],
            discountValue: 50
        }
    }
];

const products = [
    {
        name: 'Robitro MEX DIY Robotics Advanced Kit 2.0',
        description: 'Build Hundreds of Robots like Steering Car, Line follower, Robotic Arm, Humanoid & more!',
        category: 'Robotics',
        price: 125,
        ageGroup: '10+ Ages',
        stock: 15,
        status: 'active',
        images: ['https://images.unsplash.com/photo-1561557944-6e7860d1a7eb?w=400&h=400&fit=crop'],
        specifications: { parts: '300+', control: 'App Control', ai: 'AI Ready' },
        metadata: {
            originalPrice: 130,
            badge: 'Best Seller',
            features: ['300+ Parts', 'App Control', 'AI Ready'],
            reviews: 324
        }
    },
    {
        name: 'Robitro Arduino Ultimate Pack',
        description: 'Everything you need to master Arduino. Includes board, sensors, LEDs, and more.',
        category: 'Arduino',
        price: 40,
        ageGroup: '12+ Ages',
        stock: 22,
        status: 'active',
        images: ['https://images.unsplash.com/photo-1553406830-ef2513450d76?w=400&h=400&fit=crop'],
        specifications: { board: 'Arduino Uno R3', parts: '40+ Components', course: 'Online Course included' },
        metadata: {
            originalPrice: 60,
            badge: 'Popular',
            features: ['Arduino Uno R3', '40+ Components', 'Online Course'],
            reviews: 256
        }
    },
    {
        name: 'Robitro AI Learning Board',
        description: 'Hands-on AI experiments with image recognition, voice control, and ML projects.',
        category: 'AI & ML',
        price: 70,
        ageGroup: '14+ Ages',
        stock: 8,
        status: 'active',
        images: ['https://images.unsplash.com/photo-1535378620166-273708d44e4c?w=400&h=400&fit=crop'],
        specifications: { camera: 'AI Camera', module: 'Voice Module', guide: 'Python Guide' },
        metadata: {
            originalPrice: 100,
            badge: 'New',
            features: ['AI Camera', 'Voice Module', 'Python Guide'],
            reviews: 178
        }
    },
    {
        name: 'Robitro Drone Building Kit',
        description: 'Build and program your own quadcopter drone. Learn aerodynamics and flight control.',
        category: 'Drones',
        price: 90,
        ageGroup: '14+ Ages',
        stock: 5,
        status: 'active',
        images: ['https://images.unsplash.com/photo-1508614589041-895b88991e3e?w=400&h=400&fit=crop'],
        metadata: {
            originalPrice: 130,
            badge: 'Premium',
            features: ['Flight Controller', 'Motors & Props', 'Remote Control'],
            reviews: 145
        }
    },
    {
        name: 'Robitro Electronics Explorer Kit',
        description: 'Learn electronics from scratch! Build circuits, understand components, and create LED projects.',
        category: 'Electronics',
        price: 25,
        ageGroup: '8+ Ages',
        stock: 30,
        status: 'active',
        images: ['https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&h=400&fit=crop'],
        metadata: {
            originalPrice: 40,
            badge: 'Value Pack',
            features: ['Breadboard', 'LED Pack', 'Resistor Kit'],
            reviews: 289
        }
    },
    {
        name: 'Robitro IoT Smart Home Kit',
        description: 'Create connected devices! Build smart lights, sensors, and home automation projects.',
        category: 'Electronics',
        price: 50,
        ageGroup: '12+ Ages',
        stock: 12,
        status: 'active',
        images: ['https://images.unsplash.com/photo-1558002038-1055907df827?w=400&h=400&fit=crop'],
        metadata: {
            originalPrice: 80,
            badge: '',
            features: ['WiFi Module', 'Sensors Pack', 'Mobile App'],
            reviews: 167
        }
    },
    {
        name: 'Robitro Coding Robot Buddy',
        description: 'Adorable programmable robot for young coders. Learn logic and sequences through play.',
        category: 'Robotics',
        price: 35,
        ageGroup: '5+ Ages',
        stock: 18,
        status: 'active',
        images: ['https://images.unsplash.com/photo-1535378917042-10a22c95931a?w=400&h=400&fit=crop'],
        metadata: {
            originalPrice: 50,
            badge: 'Kids Favorite',
            features: ['Block Coding', 'Color Sensors', 'Music & Sounds'],
            reviews: 412
        }
    },
    {
        name: 'Robitro Solar Power Kit',
        description: 'Build solar-powered projects! Learn renewable energy and eco-friendly technology.',
        category: 'Solar',
        price: 20,
        ageGroup: '8+ Ages',
        stock: 25,
        status: 'active',
        images: ['https://images.unsplash.com/photo-1509391366360-2e959784a276?w=400&h=400&fit=crop'],
        metadata: {
            originalPrice: 30,
            badge: 'Eco-Friendly',
            features: ['Solar Panels', 'Motor Kit', 'Project Cards'],
            reviews: 98
        }
    },
    {
        name: 'Robitro Sensor Mega Pack',
        description: '30+ sensors for all your projects! Temperature, motion, sound, light, and more.',
        category: 'Arduino',
        price: 15,
        ageGroup: '12+ Ages',
        stock: 40,
        status: 'active',
        images: ['https://images.unsplash.com/photo-1562408590-e32931084e23?w=400&h=400&fit=crop'],
        metadata: {
            originalPrice: 25,
            badge: 'Bundle',
            features: ['30+ Sensors', 'Jumper Wires', 'Code Examples'],
            reviews: 234
        }
    }
];

async function main() {
    console.log('Starting seeding...');

    try {
        const admin = await prisma.user.findFirst({ where: { role: 'admin' } });
        if (!admin) {
            throw new Error('No admin user found. Create one first.');
        }

        const partner = await prisma.partner.findFirst();
        const partnerId = partner ? partner.id : null;

        for (const courseData of courses) {
            const existing = await prisma.course.findFirst({ where: { title: courseData.title } });
            if (!existing) {
                await prisma.course.create({
                    data: {
                        ...courseData,
                        instructorId: admin.id,
                        partnerId: partnerId
                    }
                });
                console.log(`Course created: ${courseData.title}`);
            } else {
                await prisma.course.update({
                    where: { id: existing.id },
                    data: courseData
                });
                console.log(`Course updated: ${courseData.title}`);
            }
        }

        for (const productData of products) {
            const existing = await prisma.product.findFirst({ where: { name: productData.name } });
            if (!existing) {
                await prisma.product.create({
                    data: {
                        ...productData,
                        partnerId: partnerId
                    }
                });
                console.log(`Product created: ${productData.name}`);
            } else {
                await prisma.product.update({
                    where: { id: existing.id },
                    data: productData
                });
                console.log(`Product updated: ${productData.name}`);
            }
        }

        console.log('Seeding finished successfully.');
    } catch (error) {
        console.error('Seeding failed:', error);
        throw error;
    }
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
