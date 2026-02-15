import prisma from '../config/db.js';

export const createLead = async (req, res) => {
    try {
        const { name, email, phone, courseId, type } = req.body;
        console.log('Creating lead:', { name, email, phone, courseId, type });
        const lead = await prisma.lead.create({
            data: { name, email, phone, courseId, type }
        });
        res.status(201).json({ success: true, data: lead });
    } catch (error) {
        console.error('SERVER LEAD ERROR:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

export const createCallbackRequest = async (req, res) => {
    try {
        const { name, phone, preferredTime, courseId } = req.body;
        console.log('Creating callback:', { name, phone, preferredTime, courseId });
        const callback = await prisma.callbackRequest.create({
            data: { name, phone, preferredTime, courseId }
        });
        res.status(201).json({ success: true, data: callback });
    } catch (error) {
        console.error('SERVER CALLBACK ERROR:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};
