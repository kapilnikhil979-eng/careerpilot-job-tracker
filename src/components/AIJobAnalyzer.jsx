import { useState } from "react";

function AIJobAnalyzer({ darkMode }) {
  const [jobDescription, setJobDescription] = useState("");
  const [analysis, setAnalysis] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleAnalyzeJob() {
    if (!jobDescription.trim()) {
      setError("Please paste a job description first.");
      return;
    }

    const token = localStorage.getItem("token");

    if (!token) {
      setError("Please login first.");
      return;
    }

    setLoading(true);
    setError("");
    setAnalysis("");

    try {
      const savedSkills = localStorage.getItem("resumeSkills");

      const skills = savedSkills
        ? JSON.parse(savedSkills)
        : [
            "HTML",
            "CSS",
            "JavaScript",
            "React",
            "Tailwind CSS",
            "Node.js",
            "Express.js",
            "MongoDB",
          ];

      const response = await fetch(
        "https://careerpilot-backend-3yo2.onrender.com/api/ai/analyze-job",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },

          body: JSON.stringify({
            jobDescription,
            skills,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to analyze job description."
        );
      }

      setAnalysis(data.analysis);
    } catch (err) {
      console.error("AI Job Analyzer Error:", err);

      setError(
        err.message || "Something went wrong while analyzing the job."
      );
    } finally {
      setLoading(false);
    }
  }

  function handleClear() {
    setJobDescription("");
    setAnalysis("");
    setError("");
  }

  return (
    <div
      className={`mt-6 rounded-xl p-6 shadow-sm ${
        darkMode ? "bg-gray-800" : "bg-white"
      }`}
    >
      {/* HEADER */}
      <div className="mb-5">
        <h3
          className={`text-2xl font-bold ${
            darkMode ? "text-white" : "text-gray-900"
          }`}
        >
          🤖 AI Job Match Analyzer
        </h3>

        <p
          className={`mt-1 text-sm ${
            darkMode ? "text-gray-400" : "text-gray-500"
          }`}
        >
          Paste a job description and let CareerPilot AI analyze your
          skills, missing skills and interview preparation.
        </p>
      </div>

      {/* JOB DESCRIPTION */}
      <textarea
        value={jobDescription}
        onChange={(e) => setJobDescription(e.target.value)}
        placeholder="Paste the job description here..."
        rows={10}
        className={`w-full rounded-lg border p-4 text-sm outline-none transition focus:ring-2 focus:ring-blue-500 ${
          darkMode
            ? "border-gray-600 bg-gray-700 text-white placeholder-gray-400"
            : "border-gray-300 bg-white text-gray-900 placeholder-gray-400"
        }`}
      />

      {/* ERROR */}
      {error && (
        <div className="mt-4 rounded-lg border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* BUTTONS */}
      <div className="mt-4 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={handleAnalyzeJob}
          disabled={loading}
          className={`rounded-lg px-5 py-2.5 text-sm font-medium text-white transition ${
            loading
              ? "cursor-not-allowed bg-blue-400"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {loading ? "🤖 AI Analyzing..." : "✨ Analyze with AI"}
        </button>

        {(jobDescription || analysis) && (
          <button
            type="button"
            onClick={handleClear}
            className={`rounded-lg px-5 py-2.5 text-sm font-medium transition ${
              darkMode
                ? "bg-gray-700 text-gray-200 hover:bg-gray-600"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Clear
          </button>
        )}
      </div>

      {/* AI RESULT */}
      {analysis && (
        <div
          className={`mt-6 rounded-xl border p-5 ${
            darkMode
              ? "border-gray-600 bg-gray-700"
              : "border-blue-100 bg-blue-50"
          }`}
        >
          <div className="mb-4 flex items-center justify-between">
            <h4
              className={`text-lg font-bold ${
                darkMode ? "text-white" : "text-gray-900"
              }`}
            >
              🧠 CareerPilot AI Analysis
            </h4>

            <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
              AI Generated
            </span>
          </div>

          <div
            className={`whitespace-pre-wrap text-sm leading-7 ${
              darkMode ? "text-gray-200" : "text-gray-700"
            }`}
          >
            {analysis}
          </div>
        </div>
      )}
    </div>
  );
}

export default AIJobAnalyzer;