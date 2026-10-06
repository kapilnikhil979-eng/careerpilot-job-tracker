/* eslint-disable no-undef */

const Job = require("../models/Job");

// ======================
// CREATE JOB
// ======================
const createJob = async (req, res) => {
  try {
    console.log("Received Job Data:", req.body);

    const newJob = new Job(req.body);

    const savedJob = await newJob.save();

    console.log("Job Saved Successfully:", savedJob);

    res.status(201).json(savedJob);
  } catch (error) {
    console.error("CREATE JOB ERROR:", error);

    res.status(500).json({
      message: "Failed to create job",
      error: error.message,
    });
  }
};

// ======================
// GET ALL JOBS
// ======================
const getJobs = async (req, res) => {
  try {
    const jobs = await Job.find();

    res.status(200).json(jobs);
  } catch (error) {
    console.error("GET JOBS ERROR:", error);

    res.status(500).json({
      message: "Failed to fetch jobs",
      error: error.message,
    });
  }
};

// ======================
// UPDATE JOB
// ======================
const updateJob = async (req, res) => {
  try {
    const updatedJob = await Job.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedJob) {
      return res.status(404).json({
        message: "Job not found",
      });
    }

    res.status(200).json(updatedJob);
  } catch (error) {
    console.error("UPDATE JOB ERROR:", error);

    res.status(500).json({
      message: "Failed to update job",
      error: error.message,
    });
  }
};

// ======================
// DELETE JOB
// ======================
const deleteJob = async (req, res) => {
  try {
    const deletedJob = await Job.findByIdAndDelete(req.params.id);

    if (!deletedJob) {
      return res.status(404).json({
        message: "Job not found",
      });
    }

    res.status(200).json({
      message: "Job deleted successfully",
    });
  } catch (error) {
    console.error("DELETE JOB ERROR:", error);

    res.status(500).json({
      message: "Failed to delete job",
      error: error.message,
    });
  }
};

// ======================
// EXPORT
// ======================
module.exports = {
  createJob,
  getJobs,
  updateJob,
  deleteJob,
};