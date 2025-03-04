import express from 'express';
import userController from '../controllers/userController.js';

const router = express.Router();

// Signup route
router.post('/signup', userController.signup);

// Login route
router.post('/login', userController.login);

// Signout route
router.post('/signout', userController.signout);

// Get user information
router.get('/profile', userController.getUserInfo);

// Get user's saved jobs
router.get('/saved-jobs', userController.getSavedJobs);



export default router;