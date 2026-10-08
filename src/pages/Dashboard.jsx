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
    <div className="w-full min-w-0 max-w-full overflow-x-hidden">
      {/* =========================
          DASHBOARD HEADER
      ========================= */}

      <div className="mb-5 sm:mb-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div className="min-w-0">
            <p
              className={`mb-1 text-xs font-medium sm:text-sm ${
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
              className={`mt-1 max-w-xl text-xs sm:text-sm ${
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
          STAT CARDS
      ========================= */}

      <div className="mb-5 grid w-full min-w-0 max-w-full grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:mb-8 lg:grid-cols-4 lg:gap-6">
        {/* Total Applications */}

        <div className="min-w-0 w-full">
          <StatCard
            title="Total Applications"
            value={totalApplications}
            icon="💼"
            darkMode={darkMode}
          />
        </div>

        {/* Interviews */}

        <div className="min-w-0 w-full">
          <StatCard
            title="Interviews"
            value={interviews}
            icon="🎤"
            darkMode={darkMode}
          />
        </div>

        {/* Selected */}

        <div className="min-w-0 w-full">
          <StatCard
            title="Selected"
            value={selected}
            icon="🎯"
            darkMode={darkMode}
          />
        </div>

        {/* Rejected */}

        <div className="min-w-0 w-full">
          <StatCard
            title="Rejected"
            value={rejected}
            icon="❌"
            darkMode={darkMode}
          />
        </div>
      </div>

      {/* =========================
          JOB TABLE
      ========================= */}

      <div className="w-full min-w-0 max-w-full overflow-hidden">
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
    </div>
  );
}

export default Dashboard;