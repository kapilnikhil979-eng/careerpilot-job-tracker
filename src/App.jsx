import { useEffect, useState } from "react";

import Sidebar from "./components/Sidebar.jsx";
import Header from "./components/Header.jsx";
import JobForm from "./components/JobForm.jsx";

import Dashboard from "./pages/Dashboard.jsx";
import Applications from "./pages/Applications.jsx";
import ResumeAnalyzer from "./pages/ResumeAnalyzer.jsx";
import InterviewPrep from "./pages/InterviewPrep.jsx";
import Settings from "./pages/Settings.jsx";

import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";
const API_URL = "https://careerpilot-backend-3yo2.onrender.com/api/jobs";
function App() {
  // =========================
  // AUTHENTICATION
  // =========================

  const [isLoggedIn, setIsLoggedIn] = useState(
    () => !!localStorage.getItem("token")
  );

  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");

    try {
      return savedUser ? JSON.parse(savedUser) : null;
    } catch (error) {
      console.error("USER DATA ERROR:", error);
      return null;
    }
  });

  const [showSignup, setShowSignup] = useState(false);

  // =========================
  // LOGIN
  // =========================

  function handleLogin(token, userData) {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(userData));

    setUser(userData);
    setIsLoggedIn(true);
  }

  // =========================
  // LOGOUT
  // =========================

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setUser(null);
    setIsLoggedIn(false);
    setShowSignup(false);
  }

  // =========================
  // PROFILE UPDATE
  // =========================

  function handleProfileUpdate(updatedUser) {
    localStorage.setItem("user", JSON.stringify(updatedUser));
    setUser(updatedUser);
  }

  // =========================
  // CURRENT PAGE
  // =========================

  const [currentPage, setCurrentPage] = useState("Dashboard");

  // =========================
  // MOBILE MENU
  // =========================

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // =========================
  // DARK MODE
  // =========================

  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("darkMode") === "true";
  });

  useEffect(() => {
    localStorage.setItem("darkMode", darkMode);
  }, [darkMode]);

  // =========================
  // JOB FORM
  // =========================

  const [showForm, setShowForm] = useState(false);

  const [formData, setFormData] = useState({
    company: "",
    position: "",
    location: "",
    salary: "",
  });

  const [editingJob, setEditingJob] = useState(null);

  // =========================
  // SEARCH & FILTER
  // =========================

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  // =========================
  // JOBS
  // =========================

  const [jobs, setJobs] = useState([]);

  // =========================
  // LOADING
  // =========================

  const [loading, setLoading] = useState(
    () => !!localStorage.getItem("token")
  );

  // =========================
  // ERROR
  // =========================

  const [error, setError] = useState("");

  // =========================
  // FETCH JOBS
  // =========================

  useEffect(() => {
    if (!isLoggedIn) {
      return;
    }

    async function fetchJobs() {
      try {
        setLoading(true);
        setError("");

        const token = localStorage.getItem("token");

        const response = await fetch(API_URL, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch jobs");
        }

        const data = await response.json();

        const formattedJobs = data.map((job) => ({
          ...job,
          id: job._id,
        }));

        setJobs(formattedJobs);
      } catch (error) {
        console.error("Error fetching jobs:", error);
        setError("Failed to load jobs. Please try again.");
      } finally {
        setLoading(false);
      }
    }

    fetchJobs();
  }, [isLoggedIn]);

  // =========================
  // ADD / EDIT JOB
  // =========================

  async function handleSubmit() {
    if (
      formData.company.trim() === "" ||
      formData.position.trim() === ""
    ) {
      alert("Please enter Company Name and Job Position");
      return;
    }

    try {
      setError("");

      // =========================
      // EDIT JOB
      // =========================

      if (editingJob) {
        const response = await fetch(
          `${API_URL}/${editingJob._id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            body: JSON.stringify(formData),
          }
        );

        if (!response.ok) {
          throw new Error("Failed to update job");
        }

        const updatedJob = await response.json();

        setJobs((previousJobs) =>
          previousJobs.map((job) =>
            job._id === updatedJob._id
              ? {
                  ...updatedJob,
                  id: updatedJob._id,
                }
              : job
          )
        );

        setEditingJob(null);
      }

      // =========================
      // ADD JOB
      // =========================

      else {
        const response = await fetch(API_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(formData),
        });

        if (!response.ok) {
          throw new Error("Failed to create job");
        }

        const newJob = await response.json();

        setJobs((previousJobs) => [
          ...previousJobs,
          {
            ...newJob,
            id: newJob._id,
          },
        ]);
      }

      // =========================
      // RESET FORM
      // =========================

      setFormData({
        company: "",
        position: "",
        location: "",
        salary: "",
      });

      setShowForm(false);
    } catch (error) {
      console.error("Error saving job:", error);
      setError("Failed to save job. Please try again.");
    }
  }

  // =========================
  // EDIT JOB
  // =========================

  function handleEdit(job) {
    setEditingJob(job);

    setFormData({
      company: job.company,
      position: job.position,
      location: job.location || "",
      salary: job.salary || "",
    });

    setShowForm(true);
  }

  // =========================
  // DELETE JOB
  // =========================

  async function handleDelete(id) {
    try {
      setError("");

      const job = jobs.find((job) => job.id === id);

      if (!job) {
        return;
      }

      const response = await fetch(
        `${API_URL}/${job._id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete job");
      }

      setJobs((previousJobs) =>
        previousJobs.filter((job) => job.id !== id)
      );
    } catch (error) {
      console.error("Error deleting job:", error);
      setError("Failed to delete job. Please try again.");
    }
  }

  // =========================
  // CHANGE STATUS
  // =========================

  async function handleStatusChange(id, newStatus) {
    try {
      setError("");

      const job = jobs.find((job) => job.id === id);

      if (!job) {
        return;
      }

      const response = await fetch(
        `${API_URL}/${job._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            status: newStatus,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update status");
      }

      const updatedJob = await response.json();

      setJobs((previousJobs) =>
        previousJobs.map((job) =>
          job.id === id
            ? {
                ...updatedJob,
                id: updatedJob._id,
              }
            : job
        )
      );
    } catch (error) {
      console.error("Error changing status:", error);
      setError("Failed to update status. Please try again.");
    }
  }

  // =========================
  // CANCEL FORM
  // =========================

  function handleCancel() {
    setEditingJob(null);

    setFormData({
      company: "",
      position: "",
      location: "",
      salary: "",
    });

    setShowForm(false);
  }

  // =========================
  // ADD JOB BUTTON
  // =========================

  function handleAddJob() {
    setEditingJob(null);

    setFormData({
      company: "",
      position: "",
      location: "",
      salary: "",
    });

    setShowForm(true);
  }

  // =========================
  // NAVIGATION
  // =========================

  function handleNavigation(page) {
    if (page === "Logout") {
      handleLogout();
      return;
    }

    setCurrentPage(page);
    setShowForm(false);

    // Close mobile sidebar after selecting a page
    setMobileMenuOpen(false);
  }

  // =========================
  // RENDER PAGES
  // =========================

  function renderPage() {
    if (currentPage === "Dashboard") {
      return (
        <Dashboard
          jobs={jobs}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          handleStatusChange={handleStatusChange}
          handleEdit={handleEdit}
          handleDelete={handleDelete}
          handleAddJob={handleAddJob}
          darkMode={darkMode}
          loading={loading}
        />
      );
    }

    if (currentPage === "Job Applications") {
      return (
        <Applications
          jobs={jobs}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          handleStatusChange={handleStatusChange}
          handleEdit={handleEdit}
          handleDelete={handleDelete}
          handleAddJob={handleAddJob}
          darkMode={darkMode}
          loading={loading}
        />
      );
    }

    if (currentPage === "Resume Analyzer") {
      return <ResumeAnalyzer darkMode={darkMode} />;
    }

    if (currentPage === "Interview Prep") {
      return <InterviewPrep darkMode={darkMode} />;
    }

    if (currentPage === "Settings") {
      return (
        <Settings
          darkMode={darkMode}
          setDarkMode={setDarkMode}
          user={user}
          onProfileUpdate={handleProfileUpdate}
        />
      );
    }

    return null;
  }

  // =========================
  // LOGIN / SIGNUP
  // =========================

  if (!isLoggedIn) {
    if (showSignup) {
      return (
        <Signup
          onSignup={() => {
            setShowSignup(false);
          }}
        />
      );
    }

    return (
      <Login
        onLogin={handleLogin}
        onSignup={() => setShowSignup(true)}
      />
    );
  }

  // =========================
  // MAIN UI
  // =========================

  return (
    <div
      className={`min-h-screen ${
        darkMode
          ? "bg-gray-900 text-white"
          : "bg-gray-100 text-gray-900"
      }`}
    >
      {/* =========================
          MOBILE SIDEBAR OVERLAY
      ========================= */}

      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          {/* Dark backdrop */}
          <div
            className="absolute inset-0 bg-black/60"
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Mobile Sidebar */}
          <div className="relative z-10 h-full w-64">
            <Sidebar
              currentPage={currentPage}
              onNavigate={handleNavigation}
              darkMode={darkMode}
            />
          </div>
        </div>
      )}

      {/* =========================
          DESKTOP SIDEBAR
      ========================= */}

      <div className="hidden md:block">
        <Sidebar
          currentPage={currentPage}
          onNavigate={handleNavigation}
          darkMode={darkMode}
        />
      </div>

      {/* =========================
          MAIN CONTENT
      ========================= */}

      <main className="ml-0 min-w-0 p-4 sm:p-6 md:ml-64 md:p-8">

        {/* =========================
            MOBILE TOP BAR
        ========================= */}

        <div className="mb-5 flex items-center justify-between md:hidden">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            className={`flex h-10 w-10 items-center justify-center rounded-lg text-xl shadow ${
              darkMode
                ? "bg-gray-800 text-white"
                : "bg-white text-gray-900"
            }`}
            aria-label="Open menu"
          >
            ☰
          </button>

          <h1
            className={`text-lg font-bold ${
              darkMode ? "text-white" : "text-gray-900"
            }`}
          >
            CareerPilot
          </h1>

          {/* Keeps title centered */}
          <div className="w-10" />
        </div>

        {/* =========================
            DESKTOP HEADER
        ========================= */}

        <div className="hidden md:block">
          <Header
            darkMode={darkMode}
            user={user}
            onLogout={handleLogout}
          />
        </div>

        {/* =========================
            ERROR MESSAGE
        ========================= */}

        {error && (
          <div className="mb-6 rounded-lg border border-red-300 bg-red-100 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* =========================
            PAGE CONTENT
        ========================= */}

        <div className="min-w-0">
          {renderPage()}
        </div>

        {/* =========================
            JOB FORM
        ========================= */}

        <JobForm
          showForm={showForm}
          formData={formData}
          setFormData={setFormData}
          editingJob={editingJob}
          handleSubmit={handleSubmit}
          handleCancel={handleCancel}
          darkMode={darkMode}
        />
      </main>
    </div>
  );
}

export default App;