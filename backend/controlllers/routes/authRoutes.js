/* eslint-disable no-undef */

const express = require("express");

const {
  registerUser,
  loginUser,
  updateProfile,
  getResume,
  updateResume,
  deleteResume,
} = require("../../controllers/authController");

const authMiddleware = require("../../middleware/authMiddleware");

const router = express.Router();

// ======================
// REGISTER
// ======================
router.post("/register", registerUser);

// ======================
// LOGIN
// ======================
router.post("/login", loginUser);

// ======================
// UPDATE PROFILE
// ======================
router.put("/profile", authMiddleware, updateProfile);

// ======================
// GET RESUME
// ======================
router.get("/resume", authMiddleware, getResume);

// ======================
// SAVE / UPDATE RESUME
// ======================
router.put("/resume", authMiddleware, updateResume);

// ======================
// DELETE RESUME
// ======================
router.delete("/resume", authMiddleware, deleteResume);

module.exports = router;