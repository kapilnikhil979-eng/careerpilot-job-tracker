import StatCard from "../components/StatCard";
import JobTable from "../components/JobTable";

function Dashboard({
  jobs,
  searchTerm,
  setSearchTerm,
  statusFilter,
  setStatusFilter,
  handleStatusChange,
  handleEdit,
  handleDelete,
  handleAddJob,
  darkMode,
}) {
  const totalApplications = jobs.length;

  const interviews = jobs.filter(
    (job) => job.status === "Interview"
  ).length;

  const selected = jobs.filter(
    (job) => job.status === "Selected"
  ).length;

  const rejected = jobs.filter(
    (job) => job.status === "Rejected"
  ).length;

  return (
    <div className="w-full min-w-0">

      {/* =========================
          PAGE HEADER
      ========================= */}

      <div className="mb-6 sm:mb-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">

          <div>
            <p
              className={`mb-1 text-sm font-medium ${
                darkMode ? "text-blue-400" : "text-blue-600"
              }`}
            >
              Career Overview
            </p>

            <h2
              className={`text-2xl font-bold sm:text-3xl ${
                darkMode ? "text-white" : "text-gray-900"
              }`}
            >
              Dashboard
            </h2>

            <p
              className={`mt-1 text-sm sm:text-base ${
                darkMode ? "text-gray-400" : "text-gray-500"
              }`}
            >
              Track your job applications and career progress.
            </p>
          </div>

          {/* Add Job Button */}
          <button
            type="button"
            onClick={handleAddJob}
            className="w-full rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 active:scale-[0.98] sm:w-auto"
          >
            + Add Job
          </button>
        </div>
      </div>

      {/* =========================
          STATISTICS
      ========================= */}

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:mb-8 lg:grid-cols-4 lg:gap-6">

        <StatCard
          title="Total Applications"
          value={totalApplications}
          icon="💼"
          darkMode={darkMode}
        />

        <StatCard
          title="Interviews"
          value={interviews}
          icon="🎤"
          darkMode={darkMode}
        />

        <StatCard
          title="Selected"
          value={selected}
          icon="🎯"
          darkMode={darkMode}
        />

        <StatCard
          title="Rejected"
          value={rejected}
          icon="❌"
          darkMode={darkMode}
        />

      </div>

      {/* =========================
          APPLICATIONS SECTION
      ========================= */}

      <section
        className={`min-w-0 overflow-hidden rounded-xl border shadow-sm ${
          darkMode
            ? "border-gray-700 bg-gray-800"
            : "border-gray-200 bg-white"
        }`}
      >
        {/* Section Header */}

        <div
          className={`border-b px-4 py-4 sm:px-6 ${
            darkMode ? "border-gray-700" : "border-gray-200"
          }`}
        >
          <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3
                className={`text-lg font-semibold ${
                  darkMode ? "text-white" : "text-gray-900"
                }`}
              >
                Recent Applications
              </h3>

              <p
                className={`text-sm ${
                  darkMode ? "text-gray-400" : "text-gray-500"
                }`}
              >
                Manage and track your job applications.
              </p>
            </div>

            <span
              className={`w-fit rounded-full px-3 py-1 text-xs font-medium ${
                darkMode
                  ? "bg-blue-900/40 text-blue-300"
                  : "bg-blue-50 text-blue-600"
              }`}
            >
              {totalApplications}{" "}
              {totalApplications === 1
                ? "Application"
                : "Applications"}
            </span>
          </div>
        </div>

        {/* Job Table */}

        <div className="min-w-0 overflow-x-auto">
          <JobTable
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
          />
        </div>
      </section>

    </div>
  );
}

export default Dashboard;