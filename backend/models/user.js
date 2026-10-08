/* eslint-disable no-undef */
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
      minlength: 6,
    },

    // Resume data
    resumeFileName: {
      type: String,
      default: "",
    },

    resumeSkills: {
      type: [String],
      default: [],
    },

    resumeScore: {
      type: Number,
      default: 0,
    },

    resumeProjects: {
      type: Number,
      default: 0,
    },

    resumeAnalyzed: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);

module.exports = User;