import { useState } from "react";

function Settings({
  darkMode,
  setDarkMode,
  user,
  onProfileUpdate,
}) {
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // =========================
  // SAVE PROFILE
  // =========================

  async function handleSaveProfile() {
    setMessage("");
    setError("");

    if (!name.trim() || !email.trim()) {
      setError("Name and email are required.");
      return;
    }

    if (!user) {
      setError("User information not found.");
      return;
    }

    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      if (!token) {
        setError("You are not logged in.");
        return;
      }

      const response = await fetch(
        "http://localhost:5000/api/auth/profile",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            name: name.trim(),
            email: email.trim(),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Failed to update profile.");
        return;
      }

      // Update user in App.jsx + localStorage
      onProfileUpdate(data.user);

      // Update input fields
      setName(data.user.name);
      setEmail(data.user.email);

      setMessage("Profile updated successfully ✅");
    } catch (error) {
      console.error("UPDATE PROFILE ERROR:", error);

      setError(
        "Unable to connect to server. Make sure backend is running."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      {/* =========================
          PAGE HEADER
      ========================= */}

      <div className="mb-8">
        <h2
          className={`text-3xl font-bold ${
            darkMode ? "text-white" : "text-gray-900"
          }`}
        >
          Settings
        </h2>

        <p
          className={`mt-1 ${
            darkMode ? "text-gray-400" : "text-gray-500"
          }`}
        >
          Manage your CareerPilot preferences.
        </p>
      </div>

      {/* =========================
          APPEARANCE
      ========================= */}

      <div
        className={`mb-6 rounded-xl p-6 shadow-sm ${
          darkMode ? "bg-gray-800" : "bg-white"
        }`}
      >
        <h3
          className={`text-xl font-bold ${
            darkMode ? "text-white" : "text-gray-900"
          }`}
        >
          Appearance
        </h3>

        <div className="mt-5 flex items-center justify-between">
          <div>
            <p
              className={`font-medium ${
                darkMode ? "text-white" : "text-gray-800"
              }`}
            >
              Dark Mode
            </p>

            <p
              className={`mt-1 text-sm ${
                darkMode ? "text-gray-400" : "text-gray-500"
              }`}
            >
              Switch between light and dark appearance.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setDarkMode(!darkMode)}
            className={`relative h-7 w-14 rounded-full transition ${
              darkMode ? "bg-blue-600" : "bg-gray-300"
            }`}
          >
            <span
              className={`absolute top-1 h-5 w-5 rounded-full bg-white transition ${
                darkMode ? "left-8" : "left-1"
              }`}
            ></span>
          </button>
        </div>
      </div>

      {/* =========================
          PROFILE
      ========================= */}

      <div
        className={`mb-6 rounded-xl p-6 shadow-sm ${
          darkMode ? "bg-gray-800" : "bg-white"
        }`}
      >
        <h3
          className={`text-xl font-bold ${
            darkMode ? "text-white" : "text-gray-900"
          }`}
        >
          Profile
        </h3>

        {/* SUCCESS MESSAGE */}

        {message && (
          <div className="mt-4 rounded-lg border border-green-300 bg-green-100 px-4 py-3 text-green-700">
            {message}
          </div>
        )}

        {/* ERROR MESSAGE */}

        {error && (
          <div className="mt-4 rounded-lg border border-red-300 bg-red-100 px-4 py-3 text-red-700">
            {error}
          </div>
        )}

        <div className="mt-5 grid gap-4 md:grid-cols-2">
          {/* NAME */}

          <div>
            <label
              className={`mb-2 block font-medium ${
                darkMode ? "text-gray-200" : "text-gray-700"
              }`}
            >
              Name
            </label>

            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your Name"
              className={`w-full rounded-lg border px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 ${
                darkMode
                  ? "border-gray-600 bg-gray-700 text-white placeholder-gray-400"
                  : "border-gray-300 bg-white text-gray-900"
              }`}
            />
          </div>

          {/* EMAIL */}

          <div>
            <label
              className={`mb-2 block font-medium ${
                darkMode ? "text-gray-200" : "text-gray-700"
              }`}
            >
              Email
            </label>

            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email Address"
              className={`w-full rounded-lg border px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 ${
                darkMode
                  ? "border-gray-600 bg-gray-700 text-white placeholder-gray-400"
                  : "border-gray-300 bg-white text-gray-900"
              }`}
            />
          </div>
        </div>

        {/* UPDATE PROFILE BUTTON */}

        <button
          type="button"
          onClick={handleSaveProfile}
          disabled={loading}
          className={`mt-5 rounded-lg px-5 py-3 font-medium text-white transition ${
            loading
              ? "cursor-not-allowed bg-blue-400"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {loading ? "Updating..." : "Update Profile"}
        </button>
      </div>

      {/* =========================
          NOTIFICATIONS
      ========================= */}

      <div
        className={`mb-6 rounded-xl p-6 shadow-sm ${
          darkMode ? "bg-gray-800" : "bg-white"
        }`}
      >
        <h3
          className={`text-xl font-bold ${
            darkMode ? "text-white" : "text-gray-900"
          }`}
        >
          Notifications
        </h3>

        <div className="mt-5 space-y-4">
          {/* JOB REMINDERS */}

          <label className="flex cursor-pointer items-center gap-3">
            <input
              type="checkbox"
              className="h-4 w-4"
            />

            <span
              className={
                darkMode ? "text-gray-300" : "text-gray-700"
              }
            >
              Job application reminders
            </span>
          </label>

          {/* INTERVIEW REMINDERS */}

          <label className="flex cursor-pointer items-center gap-3">
            <input
              type="checkbox"
              className="h-4 w-4"
            />

            <span
              className={
                darkMode ? "text-gray-300" : "text-gray-700"
              }
            >
              Interview reminders
            </span>
          </label>
        </div>
      </div>

      {/* =========================
          ACCOUNT INFORMATION
      ========================= */}

      <div
        className={`rounded-xl p-6 shadow-sm ${
          darkMode ? "bg-gray-800" : "bg-white"
        }`}
      >
        <h3
          className={`text-xl font-bold ${
            darkMode ? "text-white" : "text-gray-900"
          }`}
        >
          Account Information
        </h3>

        <div className="mt-4">
          <p
            className={`text-sm ${
              darkMode ? "text-gray-400" : "text-gray-500"
            }`}
          >
            Account Email
          </p>

          <p
            className={`mt-1 font-medium ${
              darkMode ? "text-white" : "text-gray-800"
            }`}
          >
            {user?.email || "No email available"}
          </p>
        </div>
      </div>
    </div>
  );
}

export default Settings;