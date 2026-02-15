const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const authMiddleware = require('../middleware/auth');

const prisma = new PrismaClient();

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
router.post('/', authMiddleware, upload.single('paymentProof'), async (req, res) => {
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
            totalAmount
        } = req.body;

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

        // Create order in database
        const order = await prisma.order.create({
            data: {
                userId: req.user.id,
                customerName,
                customerEmail,
                customerPhone,
                shippingAddress,
                shippingCity,
                shippingPostcode,
                shippingCountry: shippingCountry || 'United Kingdom',
                orderNotes: orderNotes || null,
                items: parsedItems,
                subtotal: parseFloat(subtotal),
                shipping: parseFloat(shipping),
                tax: parseFloat(tax),
                totalAmount: parseFloat(totalAmount),
                currency: 'GBP',
                status: 'pending',
                paymentType: 'bank_transfer',
                paymentProof: paymentProofUrl
            }
        });

        // TODO: Send confirmation email to customer
        // TODO: Send notification email to admin

        res.status(201).json({
            success: true,
            message: 'Order created successfully',
            order
        });
    } catch (error) {
        console.error('Create order error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to create order',
            error: error.message
        });
    }
});

// Get order by ID
router.get('/:id', authMiddleware, async (req, res) => {
    try {
        const { id } = req.params;

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

        // Check if user owns this order or is admin
        if (order.userId !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Access denied'
            });
        }

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
router.get('/', authMiddleware, async (req, res) => {
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
router.patch('/:id/status', authMiddleware, async (req, res) => {
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

        // TODO: Send status update email to customer

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

// Get all orders (admin only)
router.get('/admin/all', authMiddleware, async (req, res) => {
    try {
        // Check if user is admin
        if (req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Access denied. Admin only.'
            });
        }

        const { status, page = 1, limit = 20 } = req.query;
        const skip = (parseInt(page) - 1) * parseInt(limit);

        const where = {};
        if (status) {
            where.status = status;
        }

        const [orders, total] = await Promise.all([
            prisma.order.findMany({
                where,
                include: {
                    user: {
                        select: {
                            id: true,
                            firstName: true,
                            lastName: true,
                            email: true
                        }
                    }
                },
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
        console.error('Get all orders error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch orders',
            error: error.message
        });
    }
});

module.exports = router;
