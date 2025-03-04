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
    const user = new User({ email, password: hashedPassword });
    // saves the new user to mongodb
    await user.save();
    // stores created user in res.locals
    res.locals.user = { id: user._id, email: user.email };
    return res
      .status(201)
      .json({ message: 'User created successfully', user: res.locals.user });
  } catch (error) {
    next(error);
  }
};

userController.verifyUser = async (req, res, next) => {
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
    res.locals.user = { id: user._id, email: user.email };
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

export default userController;