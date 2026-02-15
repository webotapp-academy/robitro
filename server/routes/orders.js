import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import jwt from 'jsonwebtoken';
import { config } from '../config/database.js';
import prisma from '../config/db.js';
import { protect } from '../middleware/auth.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = path.join(__dirname, '../uploads/payment-proofs');
        // Create directory if it doesn't exist
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, 'payment-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
    fileFilter: (req, file, cb) => {
        const allowedTypes = /jpeg|jpg|png|gif/;
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype);

        if (extname && mimetype) {
            return cb(null, true);
        } else {
            cb(new Error('Only image files are allowed'));
        }
    }
});

// Create new order
router.post('/', upload.single('paymentProof'), async (req, res) => {
    try {
        const {
            customerName,
            customerEmail,
            customerPhone,
            shippingAddress,
            shippingCity,
            shippingPostcode,
            shippingCountry,
            orderNotes,
            items,
            subtotal,
            shipping,
            tax,
            totalAmount,
            transactionNumber
        } = req.body;

        console.log('Order request body:', req.body);
        console.log('Uploaded file:', req.file);

        // Check for token and verify user if present
        let userId = null;
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            try {
                const token = req.headers.authorization.split(' ')[1];
                const decoded = jwt.verify(token, config.jwtSecret);
                const userExists = await prisma.user.findUnique({ where: { id: decoded.id } });
                if (userExists) {
                    userId = userExists.id;
                }
            } catch (err) {
                console.warn('Invalid token provided for order, proceeding as guest:', err.message);
            }
        }

        // Validate required fields
        if (!customerName || !customerEmail || !customerPhone ||
            !shippingAddress || !shippingCity || !shippingPostcode ||
            !items || !totalAmount) {
            return res.status(400).json({
                success: false,
                message: 'Missing required fields'
            });
        }

        // Parse items if it's a string
        const parsedItems = typeof items === 'string' ? JSON.parse(items) : items;

        // Get payment proof URL
        const paymentProofUrl = req.file ? `/uploads/payment-proofs/${req.file.filename}` : null;

        const order = await prisma.order.create({
            data: {
                userId: userId, // Can be null for guest checkout
                customerName,
                customerEmail,
                customerPhone,
                shippingAddress,
                shippingCity,
                shippingPostcode,
                shippingCountry: shippingCountry || 'United Kingdom',
                orderNotes: orderNotes || null,
                items: parsedItems,
                subtotal: parseFloat(subtotal) || 0,
                shipping: parseFloat(shipping) || 0,
                tax: parseFloat(tax) || 0,
                totalAmount: parseFloat(totalAmount) || 0,
                currency: 'GBP',
                status: 'pending',
                paymentType: 'bank_transfer',
                paymentProof: paymentProofUrl,
                transactionNumber: transactionNumber || null
            }
        });

        res.status(201).json({
            success: true,
            message: 'Order created successfully',
            order
        });
    } catch (error) {
        console.error('Detailed Create order error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to create order: ' + error.message,
            error: error.stack
        });
    }

});

// Get order by ID
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        // Check auth if token provided
        let user = null;
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            try {
                const token = req.headers.authorization.split(' ')[1];
                const decoded = jwt.verify(token, config.jwtSecret);
                user = await prisma.user.findUnique({ where: { id: decoded.id } });
            } catch (err) {
                // Invalid token, treat as guest
            }
        }

        const order = await prisma.order.findUnique({
            where: { id },
            include: {
                user: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        email: true
                    }
                }
            }
        });

        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }

        // Access Control Logic
        if (order.userId) {
            // If order belongs to a user, requester MUST be that user or admin
            if (!user || (order.userId !== user.id && user.role !== 'admin')) {
                return res.status(403).json({
                    success: false,
                    message: 'Access denied'
                });
            }
        }
        // If order.userId is null (guest order), allow access (UUID is the secret)

        res.json({
            success: true,
            order
        });
    } catch (error) {
        console.error('Get order error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch order',
            error: error.message
        });
    }
});

// Get all orders for current user
router.get('/', protect, async (req, res) => {
    try {
        const { status, page = 1, limit = 10 } = req.query;
        const skip = (parseInt(page) - 1) * parseInt(limit);

        const where = {
            userId: req.user.id
        };

        if (status) {
            where.status = status;
        }

        const [orders, total] = await Promise.all([
            prisma.order.findMany({
                where,
                orderBy: { createdAt: 'desc' },
                skip,
                take: parseInt(limit)
            }),
            prisma.order.count({ where })
        ]);

        res.json({
            success: true,
            orders,
            pagination: {
                total,
                page: parseInt(page),
                limit: parseInt(limit),
                pages: Math.ceil(total / parseInt(limit))
            }
        });
    } catch (error) {
        console.error('Get orders error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch orders',
            error: error.message
        });
    }
});

// Update order status (admin only)
router.patch('/:id/status', protect, async (req, res) => {
    try {
        // Check if user is admin
        if (req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Access denied. Admin only.'
            });
        }

        const { id } = req.params;
        const { status, trackingNumber } = req.body;

        const updateData = { status };
        if (trackingNumber) {
            updateData.trackingNumber = trackingNumber;
        }

        const order = await prisma.order.update({
            where: { id },
            data: updateData
        });

        res.json({
            success: true,
            message: 'Order status updated',
            order
        });
    } catch (error) {
        console.error('Update order status error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update order status',
            error: error.message
        });
    }
});

export default router;
