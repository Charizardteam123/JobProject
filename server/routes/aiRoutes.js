import express from 'express';
import aiController from '../controllers/aiController.js';

const router = express.Router();

// Route for submitting resume and query
router.post('/submit-resume-query', aiController.handleResumeQuery);

export default router; 