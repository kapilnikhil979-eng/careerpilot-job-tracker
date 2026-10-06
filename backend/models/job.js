/* eslint-disable no-undef */

const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema(
  {
    // Job kis user ki hai
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    company: {
      type: String,
      required: true,
    },

    position: {
      type: String,
      required: true,
    },

    location: {
      type: String,
      default: "",
    },

    salary: {
      type: String,
      default: "",
    },

    status: {
      type: String,
      enum: ["Applied", "Interview", "Selected", "Rejected"],
      default: "Applied",
    },

    date: {
      type: String,
      default: () => new Date().toLocaleDateString("en-GB"),
    },
  },
  {
    timestamps: true,
  }
);

const Job = mongoose.model("Job", jobSchema);

module.exports = Job;