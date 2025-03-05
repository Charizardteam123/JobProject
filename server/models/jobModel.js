import mongoose from "mongoose";

const jobSchema = new mongoose.Schema({
  jobId: { type: String, required: true }, 
  title: { type: String, required: true },
  company: { type: String, required: true },
  category: { type: String },
  location: { type: String },
  level: { type: String },
  description: { type: String },
  url: { type: String },
  savedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  savedAt: { type: Date, default: Date.now },
});

const Job = mongoose.model("Job", jobSchema);
export default Job;
