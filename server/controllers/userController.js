import User from '../models/userModel.js';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
dotenv.config();

const userController = {};

userController.createUser = async (req, res, next) => {
  // extracts email and password from the request body
  const { username, email, password } = req.body;
  // if missing an email or password return
  if (!username || !email || !password) {
    console.error('Missing properties in the request body');
    // calls next() with an error message
    return next({
      log: 'Missing required properties in the request body',
      status: 400,
      message: 'Missing: password or email',
    });
  }
  try {
    // searches the database for a user with the given email
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      console.error(`User already exists ${email}`);
      return res.status(409).json({ error: 'Email already exists' });
    }

    const existingUsername = await User.findOne({ username });
    if (existingUsername) {
      console.error(`User already exists ${username}`);
      return res.status(409).json({ error: 'Username already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ 
      username,
      email,
      password: hashedPassword 
    });
    // saves the new user to mongodb
    await user.save();
    // stores created user in res.locals
    res.locals.user = { id: user._id, email: user.email, username: user.username };
    return res
      .status(201)
      .json({ message: 'User created successfully', user: res.locals.user });
  } catch (error) {
    next(error);
  }
};

userController.verifyUser = async (req, res, next) => {
  console.log("log in triggered")
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }
  try {
    // find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    // compare the entered password with the stored hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    // store data in res.locals
    res.locals.user = { id: user._id, email: user.email, username: user.username };
    console.log('response', res.locals.user);
    next();
  } catch (error) {
    console.error('Error during login:', error);
    next(error);
  }
};


userController.getSavedJobs = async (req, res) => {
  try {
    const userId = req.user.id; // From auth middleware
    const user = await User.findById(userId)
      .populate('savedJobs') // This will populate the saved jobs data
      .select('savedJobs');

    res.status(200).json({
      savedJobs: user.savedJobs,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
// add text-based resume
userController.updateResume = async(req, res, next) => {
  const { resume } = req.body;
  const userId = req.user.id;
  if(!resume) {
    return res.status(400).json({ error: 'Resume content is required' });
  } 
  try {
    // find userId and update the resume property
  const updatedUser = await User.findByIdAndUpdate( userId, { resume }, {new: true, select: 'resume' });
  // if there is no user by that userId then return an error
  if (!updatedUser) {
    return res.status(404).json({ error: 'User not found' });
  }
  res.status(200).json({
    message: 'Resume stored successfully',
    resume: updatedUser.resume
  });
  } catch(error) {
    next(error);
  }
};
// Update user profile (including resume)
userController.updateProfile = async (req, res, next) => {
  try {
    const { resume } = req.body;
    const userId = req.user.id; // Assuming you'll have auth middleware setting this

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { resume },
      { new: true, select: '-password' } // Return updated user, exclude password
    );

    if (!updatedUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json({
      message: 'Profile updated successfully',
      user: updatedUser
    });
  } catch (error) {
    next(error);
  }
};

// Add a job to user's saved jobs
userController.addSavedJob = async (req, res, next) => {
  try {
    const { jobId } = req.body;
    const userId = req.user.id; // From auth middleware

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Check if job is already saved
    if (user.savedJobs.includes(jobId)) {
      return res.status(400).json({ error: 'Job already saved' });
    }

    user.savedJobs.push(jobId);
    await user.save();

    res.status(200).json({
      message: 'Job saved successfully',
      savedJobs: user.savedJobs
    });
  } catch (error) {
    next(error);
  }
};

// Remove a job from user's saved jobs
userController.removeSavedJob = async (req, res, next) => {
  try {
    const { jobId } = req.params;
    const userId = req.user.id; // From auth middleware

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    user.savedJobs = user.savedJobs.filter(id => id.toString() !== jobId);
    await user.save();

    res.status(200).json({
      message: 'Job removed successfully',
      savedJobs: user.savedJobs
    });
  } catch (error) {
    next(error);
  }
};

// Get user profile (including resume)
userController.getProfile = async (req, res, next) => {
  try {
    const userId = req.user.id; // From auth middleware
    const user = await User.findById(userId)
      .select('-password')
      .populate('savedJobs');

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json({
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        resume: user.resume,
        savedJobs: user.savedJobs,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    next(error);
  }
};

userController.logout = async (req, res) => {
  try {
    // Clear user session data if needed
    res.status(200).json({ 
      success: true, 
      message: 'Logged out successfully' 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Error during logout' 
    });
  }
};

export default userController;