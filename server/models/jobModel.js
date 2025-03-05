import mongoose from "mongoose";

const jobSchema = new mongoose.Schema({
  jobId: { type: String, required: true }, // ID from third-party API?
  title: { type: String, required: true },
  company: { type: String, required: true },
  location: { type: String },
  description: { type: String },
  salary: { type: String },
  url: { type: String },
  savedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  savedAt: { type: Date, default: Date.now },
});

const Job = mongoose.model("Job", jobSchema);
export default Job;
