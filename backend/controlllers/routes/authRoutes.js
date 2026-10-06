/* eslint-disable no-undef */

const express = require("express");

const {
  registerUser,
  loginUser,
  updateProfile,
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

module.exports = router;