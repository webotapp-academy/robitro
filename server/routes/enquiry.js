import express from 'express';
import { createLead, createCallbackRequest } from '../controllers/enquiryController.js';

const router = express.Router();

router.post('/lead', createLead);
router.post('/callback', createCallbackRequest);

export default router;
