import express from 'express';
import userController from '../controllers/userController.js';

const router = express.Router();

// Create user (signup)
router.post('/signup', userController.createUser);

// Verify user (login)
router.post('/login', userController.verifyUser, (req, res) => {
    return res.status(200).json(res.locals.user)
});

// Get user's saved jobs
router.get('/saved-jobs', userController.getSavedJobs);

//update user profile
router.put('/profile', userController.updateProfile);
router.get('/profile', userController.getProfile);
router.post('/saved-jobs/:jobId', userController.addSavedJob);
router.delete('/saved-jobs/:jobId', userController.removeSavedJob);
router.put('/resume/update', userController.updateResume);

// logout route
router.post('/logout', userController.logout);

export default router;

