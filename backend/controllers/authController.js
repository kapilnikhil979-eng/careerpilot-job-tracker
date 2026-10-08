/* eslint-disable no-undef */

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");

// ======================
// REGISTER USER
// ======================
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check fields
    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Please fill all fields",
      });
    }

    // Check password length
    if (password.length < 6) {
      return res.status(400).json({
        message: "Password must be at least 6 characters",
      });
    }

    // Check existing user
    const existingUser = await User.findOne({
      email: email.toLowerCase().trim(),
    });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password: hashedPassword,
    });

    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("REGISTER ERROR:", error);

    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

// ======================
// LOGIN USER
// ======================
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check fields
    if (!email || !password) {
      return res.status(400).json({
        message: "Please fill all fields",
      });
    }

    // Find user
    const user = await User.findOne({
      email: email.toLowerCase().trim(),
    });

    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    // Compare password
    const isPasswordCorrect = await bcrypt.compare(
      password,
      user.password
    );

    if (!isPasswordCorrect) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    // Check JWT secret
    if (!process.env.JWT_SECRET) {
      return res.status(500).json({
        message: "JWT_SECRET is missing in .env",
      });
    }

    // Create JWT token
    const token = jwt.sign(
      {
        userId: user._id,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    // Login response
    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("LOGIN ERROR:", error);

    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

// ======================
// UPDATE PROFILE
// ======================
const updateProfile = async (req, res) => {
  try {
    const { name, email } = req.body;

    // Check fields
    if (!name || !email) {
      return res.status(400).json({
        message: "Name and email are required",
      });
    }

    // Find logged-in user
    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // Check if email belongs to another user
    const existingUser = await User.findOne({
      email: email.toLowerCase().trim(),
      _id: { $ne: req.userId },
    });

    if (existingUser) {
      return res.status(400).json({
        message: "Email is already in use",
      });
    }

    // Update user
    user.name = name.trim();
    user.email = email.toLowerCase().trim();

    const updatedUser = await user.save();

    // Send updated user
    res.status(200).json({
      message: "Profile updated successfully",
      user: {
        id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
      },
    });
  } catch (error) {
    console.error("UPDATE PROFILE ERROR:", error);

    res.status(500).json({
      message: "Failed to update profile",
      error: error.message,
    });
  }
};

// ======================
// GET RESUME DATA
// ======================
const getResume = async (req, res) => {
  try {
    // Find only the logged-in user's data
    const user = await User.findById(req.userId).select(
      "resumeFileName resumeSkills resumeScore resumeProjects resumeAnalyzed"
    );

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.status(200).json({
      resumeFileName: user.resumeFileName,
      resumeSkills: user.resumeSkills,
      resumeScore: user.resumeScore,
      resumeProjects: user.resumeProjects,
      resumeAnalyzed: user.resumeAnalyzed,
    });
  } catch (error) {
    console.error("GET RESUME ERROR:", error);

    res.status(500).json({
      message: "Failed to get resume data",
      error: error.message,
    });
  }
};

// ======================
// SAVE / UPDATE RESUME
// ======================
const updateResume = async (req, res) => {
  try {
    const {
      resumeFileName,
      resumeSkills,
      resumeScore,
      resumeProjects,
      resumeAnalyzed,
    } = req.body;

    // Find logged-in user
    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // Save resume information
    user.resumeFileName = resumeFileName || "";

    user.resumeSkills = Array.isArray(resumeSkills)
      ? resumeSkills
      : [];

    user.resumeScore =
      typeof resumeScore === "number"
        ? resumeScore
        : 0;

    user.resumeProjects =
      typeof resumeProjects === "number"
        ? resumeProjects
        : 0;

    user.resumeAnalyzed = resumeAnalyzed === true;

    const updatedUser = await user.save();

    res.status(200).json({
      message: "Resume data saved successfully",

      resume: {
        resumeFileName: updatedUser.resumeFileName,
        resumeSkills: updatedUser.resumeSkills,
        resumeScore: updatedUser.resumeScore,
        resumeProjects: updatedUser.resumeProjects,
        resumeAnalyzed: updatedUser.resumeAnalyzed,
      },
    });
  } catch (error) {
    console.error("UPDATE RESUME ERROR:", error);

    res.status(500).json({
      message: "Failed to save resume data",
      error: error.message,
    });
  }
};

// ======================
// DELETE RESUME DATA
// ======================
const deleteResume = async (req, res) => {
  try {
    // Find logged-in user
    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // Clear resume data
    user.resumeFileName = "";
    user.resumeSkills = [];
    user.resumeScore = 0;
    user.resumeProjects = 0;
    user.resumeAnalyzed = false;

    await user.save();

    res.status(200).json({
      message: "Resume data deleted successfully",
    });
  } catch (error) {
    console.error("DELETE RESUME ERROR:", error);

    res.status(500).json({
      message: "Failed to delete resume data",
      error: error.message,
    });
  }
};

// ======================
// EXPORT
// ======================
module.exports = {
  registerUser,
  loginUser,
  updateProfile,
  getResume,
  updateResume,
  deleteResume,
};