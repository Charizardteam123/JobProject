import Job from '../models/jobModel.js';
import User from '../models/userModel.js';

///receive data from the ai controller...
const jobController = {
  getAllJobs: async (req, res) => {
    try {
      // Implementation to fetch jobs from third-party API
      res.status(200).json({ message: 'Get all jobs' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  getJob: async (req, res) => {
    try {
      const { id } = req.params;
      // Implementation to get specific job from third-party API
      res.status(200).json({ message: `Get job with ID: ${id}` });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

//   saveJob: async (req, res) => {
//     try {
//       const { userId, jobId } = req.body;
//       // Implementation to save job to user's saved/favorite jobs
//       if (!userId || !jobId) {
//         return res
//           .status(400)
//           .json({ error: 'User ID and Job ID are required' });
//       }
//       // check if user exists
//       const user = await User.findById(userId);
//       if (!user) {
//         return res.status(404).json({ error: 'User not found' });
//       }
//       // check if job exists
//       const job = await Job.findById(jobId);
//       if (!job) {
//         return res.status(404).json({ error: 'Job not found' });
//       }

//       // check if job is already saved
//       if (user.savedJobs.includes(jobId)) {
//         return res.status(400).json({ error: 'Job is already saved' });
//       }

//       // save job to user's profile
//       user.savedJobs.push(jobId);
//       await user.save();

//       return res.status(200).json({
//         message: 'Job saved successfully',
//         data: { userId, jobId },
//       });
//     } catch (error) {
//       res.status(500).json({ error: error.message });
//     }
//   },

  deleteJob: async (req, res) => {
    const { userId, jobId } = req.body;
    if (!userId || !jobId) {
      return res.status(400).json({ error: 'User ID and Job ID are required' });
    }
    try {
      // find user by userId
      const user = await User.findById(userId);
      // if user doesn't exist return error
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      // if savedJob id doesn't exist on user object return error
      if (!user.savedJobs.includes(jobId)) {
        return res.status(400).json({ error: 'Job is not saved' });
      }

      user.savedJobs = user.savedJobs.filter(
        (savedJob) => savedJob.toString() !== jobId
      );
      await user.save();
      return res.status(200).json({
        message: 'Job removed successfully',
        savedJobs: user.savedJobs,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
};

export default jobController;
