import mongoose from 'mongoose';
import Job from '../models/jobModel.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function seedJobs() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Read mock data
    const mockDataPath = path.join(__dirname, '../../mock_data.json');
    const mockData = JSON.parse(fs.readFileSync(mockDataPath, 'utf-8'));

    // Take first 3 jobs and format them according to our schema
    const jobsToSeed = mockData.slice(0, 3).map(job => ({
      jobId: job.id || `JOB${Math.random().toString(36).substr(2, 9)}`,
      title: job.title || job.job_title,
      company: job.company || job.company_name,
      location: job.location || job.job_location,
      description: job.description || job.job_description,
      url: job.url || job.job_link,
      savedAt: new Date()
    }));

    // Clear existing jobs
    await Job.deleteMany({});
    console.log('Cleared existing jobs');

    // Insert jobs
    const jobs = await Job.insertMany(jobsToSeed);
    console.log('Seeded jobs:', jobs);

    console.log('Seeding completed successfully');
  } catch (error) {
    console.error('Error seeding data:', error);
  } finally {
    mongoose.disconnect();
  }
}

seedJobs();