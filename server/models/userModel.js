import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    savedJobs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Job' }], 
    resume: { type: String, default: '' },
    createdAt: { type: Date, default: Date.now }
    //user resume:
});

const User = mongoose.model('User', userSchema);
export default User;