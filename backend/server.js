/* eslint-disable no-undef */

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

const Job = require("./models/Job");
const authRoutes = require("./controlllers/routes/authRoutes");
const authMiddleware = require("./middleware/authMiddleware");

dotenv.config();

const app = express();

// ======================
// MIDDLEWARE
// ======================
app.use(cors());
app.use(express.json());

// ======================
// HOME ROUTE
// ======================
app.get("/", (req, res) => {
  res.send("Job Tracker Backend is Running 🚀");
});

// ======================
// AUTH ROUTES
// ======================
app.use("/api/auth", authRoutes);

// ======================
// CREATE JOB
// ======================
app.post("/api/jobs", authMiddleware, async (req, res) => {
  try {
    console.log("Received Job Data:", req.body);
    console.log("Logged-in User ID:", req.userId);

    const newJob = new Job({
      ...req.body,
      userId: req.userId,
    });

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
});

// ======================
// GET USER'S JOBS
// ======================
app.get("/api/jobs", authMiddleware, async (req, res) => {
  try {
    const jobs = await Job.find({
      userId: req.userId,
    }).sort({ createdAt: -1 });

    res.status(200).json(jobs);
  } catch (error) {
    console.error("GET JOBS ERROR:", error);

    res.status(500).json({
      message: "Failed to fetch jobs",
      error: error.message,
    });
  }
});

// ======================
// UPDATE JOB
// ======================
app.put("/api/jobs/:id", authMiddleware, async (req, res) => {
  try {
    const updatedJob = await Job.findOneAndUpdate(
      {
        _id: req.params.id,
        userId: req.userId,
      },
      {
        $set: req.body,
      },
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
});

// ======================
// DELETE JOB
// ======================
app.delete("/api/jobs/:id", authMiddleware, async (req, res) => {
  try {
    const deletedJob = await Job.findOneAndDelete({
      _id: req.params.id,
      userId: req.userId,
    });

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
});

// ======================
// MONGODB CONNECTION
// ======================
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB Connected Successfully ✅");
  })
  .catch((error) => {
    console.error("MongoDB Connection Error ❌");
    console.error(error.message);
  });

// ======================
// SERVER
// ======================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});