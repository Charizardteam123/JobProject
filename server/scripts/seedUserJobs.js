import mongoose from 'mongoose';
import User from '../models/userModel.js';
import Job from '../models/jobModel.js';
import dotenv from 'dotenv';

dotenv.config();

async function seedUserJobs() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Find the test user using the exact email from your database
    const userEmail = "testuser1@example.com"; // This is the email from your screenshot
    const user = await User.findOne({ email: userEmail });
    
    if (!user) {
      console.error('User not found with email:', userEmail);
      return;
    }

    console.log('Found user:', user.username);

    // Get the 3 seeded jobs
    const jobs = await Job.find().limit(3);
    
    if (jobs.length === 0) {
      console.error('No jobs found');
      return;
    }

    console.log('Found jobs:', jobs.length);

    // Add job IDs to user's savedJobs array
    user.savedJobs = jobs.map(job => job._id);
    
    // Save the updated user
    await user.save();

    // Also update the jobs' savedBy arrays to include this user
    await Promise.all(jobs.map(job => 
      Job.findByIdAndUpdate(job._id, {
        $addToSet: { savedBy: user._id }
      })
    ));

    // Fetch and display the updated user with populated jobs
    const updatedUser = await User.findById(user._id).populate('savedJobs');
    
    console.log('Successfully added jobs to user:', {
      username: updatedUser.username,
      email: updatedUser.email,
      savedJobs: updatedUser.savedJobs.map(job => ({
        title: job.title,
        company: job.company,
        jobId: job.jobId
      }))
    });

  } catch (error) {
    console.error('Error seeding user jobs:', error);
  } finally {
    mongoose.disconnect();
  }
}

seedUserJobs();