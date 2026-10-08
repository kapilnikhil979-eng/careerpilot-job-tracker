/* eslint-disable no-undef */

// ======================================================
// LOAD ENVIRONMENT VARIABLES FIRST
// ======================================================

require("dotenv").config();

// ======================================================
// IMPORTS
// ======================================================

const express = require("express");
const multer = require("multer");
const { GoogleGenAI } = require("@google/genai");

const authMiddleware = require("../../middleware/authMiddleware");

// ======================================================
// ROUTER
// ======================================================

const router = express.Router();

// ======================================================
// MULTER CONFIGURATION
// ======================================================

const upload = multer({
  storage: multer.memoryStorage(),

  limits: {
    fileSize: 5 * 1024 * 1024,
  },

  fileFilter: (req, file, cb) => {
    if (file.mimetype === "application/pdf") {
      cb(null, true);
    } else {
      cb(new Error("Only PDF files are allowed."));
    }
  },
});

// ======================================================
// ANALYZE RESUME
// POST /api/resume/analyze
// ======================================================

router.post(
  "/analyze",
  authMiddleware,
  upload.single("resume"),

  async (req, res) => {
    try {
      // ==================================================
      // CHECK FILE
      // ==================================================

      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: "Please upload a PDF resume.",
        });
      }

      console.log("");
      console.log("======================================");
      console.log("📄 RESUME ANALYSIS REQUEST");
      console.log("======================================");

      console.log("User ID:", req.userId);
      console.log("File:", req.file.originalname);
      console.log("File size:", req.file.size);

      // ==================================================
      // CHECK GEMINI API KEY
      // ==================================================

      if (!process.env.GEMINI_API_KEY) {
        console.error("❌ GEMINI_API_KEY is missing.");

        return res.status(500).json({
          success: false,
          message: "GEMINI_API_KEY is missing from backend .env file.",
        });
      }

      console.log("🔑 Gemini API key found.");

      // ==================================================
      // CONVERT PDF TO BASE64
      // ==================================================

      console.log("📎 Preparing PDF for Gemini...");

      const pdfBase64 = req.file.buffer.toString("base64");

      console.log("✅ PDF converted to Base64.");

      console.log("📏 Base64 size:", pdfBase64.length);

      // ==================================================
      // GEMINI CLIENT
      // ==================================================

      const ai = new GoogleGenAI({
        apiKey: process.env.GEMINI_API_KEY,
      });

      // ==================================================
      // AI PROMPT
      // ==================================================

      const prompt = `
You are CareerPilot AI, a professional resume analyzer.

Analyze the attached PDF resume carefully.

The PDF may contain:

- Normal text
- Scanned text
- Images
- Tables
- Different layouts
- Multiple pages

Read the actual resume content from the PDF.

Do NOT invent information.

========================
OUTPUT FORMAT
========================

Return ONLY valid JSON.

Use EXACTLY this structure:

{
  "score": 0,
  "skills": [],
  "projects": 0,
  "jobRole": "",
  "strengths": [],
  "improvements": [],
  "summary": ""
}

========================
RULES
========================

1. SCORE

Give a realistic resume score from 0 to 100.

Consider:

- Skills
- Projects
- Education
- Experience
- Achievements
- Resume structure
- Technical relevance
- Job readiness
- Overall clarity

The score must be based on the actual resume.

Do NOT always give the same score.

--------------------------------

2. SKILLS

List ONLY skills that actually appear in the resume.

Do NOT invent skills.

Return an array of strings.

Example:

"skills": [
  "HTML",
  "CSS",
  "JavaScript",
  "React",
  "Node.js"
]

--------------------------------

3. PROJECTS

Count the actual projects mentioned in the resume.

Do NOT assume a fixed number.

Return only a number.

--------------------------------

4. JOB ROLE

Identify the most suitable job role based on the actual resume.

Examples:

- Frontend Developer
- React Developer
- Full Stack Developer
- Backend Developer
- Software Developer

Do NOT invent experience.

--------------------------------

5. STRENGTHS

Give 3 to 5 strengths.

Use only information supported by the resume.

--------------------------------

6. IMPROVEMENTS

Give 3 to 5 practical improvements.

Focus on:

- Missing information
- Weak sections
- Projects
- Skills
- Experience
- Achievements
- Resume formatting
- Measurable results
- Job relevance

--------------------------------

7. SUMMARY

Write a short professional summary based ONLY on the actual resume.

--------------------------------

IMPORTANT:

- Return ONLY JSON.
- Do NOT use markdown.
- Do NOT use code fences.
- Do NOT write explanations outside JSON.
- Analyze the actual attached PDF.
`;

      // ==================================================
      // SEND PDF DIRECTLY TO GEMINI
      // WITH RETRY + FALLBACK
      // ==================================================

      console.log("");
      console.log("🤖 Sending PDF directly to Gemini...");

      let response;
      let lastError;

      const models = [
        "gemini-3.5-flash-lite",
        "gemini-3.6-flash",
      ];

      for (const model of models) {
        for (let attempt = 1; attempt <= 2; attempt++) {
          try {
            console.log(
              `🤖 Trying Gemini model: ${model} | Attempt: ${attempt}`
            );

            response = await ai.models.generateContent({
              model,

              contents: [
                {
                  text: prompt,
                },

                {
                  inlineData: {
                    mimeType: "application/pdf",
                    data: pdfBase64,
                  },
                },
              ],

              config: {
                temperature: 0.2,
                maxOutputTokens: 1200,

                // IMPORTANT:
                // Force Gemini to return valid JSON
                responseMimeType: "application/json",
              },
            });

            console.log(`✅ Gemini success using ${model}`);

            break;
          } catch (error) {
            lastError = error;

            const status = error?.status ?? error?.error?.code;

            console.error(
              `❌ Gemini error using ${model}, attempt ${attempt}:`,
              error?.message || error
            );

            // Only retry/fallback for temporary Gemini overload
            if (status !== 503) {
              throw error;
            }

            if (attempt < 2) {
              console.log(
                "⏳ Gemini temporarily busy. Retrying in 2 seconds..."
              );

              await new Promise((resolve) =>
                setTimeout(resolve, 2000)
              );
            }
          }
        }

        // If successful, don't try another model
        if (response) {
          break;
        }

        console.log(
          `⚠️ ${model} unavailable. Trying next model...`
        );
      }

      // If all models failed
      if (!response) {
        throw (
          lastError ||
          new Error("Gemini analysis failed.")
        );
      }

      // ==================================================
      // GEMINI RESPONSE
      // ==================================================

      console.log("✅ Gemini response received.");

      let analysisText = response.text;

      if (!analysisText) {
        console.error("❌ Gemini returned empty response.");

        return res.status(500).json({
          success: false,
          message: "Gemini returned an empty response.",
        });
      }

      // ==================================================
      // SHOW RAW RESPONSE
      // ==================================================

      console.log("");
      console.log("======================================");
      console.log("🤖 RAW GEMINI RESPONSE");
      console.log("======================================");

      console.log(analysisText);

      // ==================================================
      // CLEAN GEMINI RESPONSE
      // ==================================================

      analysisText = analysisText
        .replace(/```json/gi, "")
        .replace(/```/g, "")
        .trim();

      // ==================================================
      // PARSE JSON
      // ==================================================

      let analysis;

      try {
        analysis = JSON.parse(analysisText);
      } catch (parseError) {
        console.error("");
        console.error(
          "======================================"
        );

        console.error(
          "❌ GEMINI JSON PARSE ERROR"
        );

        console.error(
          "======================================"
        );

        console.error(
          "Parse error:",
          parseError.message
        );

        console.error(
          "Gemini response:",
          analysisText
        );

        return res.status(500).json({
          success: false,
          message:
            "AI returned an invalid analysis format.",
        });
      }

      // ==================================================
      // VALIDATE SCORE
      // ==================================================

      const score = Math.max(
        0,
        Math.min(
          100,
          Number(analysis.score) || 0
        )
      );

      // ==================================================
      // VALIDATE SKILLS
      // ==================================================

      const skills = Array.isArray(
        analysis.skills
      )
        ? analysis.skills
            .filter(
              (skill) =>
                typeof skill === "string" &&
                skill.trim() !== ""
            )
            .map((skill) => skill.trim())
        : [];

      // ==================================================
      // VALIDATE PROJECTS
      // ==================================================

      const projects = Math.max(
        0,
        Number(analysis.projects) || 0
      );

      // ==================================================
      // VALIDATE JOB ROLE
      // ==================================================

      const jobRole =
        typeof analysis.jobRole === "string"
          ? analysis.jobRole.trim()
          : "";

      // ==================================================
      // VALIDATE STRENGTHS
      // ==================================================

      const strengths = Array.isArray(
        analysis.strengths
      )
        ? analysis.strengths
            .filter(
              (item) =>
                typeof item === "string" &&
                item.trim() !== ""
            )
            .map((item) => item.trim())
        : [];

      // ==================================================
      // VALIDATE IMPROVEMENTS
      // ==================================================

      const improvements = Array.isArray(
        analysis.improvements
      )
        ? analysis.improvements
            .filter(
              (item) =>
                typeof item === "string" &&
                item.trim() !== ""
            )
            .map((item) => item.trim())
        : [];

      // ==================================================
      // VALIDATE SUMMARY
      // ==================================================

      const summary =
        typeof analysis.summary === "string"
          ? analysis.summary.trim()
          : "";

      // ==================================================
      // FINAL RESULT
      // ==================================================

      console.log("");
      console.log(
        "======================================"
      );

      console.log(
        "✅ RESUME ANALYSIS COMPLETE"
      );

      console.log(
        "======================================"
      );

      console.log("Score:", score);
      console.log("Skills:", skills);
      console.log("Projects:", projects);
      console.log("Job Role:", jobRole);
      console.log("Strengths:", strengths);
      console.log(
        "Improvements:",
        improvements
      );
      console.log("Summary:", summary);

      console.log(
        "======================================"
      );

      // ==================================================
      // SEND RESULT TO FRONTEND
      // ==================================================

      return res.status(200).json({
        success: true,

        fileName: req.file.originalname,

        score,

        skills,

        projects,

        jobRole,

        strengths,

        improvements,

        summary,

        documentAnalyzed: true,
      });
    } catch (error) {
      // ==================================================
      // ERROR HANDLING
      // ==================================================

      console.error("");

      console.error(
        "======================================"
      );

      console.error(
        "❌ RESUME ANALYSIS ERROR"
      );

      console.error(
        "======================================"
      );

      console.error(error);

      console.error(
        "Error message:",
        error?.message
      );

      console.error(
        "======================================"
      );

      return res.status(500).json({
        success: false,

        message:
          "Failed to analyze resume.",

        error:
          error?.message ||
          "Unknown resume analysis error.",
      });
    }
  }
);

// ======================================================
// EXPORT ROUTER
// ======================================================

module.exports = router;