//in this file we will define the express app
//we will also define the middleware and the routes
import express from 'express';
import dotenv from 'dotenv';
import userRoutes from './routes/userRoutes.js';
import jobRoutes from './routes/jobRoutes.js';
import aiRoutes from './routes/aiRoutes.js';
import { errorHandler } from './middleware/errorHandler.js';


dotenv.config();

// Initializing the app
const app = express();

// global middleware for parsing json
app.use(express.json());

//mounting the routes
app.use("/api/users", userRoutes);
app.use("/api/jobs", jobRoutes);
app.use('/api/ai', aiRoutes);

// Add error handling middleware
app.use(errorHandler);

export default app;

