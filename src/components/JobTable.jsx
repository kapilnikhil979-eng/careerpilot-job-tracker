function JobTable({
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
  const filteredJobs = jobs
    .filter((job) => {
      const company = job.company?.toLowerCase() || "";
      const position = job.position?.toLowerCase() || "";
      const search = searchTerm.toLowerCase();

      return (
        company.includes(search) ||
        position.includes(search)
      );
    })
    .filter(
      (job) =>
        statusFilter === "All" ||
        job.status === statusFilter
    );

  return (
    <div
      className={`mt-8 min-w-0 rounded-xl border p-4 shadow-sm sm:p-6 ${
        darkMode
          ? "border-gray-700 bg-gray-800"
          : "border-gray-200 bg-white"
      }`}
    >
      {/* =========================
          TOP BAR
      ========================= */}

      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

        {/* Title */}
        <div>
          <h3
            className={`text-xl font-bold ${
              darkMode ? "text-white" : "text-gray-900"
            }`}
          >
            Recent Applications
          </h3>

          <p
            className={`mt-1 text-sm ${
              darkMode ? "text-gray-400" : "text-gray-500"
            }`}
          >
            {filteredJobs.length}{" "}
            {filteredJobs.length === 1
              ? "application"
              : "applications"}{" "}
            found
          </p>
        </div>

        {/* Controls */}
        <div className="flex w-full flex-col gap-3 sm:flex-row lg:w-auto">

          {/* Search */}
          <input
            type="text"
            placeholder="Search jobs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`w-full rounded-lg border px-4 py-2.5 text-sm outline-none transition focus:ring-2 focus:ring-blue-500 sm:w-56 ${
              darkMode
                ? "border-gray-600 bg-gray-700 text-white placeholder-gray-400"
                : "border-gray-300 bg-white text-gray-900 placeholder-gray-400"
            }`}
          />

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className={`w-full rounded-lg border px-4 py-2.5 text-sm outline-none transition focus:ring-2 focus:ring-blue-500 sm:w-36 ${
              darkMode
                ? "border-gray-600 bg-gray-700 text-white"
                : "border-gray-300 bg-white text-gray-900"
            }`}
          >
            <option value="All">All Status</option>
            <option value="Applied">Applied</option>
            <option value="Interview">Interview</option>
            <option value="Selected">Selected</option>
            <option value="Rejected">Rejected</option>
          </select>

          {/* Add Job */}
          <button
            type="button"
            onClick={handleAddJob}
            className="w-full rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 active:scale-[0.98] sm:w-auto"
          >
            + Add Job
          </button>
        </div>
      </div>

      {/* =========================
          MOBILE TABLE
      ========================= */}

      <div className="mt-6 overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
        <table className="min-w-[720px] w-full text-left">
          <thead>
            <tr
              className={`border-b text-sm ${
                darkMode
                  ? "border-gray-700 bg-gray-900/50 text-gray-400"
                  : "border-gray-200 bg-gray-50 text-gray-500"
              }`}
            >
              <th className="px-4 py-3 font-semibold">
                Company
              </th>

              <th className="px-4 py-3 font-semibold">
                Position
              </th>

              <th className="px-4 py-3 font-semibold">
                Status
              </th>

              <th className="px-4 py-3 font-semibold">
                Date
              </th>

              <th className="px-4 py-3 font-semibold">
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {/* =========================
                EMPTY STATE
            ========================= */}

            {filteredJobs.length === 0 ? (
              <tr>
                <td
                  colSpan="5"
                  className={`px-4 py-12 text-center ${
                    darkMode
                      ? "text-gray-400"
                      : "text-gray-500"
                  }`}
                >
                  <div className="flex flex-col items-center justify-center">
                    <div className="mb-3 text-4xl">
                      📋
                    </div>

                    <p
                      className={`text-base font-semibold ${
                        darkMode
                          ? "text-gray-200"
                          : "text-gray-700"
                      }`}
                    >
                      No applications found
                    </p>

                    <p className="mt-1 text-sm">
                      Try changing your search or filter.
                    </p>

                    {jobs.length === 0 && (
                      <button
                        type="button"
                        onClick={handleAddJob}
                        className="mt-4 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
                      >
                        + Add Your First Job
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ) : (
              filteredJobs.map((job) => (
                <tr
                  key={job.id}
                  className={`border-b transition ${
                    darkMode
                      ? "border-gray-700 hover:bg-gray-700/40"
                      : "border-gray-200 hover:bg-gray-50"
                  }`}
                >
                  {/* =========================
                      COMPANY
                  ========================= */}

                  <td
                    className={`px-4 py-4 font-semibold ${
                      darkMode
                        ? "text-white"
                        : "text-gray-900"
                    }`}
                  >
                    {job.company}
                  </td>

                  {/* =========================
                      POSITION
                  ========================= */}

                  <td
                    className={`px-4 py-4 ${
                      darkMode
                        ? "text-gray-300"
                        : "text-gray-700"
                    }`}
                  >
                    {job.position}
                  </td>

                  {/* =========================
                      STATUS
                  ========================= */}

                  <td className="px-4 py-4">
                    <select
                      value={job.status}
                      onChange={(e) =>
                        handleStatusChange(
                          job.id,
                          e.target.value
                        )
                      }
                      className={`rounded-full px-3 py-1.5 text-xs font-semibold outline-none transition ${
                        job.status === "Interview"
                          ? "bg-yellow-100 text-yellow-700"
                          : job.status === "Selected"
                          ? "bg-green-100 text-green-700"
                          : job.status === "Rejected"
                          ? "bg-red-100 text-red-700"
                          : "bg-blue-100 text-blue-700"
                      }`}
                    >
                      <option value="Applied">
                        Applied
                      </option>

                      <option value="Interview">
                        Interview
                      </option>

                      <option value="Selected">
                        Selected
                      </option>

                      <option value="Rejected">
                        Rejected
                      </option>
                    </select>
                  </td>

                  {/* =========================
                      DATE
                  ========================= */}

                  <td
                    className={`whitespace-nowrap px-4 py-4 text-sm ${
                      darkMode
                        ? "text-gray-400"
                        : "text-gray-500"
                    }`}
                  >
                    {job.date}
                  </td>

                  {/* =========================
                      ACTIONS
                  ========================= */}

                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleEdit(job)}
                        className="rounded-lg bg-yellow-500 px-3 py-1.5 text-sm font-medium text-white transition hover:bg-yellow-600 active:scale-95"
                      >
                        Edit
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          handleDelete(job.id)
                        }
                        className="rounded-lg bg-red-500 px-3 py-1.5 text-sm font-medium text-white transition hover:bg-red-600 active:scale-95"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* =========================
          MOBILE HINT
      ========================= */}

      {filteredJobs.length > 0 && (
        <p
          className={`mt-3 text-center text-xs sm:hidden ${
            darkMode
              ? "text-gray-500"
              : "text-gray-400"
          }`}
        >
          ← Swipe left/right to view the table →
        </p>
      )}
    </div>
  );
}

export default JobTable;