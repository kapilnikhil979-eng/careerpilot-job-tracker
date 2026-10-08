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
      const company =
        job.company?.toLowerCase() || "";

      const position =
        job.position?.toLowerCase() || "";

      const search =
        searchTerm.toLowerCase();

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

  // =========================
  // STATUS STYLE
  // =========================

  const getStatusClasses = (status) => {
    if (status === "Interview") {
      return darkMode
        ? "bg-yellow-900/40 text-yellow-300"
        : "bg-yellow-100 text-yellow-700";
    }

    if (status === "Selected") {
      return darkMode
        ? "bg-green-900/40 text-green-300"
        : "bg-green-100 text-green-700";
    }

    if (status === "Rejected") {
      return darkMode
        ? "bg-red-900/40 text-red-300"
        : "bg-red-100 text-red-700";
    }

    return darkMode
      ? "bg-blue-900/40 text-blue-300"
      : "bg-blue-100 text-blue-700";
  };

  return (
    <div
      className={`mt-5 w-full min-w-0 max-w-full overflow-hidden rounded-xl border p-3 shadow-sm sm:mt-8 sm:p-6 ${
        darkMode
          ? "border-gray-700 bg-gray-800"
          : "border-gray-200 bg-white"
      }`}
    >
      {/* =========================
          HEADER
      ========================= */}

      <div className="w-full min-w-0">
        <div className="flex flex-col gap-4">
          {/* Title */}

          <div className="min-w-0">
            <h3
              className={`text-lg font-bold sm:text-xl ${
                darkMode
                  ? "text-white"
                  : "text-gray-900"
              }`}
            >
              Recent Applications
            </h3>

            <p
              className={`mt-1 text-xs sm:text-sm ${
                darkMode
                  ? "text-gray-400"
                  : "text-gray-500"
              }`}
            >
              {filteredJobs.length}{" "}
              {filteredJobs.length === 1
                ? "application"
                : "applications"}{" "}
              found
            </p>
          </div>

          {/* =========================
              CONTROLS
          ========================= */}

          <div className="flex w-full min-w-0 flex-col gap-2">
            {/* Search */}

            <input
              type="text"
              placeholder="Search jobs..."
              value={searchTerm}
              onChange={(e) =>
                setSearchTerm(e.target.value)
              }
              className={`box-border w-full min-w-0 rounded-lg border px-3 py-2.5 text-sm outline-none transition focus:ring-2 focus:ring-blue-500 ${
                darkMode
                  ? "border-gray-600 bg-gray-700 text-white placeholder-gray-400"
                  : "border-gray-300 bg-white text-gray-900 placeholder-gray-400"
              }`}
            />

            {/* Status */}

            <select
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(e.target.value)
              }
              className={`box-border w-full min-w-0 rounded-lg border px-3 py-2.5 text-sm outline-none transition focus:ring-2 focus:ring-blue-500 ${
                darkMode
                  ? "border-gray-600 bg-gray-700 text-white"
                  : "border-gray-300 bg-white text-gray-900"
              }`}
            >
              <option value="All">
                All Status
              </option>

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

            {/* Add Job */}

            <button
              type="button"
              onClick={handleAddJob}
              className="w-full rounded-lg bg-blue-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 active:scale-[0.98]"
            >
              + Add Job
            </button>
          </div>
        </div>
      </div>

      {/* =========================
          EMPTY STATE
      ========================= */}

      {filteredJobs.length === 0 ? (
        <div
          className={`mt-5 rounded-xl border px-4 py-10 text-center sm:mt-6 ${
            darkMode
              ? "border-gray-700 bg-gray-900/40"
              : "border-gray-200 bg-gray-50"
          }`}
        >
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

          <p
            className={`mt-1 text-sm ${
              darkMode
                ? "text-gray-400"
                : "text-gray-500"
            }`}
          >
            {jobs.length === 0
              ? "Start tracking your job applications."
              : "Try changing your search or filter."}
          </p>

          {jobs.length === 0 && (
            <button
              type="button"
              onClick={handleAddJob}
              className="mt-4 w-full max-w-xs rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700"
            >
              + Add Your First Job
            </button>
          )}
        </div>
      ) : (
        <>
          {/* ==================================================
              MOBILE CARDS
          ================================================== */}

          <div className="mt-5 grid w-full min-w-0 grid-cols-1 gap-3 sm:hidden">
            {filteredJobs.map((job) => (
              <div
                key={job.id}
                className={`w-full min-w-0 overflow-hidden rounded-xl border p-4 ${
                  darkMode
                    ? "border-gray-700 bg-gray-900"
                    : "border-gray-200 bg-gray-50"
                }`}
              >
                {/* Company + Status */}

                <div className="flex min-w-0 items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <h4
                      className={`break-words text-base font-semibold ${
                        darkMode
                          ? "text-white"
                          : "text-gray-900"
                      }`}
                    >
                      {job.company}
                    </h4>

                    <p
                      className={`mt-1 break-words text-sm ${
                        darkMode
                          ? "text-gray-300"
                          : "text-gray-600"
                      }`}
                    >
                      {job.position}
                    </p>
                  </div>

                  <span
                    className={`max-w-[100px] shrink-0 truncate rounded-full px-2.5 py-1 text-xs font-semibold ${getStatusClasses(
                      job.status
                    )}`}
                  >
                    {job.status}
                  </span>
                </div>

                {/* Details */}

                <div
                  className={`mt-4 grid grid-cols-1 gap-3 border-t pt-3 ${
                    darkMode
                      ? "border-gray-700"
                      : "border-gray-200"
                  }`}
                >
                  {/* Date */}

                  <div className="min-w-0">
                    <p
                      className={`text-xs ${
                        darkMode
                          ? "text-gray-500"
                          : "text-gray-400"
                      }`}
                    >
                      Date
                    </p>

                    <p
                      className={`mt-1 break-words text-sm font-medium ${
                        darkMode
                          ? "text-gray-300"
                          : "text-gray-700"
                      }`}
                    >
                      {job.date || "—"}
                    </p>
                  </div>

                  {/* Status */}

                  <div className="min-w-0">
                    <p
                      className={`text-xs ${
                        darkMode
                          ? "text-gray-500"
                          : "text-gray-400"
                      }`}
                    >
                      Status
                    </p>

                    <select
                      value={job.status}
                      onChange={(e) =>
                        handleStatusChange(
                          job.id,
                          e.target.value
                        )
                      }
                      className={`mt-1 box-border w-full min-w-0 rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500 ${
                        darkMode
                          ? "border-gray-600 bg-gray-800 text-gray-200"
                          : "border-gray-300 bg-white text-gray-700"
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
                  </div>
                </div>

                {/* Actions */}

                <div className="mt-4 grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      handleEdit(job)
                    }
                    className="min-w-0 rounded-lg bg-yellow-500 px-3 py-2.5 text-sm font-medium text-white transition hover:bg-yellow-600 active:scale-95"
                  >
                    Edit
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      handleDelete(job.id)
                    }
                    className="min-w-0 rounded-lg bg-red-500 px-3 py-2.5 text-sm font-medium text-white transition hover:bg-red-600 active:scale-95"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* ==================================================
              DESKTOP TABLE
          ================================================== */}

          <div className="mt-6 hidden overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700 sm:block">
            <table className="w-full min-w-[700px] text-left">
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
                {filteredJobs.map((job) => (
                  <tr
                    key={job.id}
                    className={`border-b transition ${
                      darkMode
                        ? "border-gray-700 hover:bg-gray-700/40"
                        : "border-gray-200 hover:bg-gray-50"
                    }`}
                  >
                    {/* Company */}

                    <td
                      className={`max-w-[180px] truncate px-4 py-4 font-semibold ${
                        darkMode
                          ? "text-white"
                          : "text-gray-900"
                      }`}
                    >
                      {job.company}
                    </td>

                    {/* Position */}

                    <td
                      className={`max-w-[220px] truncate px-4 py-4 ${
                        darkMode
                          ? "text-gray-300"
                          : "text-gray-700"
                      }`}
                    >
                      {job.position}
                    </td>

                    {/* Status */}

                    <td className="px-4 py-4">
                      <select
                        value={job.status}
                        onChange={(e) =>
                          handleStatusChange(
                            job.id,
                            e.target.value
                          )
                        }
                        className={`rounded-full px-3 py-1.5 text-xs font-semibold outline-none transition ${getStatusClasses(
                          job.status
                        )}`}
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

                    {/* Date */}

                    <td
                      className={`whitespace-nowrap px-4 py-4 text-sm ${
                        darkMode
                          ? "text-gray-400"
                          : "text-gray-500"
                      }`}
                    >
                      {job.date || "—"}
                    </td>

                    {/* Actions */}

                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() =>
                            handleEdit(job)
                          }
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
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}

export default JobTable;