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
    const adminEmail = 'admin@robitro.com';
    const existingAdmin = await prisma.user.findUnique({
        where: { email: adminEmail },
    });

    if (existingAdmin) {
        console.log('Admin user already exists.');
        return;
    }

    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash('admin123', salt);

    await prisma.user.create({
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

    console.log('✅ Admin user created:');
    console.log('Email: admin@robitro.com');
    console.log('Password: admin123');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await pool.end();
    });
