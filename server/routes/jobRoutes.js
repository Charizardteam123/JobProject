import express from 'express';
import jobController from '../controllers/jobController.js';

const router = express.Router();

// Job routes
router.get('/', jobController.getAllJobs);
router.get('/:id', jobController.getJob);
router.post('/save', jobController.saveJob);

export default router;