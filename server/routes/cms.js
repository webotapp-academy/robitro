import express from 'express';
import prisma from '../config/db.js';

const router = express.Router();

// Get site setting by key
router.get('/settings/:key', async (req, res) => {
    try {
        const setting = await prisma.siteSetting.findUnique({
            where: { key: req.params.key }
        });
        if (!setting) {
            return res.status(404).json({ success: false, message: 'Setting not found' });
        }
        res.json({ success: true, data: setting });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Get site settings by group
router.get('/settings/group/:group', async (req, res) => {
    try {
        const settings = await prisma.siteSetting.findMany({
            where: { group: req.params.group }
        });
        res.json({ success: true, data: settings });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

export default router;
