import prisma from './config/db.js';

async function createGuestOrder() {
    try {
        console.log('Attempting to create guest order...');
        // Create a dummy order
        const order = await prisma.order.create({
            data: {
                userId: null, // Explicitly testing null user
                customerName: 'Test Guest',
                customerEmail: 'test@example.com',
                customerPhone: '1234567890',
                shippingAddress: '123 Test St',
                shippingCity: 'Test City',
                shippingPostcode: '12345',
                shippingCountry: 'Test Country',
                items: [],
                totalAmount: 100,
                currency: 'GBP',
                status: 'pending'
            }
        });
        console.log('SUCCESS: Guest order created with ID:', order.id);

        // Clean up
        await prisma.order.delete({ where: { id: order.id } });
        console.log('Cleaned up test order.');

    } catch (error) {
        console.error('FAILURE: Could not create guest order.');
        console.error(error);
    } finally {
        process.exit(0);
    }
}

createGuestOrder();
