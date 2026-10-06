import JobTable from "../components/JobTable";

function Applications({
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
  return (
    <div>
      {/* Page Header */}
      <div className="mb-8">
        <h2
          className={`text-3xl font-bold ${
            darkMode ? "text-white" : "text-gray-900"
          }`}
        >
          Job Applications
        </h2>

        <p
          className={`mt-1 ${
            darkMode ? "text-gray-400" : "text-gray-500"
          }`}
        >
          Manage and track all your job applications.
        </p>
      </div>

      {/* Statistics */}
      <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-3">

        {/* Total Applications */}
        <div
          className={`rounded-xl p-6 shadow-sm ${
            darkMode ? "bg-gray-800" : "bg-white"
          }`}
        >
          <p
            className={`text-sm ${
              darkMode ? "text-gray-400" : "text-gray-500"
            }`}
          >
            Total Applications
          </p>

          <h3
            className={`mt-2 text-3xl font-bold ${
              darkMode ? "text-white" : "text-gray-900"
            }`}
          >
            {jobs.length}
          </h3>
        </div>

        {/* Active Applications */}
        <div
          className={`rounded-xl p-6 shadow-sm ${
            darkMode ? "bg-gray-800" : "bg-white"
          }`}
        >
          <p
            className={`text-sm ${
              darkMode ? "text-gray-400" : "text-gray-500"
            }`}
          >
            Active Applications
          </p>

          <h3
            className={`mt-2 text-3xl font-bold ${
              darkMode ? "text-white" : "text-gray-900"
            }`}
          >
            {
              jobs.filter(
                (job) =>
                  job.status === "Applied" ||
                  job.status === "Interview"
              ).length
            }
          </h3>
        </div>

        {/* Successful */}
        <div
          className={`rounded-xl p-6 shadow-sm ${
            darkMode ? "bg-gray-800" : "bg-white"
          }`}
        >
          <p
            className={`text-sm ${
              darkMode ? "text-gray-400" : "text-gray-500"
            }`}
          >
            Successful
          </p>

          <h3
            className={`mt-2 text-3xl font-bold ${
              darkMode ? "text-white" : "text-gray-900"
            }`}
          >
            {
              jobs.filter(
                (job) => job.status === "Selected"
              ).length
            }
          </h3>
        </div>
      </div>

      {/* Job Table */}
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
  );
}

export default Applications;