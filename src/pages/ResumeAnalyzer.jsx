import { useState } from "react";

function ResumeAnalyzer({ darkMode }) {
  // =========================
  // RESUME STATE
  // =========================

  const [file, setFile] = useState(null);

  const [fileName, setFileName] = useState(() => {
    return localStorage.getItem("resumeFileName") || "";
  });

  const [analyzed, setAnalyzed] = useState(() => {
    return localStorage.getItem("resumeAnalyzed") === "true";
  });

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  // =========================
  // ANALYSIS DATA
  // =========================

  const [score, setScore] = useState(() => {
    return Number(localStorage.getItem("resumeScore")) || 78;
  });

  const [projects, setProjects] = useState(() => {
    return Number(localStorage.getItem("resumeProjects")) || 3;
  });

  const [skills, setSkills] = useState(() => {
    const savedSkills = localStorage.getItem("resumeSkills");

    return savedSkills
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
  });

  // =========================
  // HANDLE FILE CHANGE
  // =========================

  function handleFileChange(e) {
    const selectedFile = e.target.files[0];

    setError("");

    if (!selectedFile) {
      return;
    }

    // Check PDF
    if (selectedFile.type !== "application/pdf") {
      setError("Please upload a PDF resume only.");
      return;
    }

    // Maximum 5MB
    if (selectedFile.size > 5 * 1024 * 1024) {
      setError("Resume file size must be less than 5MB.");
      return;
    }

    setFile(selectedFile);
    setFileName(selectedFile.name);
    setAnalyzed(false);

    localStorage.setItem("resumeFileName", selectedFile.name);
    localStorage.setItem("resumeAnalyzed", "false");
  }

  // =========================
  // ANALYZE RESUME
  // =========================

  function handleAnalyze() {
    if (!file) {
      setError("Please select a resume first.");
      return;
    }

    setError("");
    setLoading(true);

    // Simulate analysis
    setTimeout(() => {
      const calculatedScore = 78;

      const detectedSkills = [
        "HTML",
        "CSS",
        "JavaScript",
        "React",
        "Tailwind CSS",
        "Node.js",
        "Express.js",
        "MongoDB",
      ];

      const detectedProjects = 3;

      setScore(calculatedScore);
      setSkills(detectedSkills);
      setProjects(detectedProjects);

      setAnalyzed(true);
      setLoading(false);

      // Save analysis
      localStorage.setItem("resumeAnalyzed", "true");
      localStorage.setItem("resumeScore", calculatedScore);
      localStorage.setItem(
        "resumeSkills",
        JSON.stringify(detectedSkills)
      );
      localStorage.setItem("resumeProjects", detectedProjects);
    }, 1200);
  }

  // =========================
  // REMOVE RESUME
  // =========================

  function handleRemoveResume() {
    setFile(null);
    setFileName("");
    setAnalyzed(false);
    setError("");

    localStorage.removeItem("resumeFileName");
    localStorage.removeItem("resumeAnalyzed");
    localStorage.removeItem("resumeScore");
    localStorage.removeItem("resumeSkills");
    localStorage.removeItem("resumeProjects");
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

  return (
    <div>
      {/* =========================
          PAGE HEADER
      ========================= */}

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
          Upload your resume and analyze it for your job search.
        </p>
      </div>

      {/* =========================
          UPLOAD SECTION
      ========================= */}

      <div
        className={`rounded-xl p-6 shadow-sm ${
          darkMode ? "bg-gray-800" : "bg-white"
        }`}
      >
        <div
          className={`rounded-xl border-2 border-dashed p-8 text-center ${
            darkMode ? "border-gray-600" : "border-gray-300"
          }`}
        >
          <div className="text-5xl">📄</div>

          <h3
            className={`mt-3 text-xl font-bold ${
              darkMode ? "text-white" : "text-gray-900"
            }`}
          >
            Upload Your Resume
          </h3>

          <p
            className={`mt-2 text-sm ${
              darkMode ? "text-gray-400" : "text-gray-500"
            }`}
          >
            Upload your PDF resume to analyze it.
          </p>

          {/* CHOOSE FILE */}

          <label className="mt-5 inline-block cursor-pointer rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700">
            Choose Resume

            <input
              type="file"
              accept=".pdf,application/pdf"
              onChange={handleFileChange}
              className="hidden"
            />
          </label>

          <p
            className={`mt-2 text-xs ${
              darkMode ? "text-gray-500" : "text-gray-400"
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
                darkMode ? "bg-gray-700" : "bg-gray-50"
              }`}
            >
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">📄</span>

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
                  disabled={loading}
                  className={`mt-4 rounded-lg px-5 py-2.5 text-sm font-medium text-white transition ${
                    loading
                      ? "cursor-not-allowed bg-green-400"
                      : "bg-green-600 hover:bg-green-700"
                  }`}
                >
                  {loading
                    ? "Analyzing Resume..."
                    : "Analyze Resume"}
                </button>
              )}

              {/* SAVED STATUS */}

              {analyzed && (
                <p className="mt-3 text-sm font-medium text-green-600">
                  Analysis completed successfully ✅
                </p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* =========================
          ANALYSIS
      ========================= */}

      {analyzed && (
        <div className="mt-6 space-y-6">
          {/* =========================
              SCORE + STATS
          ========================= */}

          <div
            className={`rounded-xl p-6 shadow-sm ${
              darkMode ? "bg-gray-800" : "bg-white"
            }`}
          >
            <div className="grid gap-4 lg:grid-cols-4">
              {/* SCORE */}

              <div
                className={`rounded-xl p-5 lg:col-span-1 ${
                  darkMode ? "bg-gray-700" : "bg-blue-50"
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

                  <span className="text-3xl">📊</span>
                </div>

                <div
                  className={`mt-4 h-2.5 overflow-hidden rounded-full ${
                    darkMode ? "bg-gray-600" : "bg-white"
                  }`}
                >
                  <div
                    className="h-full rounded-full bg-blue-600 transition-all duration-700"
                    style={{ width: `${score}%` }}
                  ></div>
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
                  Uploaded ✅
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

          {/* =========================
              SKILLS + PROJECTS
          ========================= */}

          <div className="grid gap-6 lg:grid-cols-2">
            {/* SKILLS */}

            <div
              className={`rounded-xl p-6 shadow-sm ${
                darkMode ? "bg-gray-800" : "bg-white"
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

              <div className="mt-4 flex flex-wrap gap-2">
                {skills.map((skill) => (
                  <span
                    key={skill}
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
            </div>

            {/* PROJECTS */}

            <div
              className={`rounded-xl p-6 shadow-sm ${
                darkMode ? "bg-gray-800" : "bg-white"
              }`}
            >
              <h3
                className={`text-xl font-bold ${
                  darkMode
                    ? "text-white"
                    : "text-gray-900"
                }`}
              >
                💼 Projects
              </h3>

              <div className="mt-4 space-y-3">
                <div
                  className={`rounded-lg p-4 ${
                    darkMode
                      ? "bg-gray-700"
                      : "bg-gray-50"
                  }`}
                >
                  <p
                    className={`font-semibold ${
                      darkMode
                        ? "text-white"
                        : "text-gray-900"
                    }`}
                  >
                    CareerPilot
                  </p>

                  <p
                    className={`mt-1 text-sm ${
                      darkMode
                        ? "text-gray-400"
                        : "text-gray-600"
                    }`}
                  >
                    Full Stack career management application
                    using React, Node.js, Express and MongoDB.
                  </p>
                </div>

                <div
                  className={`rounded-lg p-4 ${
                    darkMode
                      ? "bg-gray-700"
                      : "bg-gray-50"
                  }`}
                >
                  <p
                    className={`font-semibold ${
                      darkMode
                        ? "text-white"
                        : "text-gray-900"
                    }`}
                  >
                    Job Tracker
                  </p>

                  <p
                    className={`mt-1 text-sm ${
                      darkMode
                        ? "text-gray-400"
                        : "text-gray-600"
                    }`}
                  >
                    Job application tracking with search,
                    filters and status management.
                  </p>
                </div>

                <div
                  className={`rounded-lg p-4 ${
                    darkMode
                      ? "bg-gray-700"
                      : "bg-gray-50"
                  }`}
                >
                  <p
                    className={`font-semibold ${
                      darkMode
                        ? "text-white"
                        : "text-gray-900"
                    }`}
                  >
                    Portfolio Website
                  </p>

                  <p
                    className={`mt-1 text-sm ${
                      darkMode
                        ? "text-gray-400"
                        : "text-gray-600"
                    }`}
                  >
                    Responsive developer portfolio website.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* =========================
              IMPROVEMENT + JOB READINESS
          ========================= */}

          <div className="grid gap-6 lg:grid-cols-2">
            {/* SUGGESTIONS */}

            <div
              className={`rounded-xl p-6 shadow-sm ${
                darkMode ? "bg-gray-800" : "bg-white"
              }`}
            >
              <h3
                className={`text-xl font-bold ${
                  darkMode
                    ? "text-white"
                    : "text-gray-900"
                }`}
              >
                📝 Improvement Suggestions
              </h3>

              <div className="mt-4 space-y-3">
                <div
                  className={`rounded-lg p-4 ${
                    darkMode
                      ? "bg-yellow-900/30"
                      : "bg-yellow-50"
                  }`}
                >
                  <p className="font-medium text-yellow-700">
                    💡 Add measurable achievements
                  </p>

                  <p
                    className={`mt-1 text-sm ${
                      darkMode
                        ? "text-gray-400"
                        : "text-gray-600"
                    }`}
                  >
                    Add numbers and measurable results to
                    your project and experience descriptions.
                  </p>
                </div>

                <div
                  className={`rounded-lg p-4 ${
                    darkMode
                      ? "bg-blue-900/30"
                      : "bg-blue-50"
                  }`}
                >
                  <p className="font-medium text-blue-700">
                    💡 Strengthen project descriptions
                  </p>

                  <p
                    className={`mt-1 text-sm ${
                      darkMode
                        ? "text-gray-400"
                        : "text-gray-600"
                    }`}
                  >
                    Explain what you built, which technologies
                    you used and what problem you solved.
                  </p>
                </div>

                <div
                  className={`rounded-lg p-4 ${
                    darkMode
                      ? "bg-green-900/30"
                      : "bg-green-50"
                  }`}
                >
                  <p className="font-medium text-green-700">
                    💡 Keep skills relevant
                  </p>

                  <p
                    className={`mt-1 text-sm ${
                      darkMode
                        ? "text-gray-400"
                        : "text-gray-600"
                    }`}
                  >
                    Focus your resume on skills that match
                    the jobs you are targeting.
                  </p>
                </div>
              </div>
            </div>

            {/* JOB READINESS */}

            <div
              className={`rounded-xl p-6 shadow-sm ${
                darkMode ? "bg-gray-800" : "bg-white"
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
                Your resume has a solid foundation for
                entry-level Full Stack Developer applications.
                Continue improving projects, DSA and
                interview preparation.
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
                    Good Foundation
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
                    style={{ width: "75%" }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ResumeAnalyzer;