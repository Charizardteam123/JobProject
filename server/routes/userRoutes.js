import express from 'express';
import userController from '../controllers/userController.js';

const router = express.Router();

// Create user (signup)
router.post('/signup', userController.createUser);

// Verify user (login)
router.post('/login', userController.verifyUser);

// Get user's saved jobs
router.get('/saved-jobs', userController.getSavedJobs);

export default router;