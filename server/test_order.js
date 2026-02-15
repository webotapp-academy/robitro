import 'dotenv/config';
import pg from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';

const connectionString = process.env.DATABASE_URL;
const pool = new pg.Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
    console.log('Testing Order Creation...');

    const userEmail = 'test@robitro.com';
    const user = await prisma.user.findUnique({ where: { email: userEmail } });

    if (!user) {
        console.error('Test user not found! run seed_global_data.js first.');
        return;
    }

    try {
        const order = await prisma.order.create({
            data: {
                userId: user.id,
                customerName: 'Test Customer',
                customerEmail: 'test@robitro.com',
                customerPhone: '1234567890',
                shippingAddress: '123 Test St',
                shippingCity: 'Test City',
                shippingPostcode: '12345',
                shippingCountry: 'United Kingdom',
                items: [{ id: 'test-product', name: 'Test Product', price: 10, quantity: 1 }],
                subtotal: 10,
                shipping: 0,
                tax: 0,
                totalAmount: 10,
                currency: 'GBP',
                status: 'pending',
                paymentType: 'bank_transfer'
            }
        });
        console.log('✅ Order created successfully:', order.id);
    } catch (error) {
        console.error('❌ Failed to create order:', error.message);
    }
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await pool.end();
    });
