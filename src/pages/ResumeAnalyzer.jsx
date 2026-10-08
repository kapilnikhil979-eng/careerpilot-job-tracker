import { useEffect, useState } from "react";
import AIJobAnalyzer from "../components/AIJobAnalyzer.jsx";

const API_URL =
  "https://careerpilot-backend-3yo2.onrender.com/api/auth/resume";

const ANALYZE_URL =
  "https://careerpilot-backend-3yo2.onrender.com/api/resume/analyze";

function ResumeAnalyzer({ darkMode }) {
  // =========================
  // RESUME STATE
  // =========================

  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState("");
  const [analyzed, setAnalyzed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [error, setError] = useState("");

  // =========================
  // ANALYSIS DATA
  // =========================

  const [score, setScore] = useState(0);
  const [projects, setProjects] = useState(0);
  const [skills, setSkills] = useState([]);

  const [jobRole, setJobRole] = useState("");
  const [strengths, setStrengths] = useState([]);
  const [improvements, setImprovements] = useState([]);
  const [summary, setSummary] = useState("");

  // =========================
  // LOAD CURRENT USER RESUME
  // =========================

  useEffect(() => {
    async function loadResume() {
      try {
        setPageLoading(true);
        setError("");

        const token = localStorage.getItem("token");

        if (!token) {
          setError("Please login first.");
          return;
        }

        const response = await fetch(API_URL, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to load resume");
        }

        setFileName(data.resumeFileName || "");
        setSkills(data.resumeSkills || []);
        setScore(data.resumeScore || 0);
        setProjects(data.resumeProjects || 0);
        setAnalyzed(data.resumeAnalyzed === true);

        setJobRole(data.resumeJobRole || "");
        setStrengths(data.resumeStrengths || []);
        setImprovements(data.resumeImprovements || []);
        setSummary(data.resumeSummary || "");
      } catch (error) {
        console.error("LOAD RESUME ERROR:", error);
        setError(error.message || "Failed to load resume");
      } finally {
        setPageLoading(false);
      }
    }

    loadResume();
  }, []);

  // =========================
  // SELECT RESUME
  // =========================

  function handleFileChange(e) {
    const selectedFile = e.target.files[0];

    setError("");

    if (!selectedFile) {
      return;
    }

    if (selectedFile.type !== "application/pdf") {
      setError("Please upload a PDF resume only.");
      return;
    }

    if (selectedFile.size > 5 * 1024 * 1024) {
      setError("Resume file size must be less than 5MB.");
      return;
    }

    setFile(selectedFile);
    setFileName(selectedFile.name);

    // Reset old analysis when a new PDF is selected
    setAnalyzed(false);
    setScore(0);
    setSkills([]);
    setProjects(0);

    setJobRole("");
    setStrengths([]);
    setImprovements([]);
    setSummary("");
  }

  // =========================
  // SAVE RESUME TO MONGODB
  // =========================

  async function saveResumeData(resumeData) {
    const token = localStorage.getItem("token");

    if (!token) {
      throw new Error("Please login first.");
    }

    const response = await fetch(API_URL, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(resumeData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to save resume");
    }

    return data;
  }

  // =========================
  // ANALYZE RESUME
  // =========================

  async function handleAnalyze() {
    if (!file) {
      setError("Please select a new PDF resume first.");
      return;
    }

    try {
      setError("");
      setLoading(true);

      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("Please login first.");
      }

      // Create FormData
      const formData = new FormData();

      // IMPORTANT:
      // This name must match upload.single("resume")
      // in backend resumeRoutes.js
      formData.append("resume", file);

      // =========================
      // SEND PDF TO PRODUCTION BACKEND
      // =========================

      const response = await fetch(ANALYZE_URL, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || data.error || "Failed to analyze resume"
        );
      }

      console.log("RESUME ANALYSIS RESPONSE:", data);

      // =========================
      // GET REAL GEMINI RESULTS
      // =========================

      const calculatedScore = Number(data.score) || 0;

      const detectedSkills = Array.isArray(data.skills)
        ? data.skills
        : [];

      const detectedProjects = Number(data.projects) || 0;

      const detectedJobRole = data.jobRole || "";

      const detectedStrengths = Array.isArray(data.strengths)
        ? data.strengths
        : [];

      const detectedImprovements = Array.isArray(data.improvements)
        ? data.improvements
        : [];

      const detectedSummary = data.summary || "";

      // =========================
      // UPDATE UI
      // =========================

      setScore(calculatedScore);
      setSkills(detectedSkills);
      setProjects(detectedProjects);

      setJobRole(detectedJobRole);
      setStrengths(detectedStrengths);
      setImprovements(detectedImprovements);
      setSummary(detectedSummary);

      setAnalyzed(true);

      // =========================
      // SAVE REAL DATA
      // TO CURRENT USER
      // =========================

      await saveResumeData({
        resumeFileName: file.name,
        resumeSkills: detectedSkills,
        resumeScore: calculatedScore,
        resumeProjects: detectedProjects,
        resumeAnalyzed: true,

        resumeJobRole: detectedJobRole,
        resumeStrengths: detectedStrengths,
        resumeImprovements: detectedImprovements,
        resumeSummary: detectedSummary,
      });
    } catch (error) {
      console.error("ANALYZE RESUME ERROR:", error);

      setError(
        error.message ||
          "Failed to analyze resume. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  // =========================
  // REMOVE RESUME
  // =========================

  async function handleRemoveResume() {
    try {
      setError("");

      const token = localStorage.getItem("token");

      if (!token) {
        setError("Please login first.");
        return;
      }

      const response = await fetch(API_URL, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to delete resume");
      }

      setFile(null);
      setFileName("");

      setAnalyzed(false);
      setScore(0);
      setSkills([]);
      setProjects(0);

      setJobRole("");
      setStrengths([]);
      setImprovements([]);
      setSummary("");

      // Reset file input
      const fileInput = document.getElementById(
        "resume-upload-input"
      );

      if (fileInput) {
        fileInput.value = "";
      }
    } catch (error) {
      console.error("DELETE RESUME ERROR:", error);

      setError(
        error.message || "Failed to remove resume"
      );
    }
  }

  // =========================
  // SCORE STATUS
  // =========================

  function getScoreStatus() {
    if (score >= 85) {
      return "Excellent";
    }

    if (score >= 70) {
      return "Good";
    }

    if (score >= 50) {
      return "Needs Improvement";
    }

    return "Weak";
  }

  // =========================
  // JOB READINESS
  // =========================

  function getReadiness() {
    if (score >= 85) {
      return "Excellent Foundation";
    }

    if (score >= 70) {
      return "Good Foundation";
    }

    if (score >= 50) {
      return "Needs Improvement";
    }

    return "Needs Major Improvement";
  }

  // =========================
  // LOADING
  // =========================

  if (pageLoading) {
    return (
      <div className="flex min-h-[300px] items-center justify-center">
        <p
          className={`text-sm ${
            darkMode ? "text-gray-400" : "text-gray-500"
          }`}
        >
          Loading your resume...
        </p>
      </div>
    );
  }

  // =========================
  // UI
  // =========================

  return (
    <div>
      {/* HEADER */}

      <div className="mb-6">
        <h2
          className={`text-3xl font-bold ${
            darkMode ? "text-white" : "text-gray-900"
          }`}
        >
          Resume Analyzer
        </h2>

        <p
          className={`mt-1 ${
            darkMode ? "text-gray-400" : "text-gray-500"
          }`}
        >
          Upload your resume and analyze it using AI.
        </p>
      </div>

      {/* AI JOB ANALYZER */}

      <AIJobAnalyzer darkMode={darkMode} />

      {/* RESUME UPLOAD */}

      <div
        className={`mt-6 rounded-xl p-6 shadow-sm ${
          darkMode ? "bg-gray-800" : "bg-white"
        }`}
      >
        <div
          className={`rounded-xl border-2 border-dashed p-8 text-center ${
            darkMode
              ? "border-gray-600"
              : "border-gray-300"
          }`}
        >
          <div className="text-5xl">📄</div>

          <h3
            className={`mt-3 text-xl font-bold ${
              darkMode
                ? "text-white"
                : "text-gray-900"
            }`}
          >
            Upload Your Resume
          </h3>

          <p
            className={`mt-2 text-sm ${
              darkMode
                ? "text-gray-400"
                : "text-gray-500"
            }`}
          >
            Upload your PDF resume and let Gemini AI
            analyze it.
          </p>

          {/* CHOOSE FILE */}

          <label className="mt-5 inline-block cursor-pointer rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700">
            Choose Resume

            <input
              id="resume-upload-input"
              type="file"
              accept=".pdf,application/pdf"
              onChange={handleFileChange}
              className="hidden"
            />
          </label>

          <p
            className={`mt-2 text-xs ${
              darkMode
                ? "text-gray-500"
                : "text-gray-400"
            }`}
          >
            PDF only • Maximum 5MB
          </p>

          {/* ERROR */}

          {error && (
            <div className="mx-auto mt-4 max-w-xl rounded-lg border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          {/* SELECTED FILE */}

          {fileName && (
            <div
              className={`mx-auto mt-5 max-w-xl rounded-lg p-4 ${
                darkMode
                  ? "bg-gray-700"
                  : "bg-gray-50"
              }`}
            >
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">
                    📄
                  </span>

                  <div className="text-left">
                    <p
                      className={`text-sm font-semibold ${
                        darkMode
                          ? "text-white"
                          : "text-gray-800"
                      }`}
                    >
                      {fileName}
                    </p>

                    <p className="mt-1 text-xs text-green-600">
                      PDF selected
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleRemoveResume}
                  className="text-sm font-medium text-red-500 hover:text-red-700"
                >
                  Remove
                </button>
              </div>

              {/* ANALYZE BUTTON */}

              {!analyzed && (
                <button
                  type="button"
                  onClick={handleAnalyze}
                  disabled={loading || !file}
                  className={`mt-4 rounded-lg px-5 py-2.5 text-sm font-medium text-white transition ${
                    loading || !file
                      ? "cursor-not-allowed bg-green-400"
                      : "bg-green-600 hover:bg-green-700"
                  }`}
                >
                  {loading
                    ? "Analyzing Resume..."
                    : "Analyze Resume"}
                </button>
              )}

              {/* SUCCESS */}

              {analyzed && (
                <p className="mt-3 text-sm font-medium text-green-600">
                  Analysis completed successfully ✅
                </p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ANALYSIS RESULTS */}

      {analyzed && (
        <div className="mt-6 space-y-6">
          {/* AI SUMMARY */}

          {summary && (
            <div
              className={`rounded-xl p-6 shadow-sm ${
                darkMode
                  ? "bg-gray-800"
                  : "bg-white"
              }`}
            >
              <h3
                className={`text-xl font-bold ${
                  darkMode
                    ? "text-white"
                    : "text-gray-900"
                }`}
              >
                🤖 AI Resume Summary
              </h3>

              <p
                className={`mt-3 leading-7 ${
                  darkMode
                    ? "text-gray-300"
                    : "text-gray-600"
                }`}
              >
                {summary}
              </p>

              {jobRole && (
                <div className="mt-4">
                  <p
                    className={`text-sm ${
                      darkMode
                        ? "text-gray-400"
                        : "text-gray-500"
                    }`}
                  >
                    Recommended Role
                  </p>

                  <p className="mt-1 text-lg font-bold text-blue-600">
                    {jobRole}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* SCORE + STATS */}

          <div
            className={`rounded-xl p-6 shadow-sm ${
              darkMode
                ? "bg-gray-800"
                : "bg-white"
            }`}
          >
            <div className="grid gap-4 lg:grid-cols-4">
              {/* SCORE */}

              <div
                className={`rounded-xl p-5 ${
                  darkMode
                    ? "bg-gray-700"
                    : "bg-blue-50"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p
                      className={`text-sm ${
                        darkMode
                          ? "text-gray-400"
                          : "text-gray-500"
                      }`}
                    >
                      Resume Score
                    </p>

                    <h3 className="mt-1 text-3xl font-bold text-blue-600">
                      {score}/100
                    </h3>

                    <p className="mt-1 text-sm font-medium text-blue-600">
                      {getScoreStatus()}
                    </p>
                  </div>

                  <span className="text-3xl">
                    📊
                  </span>
                </div>

                <div
                  className={`mt-4 h-2.5 overflow-hidden rounded-full ${
                    darkMode
                      ? "bg-gray-600"
                      : "bg-white"
                  }`}
                >
                  <div
                    className="h-full rounded-full bg-blue-600 transition-all duration-700"
                    style={{
                      width: `${score}%`,
                    }}
                  />
                </div>
              </div>

              {/* STATUS */}

              <div
                className={`rounded-xl p-5 ${
                  darkMode
                    ? "bg-blue-900/30"
                    : "bg-blue-50"
                }`}
              >
                <p
                  className={`text-sm ${
                    darkMode
                      ? "text-gray-400"
                      : "text-gray-500"
                  }`}
                >
                  Resume Status
                </p>

                <p className="mt-2 text-xl font-bold text-blue-600">
                  Analyzed ✅
                </p>

                <p
                  className={`mt-1 text-xs ${
                    darkMode
                      ? "text-gray-400"
                      : "text-gray-500"
                  }`}
                >
                  AI analysis completed
                </p>
              </div>

              {/* PROJECTS */}

              <div
                className={`rounded-xl p-5 ${
                  darkMode
                    ? "bg-green-900/30"
                    : "bg-green-50"
                }`}
              >
                <p
                  className={`text-sm ${
                    darkMode
                      ? "text-gray-400"
                      : "text-gray-500"
                  }`}
                >
                  Projects
                </p>

                <p className="mt-2 text-2xl font-bold text-green-600">
                  {projects}
                </p>

                <p
                  className={`mt-1 text-xs ${
                    darkMode
                      ? "text-gray-400"
                      : "text-gray-500"
                  }`}
                >
                  Projects detected
                </p>
              </div>

              {/* SKILLS */}

              <div
                className={`rounded-xl p-5 ${
                  darkMode
                    ? "bg-purple-900/30"
                    : "bg-purple-50"
                }`}
              >
                <p
                  className={`text-sm ${
                    darkMode
                      ? "text-gray-400"
                      : "text-gray-500"
                  }`}
                >
                  Skills
                </p>

                <p className="mt-2 text-2xl font-bold text-purple-600">
                  {skills.length}
                </p>

                <p
                  className={`mt-1 text-xs ${
                    darkMode
                      ? "text-gray-400"
                      : "text-gray-500"
                  }`}
                >
                  Skills detected
                </p>
              </div>
            </div>
          </div>

          {/* SKILLS + STRENGTHS */}

          <div className="grid gap-6 lg:grid-cols-2">
            {/* SKILLS */}

            <div
              className={`rounded-xl p-6 shadow-sm ${
                darkMode
                  ? "bg-gray-800"
                  : "bg-white"
              }`}
            >
              <h3
                className={`text-xl font-bold ${
                  darkMode
                    ? "text-white"
                    : "text-gray-900"
                }`}
              >
                🛠️ Detected Skills
              </h3>

              {skills.length > 0 ? (
                <div className="mt-4 flex flex-wrap gap-2">
                  {skills.map((skill, index) => (
                    <span
                      key={`${skill}-${index}`}
                      className={`rounded-full px-3 py-1.5 text-sm font-medium ${
                        darkMode
                          ? "bg-blue-900/50 text-blue-300"
                          : "bg-blue-100 text-blue-700"
                      }`}
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              ) : (
                <p
                  className={`mt-4 ${
                    darkMode
                      ? "text-gray-400"
                      : "text-gray-500"
                  }`}
                >
                  No skills detected.
                </p>
              )}
            </div>

            {/* STRENGTHS */}

            <div
              className={`rounded-xl p-6 shadow-sm ${
                darkMode
                  ? "bg-gray-800"
                  : "bg-white"
              }`}
            >
              <h3
                className={`text-xl font-bold ${
                  darkMode
                    ? "text-white"
                    : "text-gray-900"
                }`}
              >
                💪 Strengths
              </h3>

              {strengths.length > 0 ? (
                <ul className="mt-4 space-y-3">
                  {strengths.map((strength, index) => (
                    <li
                      key={index}
                      className={`rounded-lg p-3 ${
                        darkMode
                          ? "bg-green-900/30 text-gray-300"
                          : "bg-green-50 text-gray-700"
                      }`}
                    >
                      <span className="mr-2 text-green-600">
                        ✓
                      </span>

                      {strength}
                    </li>
                  ))}
                </ul>
              ) : (
                <p
                  className={`mt-4 ${
                    darkMode
                      ? "text-gray-400"
                      : "text-gray-500"
                  }`}
                >
                  No strengths detected.
                </p>
              )}
            </div>
          </div>

          {/* IMPROVEMENTS */}

          <div
            className={`rounded-xl p-6 shadow-sm ${
              darkMode
                ? "bg-gray-800"
                : "bg-white"
            }`}
          >
            <h3
              className={`text-xl font-bold ${
                darkMode
                  ? "text-white"
                  : "text-gray-900"
              }`}
            >
              📝 AI Improvement Suggestions
            </h3>

            {improvements.length > 0 ? (
              <div className="mt-4 grid gap-4 md:grid-cols-2">
                {improvements.map(
                  (improvement, index) => (
                    <div
                      key={index}
                      className={`rounded-lg p-4 ${
                        darkMode
                          ? "bg-yellow-900/30"
                          : "bg-yellow-50"
                      }`}
                    >
                      <p
                        className={`text-sm leading-6 ${
                          darkMode
                            ? "text-gray-300"
                            : "text-gray-700"
                        }`}
                      >
                        <span className="mr-2">
                          💡
                        </span>

                        {improvement}
                      </p>
                    </div>
                  )
                )}
              </div>
            ) : (
              <p
                className={`mt-4 ${
                  darkMode
                    ? "text-gray-400"
                    : "text-gray-500"
                }`}
              >
                No improvement suggestions available.
              </p>
            )}
          </div>

          {/* JOB READINESS */}

          <div
            className={`rounded-xl p-6 shadow-sm ${
              darkMode
                ? "bg-gray-800"
                : "bg-white"
            }`}
          >
            <h3
              className={`text-xl font-bold ${
                darkMode
                  ? "text-white"
                  : "text-gray-900"
              }`}
            >
              🎯 Job Readiness
            </h3>

            <p
              className={`mt-3 text-sm leading-6 ${
                darkMode
                  ? "text-gray-400"
                  : "text-gray-600"
              }`}
            >
              Your job readiness is estimated from the
              AI-generated resume score. Improve the areas
              suggested above to strengthen your
              applications.
            </p>

            <div className="mt-5">
              <div className="flex items-center justify-between">
                <span
                  className={`text-sm ${
                    darkMode
                      ? "text-gray-400"
                      : "text-gray-500"
                  }`}
                >
                  Readiness
                </span>

                <span className="font-bold text-green-600">
                  {getReadiness()}
                </span>
              </div>

              <div
                className={`mt-3 h-2.5 overflow-hidden rounded-full ${
                  darkMode
                    ? "bg-gray-700"
                    : "bg-gray-200"
                }`}
              >
                <div
                  className="h-full rounded-full bg-green-500 transition-all duration-700"
                  style={{
                    width: `${score}%`,
                  }}
                />
              </div>

              <p
                className={`mt-2 text-right text-xs ${
                  darkMode
                    ? "text-gray-500"
                    : "text-gray-400"
                }`}
              >
                {score}% readiness
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ResumeAnalyzer;