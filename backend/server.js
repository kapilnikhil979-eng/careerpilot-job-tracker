/* eslint-disable no-undef */

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const { GoogleGenAI } = require("@google/genai");

const Job = require("./models/job");

// Existing auth route
const authRoutes = require("./controlllers/routes/authRoutes");

// NEW: Resume route
const resumeRoutes = require("./controlllers/routes/resumeRoutes");

const authMiddleware = require("./middleware/authMiddleware");

dotenv.config();

// ======================================================
// GEMINI AI
// ======================================================

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

// ======================================================
// EXPRESS APP
// ======================================================

const app = express();

// ======================================================
// MIDDLEWARE
// ======================================================

app.use(cors());

app.use(express.json());

// ======================================================
// HOME ROUTE
// ======================================================

app.get("/", (req, res) => {
  res.send("Job Tracker Backend is Running 🚀");
});

// ======================================================
// AUTH ROUTES
// ======================================================

app.use("/api/auth", authRoutes);

// ======================================================
// RESUME ROUTES
// ======================================================

app.use("/api/resume", resumeRoutes);

// ======================================================
// AI JOB ANALYZER
// ======================================================

app.post(
  "/api/ai/analyze-job",
  authMiddleware,
  async (req, res) => {
    try {
      const { jobDescription, skills } = req.body;

      // --------------------------------------------------
      // VALIDATE JOB DESCRIPTION
      // --------------------------------------------------

      if (
        !jobDescription ||
        typeof jobDescription !== "string" ||
        !jobDescription.trim()
      ) {
        return res.status(400).json({
          success: false,
          message: "Job description is required.",
        });
      }

      // --------------------------------------------------
      // USER SKILLS
      // --------------------------------------------------

      const userSkills = Array.isArray(skills)
        ? skills
        : [];

      console.log("");
      console.log("======================================");
      console.log("🤖 AI JOB ANALYSIS REQUEST");
      console.log("======================================");
      console.log("User ID:", req.userId);
      console.log("Skills:", userSkills);
      console.log("Job Description Received: YES");

      // --------------------------------------------------
      // GEMINI PROMPT
      // --------------------------------------------------

      const prompt = `
You are CareerPilot AI, an AI career assistant for job seekers.

Analyze the following job description and compare it with the user's skills.

JOB DESCRIPTION:
${jobDescription}

USER SKILLS:
${userSkills.join(", ")}

Provide the analysis in exactly these sections:

1. Job Role
Identify the most likely job role.

2. Required Skills
List the important technical and soft skills required.

3. Matching Skills
List the user's skills that match the job requirements.

4. Missing Skills
List important skills required by the job that the user does not currently have.

5. Match Percentage
Give an estimated percentage from 0 to 100.

6. Improvement Suggestions
Give practical suggestions for improving the user's chances.

7. Interview Preparation Tips
Give 5 short interview preparation tips specifically for this job.

Important rules:
- Be accurate and practical.
- Do not invent skills that are not present in the job description.
- Keep the response beginner-friendly.
- Clearly separate every section.
- Keep the response concise.
- Keep the complete response under 500 words.
`;

      console.log("🚀 Sending request to Gemini...");

      // --------------------------------------------------
      // GEMINI REQUEST
      // --------------------------------------------------

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash-lite",
        contents: prompt,
        config: {
          maxOutputTokens: 800,
          temperature: 0.3,
        },
      });

      console.log("✅ Gemini response received");

      const analysis = response.text;

      // --------------------------------------------------
      // CHECK AI RESPONSE
      // --------------------------------------------------

      if (!analysis) {
        console.error("❌ Gemini returned an empty response.");

        return res.status(500).json({
          success: false,
          message: "Gemini returned an empty response.",
        });
      }

      // --------------------------------------------------
      // SEND AI RESPONSE
      // --------------------------------------------------

      return res.status(200).json({
        success: true,
        analysis: analysis,
      });
    } catch (error) {
      console.error("");
      console.error("======================================");
      console.error("❌ AI JOB ANALYZER ERROR");
      console.error("======================================");
      console.error(error);
      console.error("======================================");

      return res.status(500).json({
        success: false,
        message: "Failed to analyze job description.",
        error:
          error?.message ||
          "Unknown Gemini/Server error.",
      });
    }
  }
);

// ======================================================
// CREATE JOB
// ======================================================

app.post(
  "/api/jobs",
  authMiddleware,
  async (req, res) => {
    try {
      console.log("Received Job Data:", req.body);
      console.log("Logged-in User ID:", req.userId);

      const newJob = new Job({
        ...req.body,
        userId: req.userId,
      });

      const savedJob = await newJob.save();

      console.log(
        "Job Saved Successfully:",
        savedJob
      );

      return res.status(201).json(savedJob);
    } catch (error) {
      console.error("CREATE JOB ERROR:", error);

      return res.status(500).json({
        message: "Failed to create job",
        error: error.message,
      });
    }
  }
);

// ======================================================
// GET USER JOBS
// ======================================================

app.get(
  "/api/jobs",
  authMiddleware,
  async (req, res) => {
    try {
      const jobs = await Job.find({
        userId: req.userId,
      }).sort({
        createdAt: -1,
      });

      return res.status(200).json(jobs);
    } catch (error) {
      console.error("GET JOBS ERROR:", error);

      return res.status(500).json({
        message: "Failed to fetch jobs",
        error: error.message,
      });
    }
  }
);

// ======================================================
// UPDATE JOB
// ======================================================

app.put(
  "/api/jobs/:id",
  authMiddleware,
  async (req, res) => {
    try {
      const updatedJob =
        await Job.findOneAndUpdate(
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

      return res.status(200).json(updatedJob);
    } catch (error) {
      console.error(
        "UPDATE JOB ERROR:",
        error
      );

      return res.status(500).json({
        message: "Failed to update job",
        error: error.message,
      });
    }
  }
);

// ======================================================
// DELETE JOB
// ======================================================

app.delete(
  "/api/jobs/:id",
  authMiddleware,
  async (req, res) => {
    try {
      const deletedJob =
        await Job.findOneAndDelete({
          _id: req.params.id,
          userId: req.userId,
        });

      if (!deletedJob) {
        return res.status(404).json({
          message: "Job not found",
        });
      }

      return res.status(200).json({
        message: "Job deleted successfully",
      });
    } catch (error) {
      console.error(
        "DELETE JOB ERROR:",
        error
      );

      return res.status(500).json({
        message: "Failed to delete job",
        error: error.message,
      });
    }
  }
);

// ======================================================
// MONGODB CONNECTION
// ======================================================

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log(
      "MongoDB Connected Successfully ✅"
    );
  })
  .catch((error) => {
    console.error(
      "MongoDB Connection Error ❌"
    );

    console.error(error.message);
  });

// ======================================================
// SERVER
// ======================================================

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(
    `Server running on http://localhost:${PORT}`
  );
});