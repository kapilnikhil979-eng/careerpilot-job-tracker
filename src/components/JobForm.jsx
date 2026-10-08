function JobForm({
  showForm,
  formData,
  setFormData,
  editingJob,
  handleSubmit,
  handleCancel,
  darkMode,
}) {
  if (!showForm) {
    return null;
  }

  const inputClass = `w-full rounded-lg border px-4 py-3 text-sm outline-none transition focus:ring-2 focus:ring-blue-500 ${
    darkMode
      ? "border-gray-600 bg-gray-700 text-white placeholder-gray-400"
      : "border-gray-300 bg-white text-gray-900 placeholder-gray-400"
  }`;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto bg-black/50 px-4 py-6 backdrop-blur-sm sm:items-center sm:py-8"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          handleCancel();
        }
      }}
    >
      <section
        className={`my-auto flex max-h-[70vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border shadow-2xl sm:max-h-[85vh] ${
          darkMode
            ? "border-gray-700 bg-gray-800"
            : "border-gray-200 bg-white"
        }`}
      >
        {/* HEADER */}
        <div className="flex shrink-0 items-start justify-between gap-4 border-b px-5 py-5 sm:px-7">
          <div className="min-w-0">
            <p
              className={`mb-1 text-sm font-medium ${
                darkMode ? "text-blue-400" : "text-blue-600"
              }`}
            >
              {editingJob ? "Update Application" : "New Application"}
            </p>

            <h3
              className={`text-xl font-bold sm:text-2xl ${
                darkMode ? "text-white" : "text-gray-900"
              }`}
            >
              {editingJob ? "Edit Job" : "Add New Job"}
            </h3>

            <p
              className={`mt-1 text-sm ${
                darkMode ? "text-gray-400" : "text-gray-500"
              }`}
            >
              {editingJob
                ? "Update your job application details."
                : "Add a new job application to your tracker."}
            </p>
          </div>

          <button
            type="button"
            onClick={handleCancel}
            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-lg transition ${
              darkMode
                ? "bg-gray-700 text-gray-300 hover:bg-gray-600 hover:text-white"
                : "bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-gray-900"
            }`}
            aria-label="Close form"
          >
            ✕
          </button>
        </div>

        {/* SCROLLABLE CONTENT */}
        <div className="overflow-y-auto px-5 py-5 sm:px-7">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {/* Company */}
            <div>
              <label
                className={`mb-2 block text-sm font-medium ${
                  darkMode ? "text-gray-200" : "text-gray-700"
                }`}
              >
                Company Name
                <span className="ml-1 text-red-500">*</span>
              </label>

              <input
                type="text"
                placeholder="e.g. Google"
                value={formData.company}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    company: e.target.value,
                  })
                }
                className={inputClass}
              />
            </div>

            {/* Position */}
            <div>
              <label
                className={`mb-2 block text-sm font-medium ${
                  darkMode ? "text-gray-200" : "text-gray-700"
                }`}
              >
                Job Position
                <span className="ml-1 text-red-500">*</span>
              </label>

              <input
                type="text"
                placeholder="e.g. Frontend Developer"
                value={formData.position}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    position: e.target.value,
                  })
                }
                className={inputClass}
              />
            </div>

            {/* Location */}
            <div>
              <label
                className={`mb-2 block text-sm font-medium ${
                  darkMode ? "text-gray-200" : "text-gray-700"
                }`}
              >
                Location
              </label>

              <input
                type="text"
                placeholder="e.g. Bangalore / Remote"
                value={formData.location}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    location: e.target.value,
                  })
                }
                className={inputClass}
              />
            </div>

            {/* Salary */}
            <div>
              <label
                className={`mb-2 block text-sm font-medium ${
                  darkMode ? "text-gray-200" : "text-gray-700"
                }`}
              >
                Salary
              </label>

              <input
                type="text"
                placeholder="e.g. 8 LPA"
                value={formData.salary}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    salary: e.target.value,
                  })
                }
                className={inputClass}
              />
            </div>
          </div>

          <p
            className={`mt-4 text-xs ${
              darkMode ? "text-gray-500" : "text-gray-400"
            }`}
          >
            * Company Name and Job Position are required.
          </p>
        </div>

        {/* FIXED BUTTON AREA */}
        <div
          className={`flex shrink-0 flex-col-reverse gap-3 border-t px-5 py-4 sm:flex-row sm:justify-end sm:px-7 ${
            darkMode ? "border-gray-700" : "border-gray-200"
          }`}
        >
          <button
            type="button"
            onClick={handleCancel}
            className={`w-full rounded-lg border px-5 py-2.5 text-sm font-semibold transition sm:w-auto ${
              darkMode
                ? "border-gray-600 text-gray-300 hover:bg-gray-700"
                : "border-gray-300 text-gray-700 hover:bg-gray-100"
            }`}
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleSubmit}
            className="w-full rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 active:scale-[0.98] sm:w-auto"
          >
            {editingJob ? "Update Job" : "Save Job"}
          </button>
        </div>
      </section>
    </div>
  );
}

export default JobForm;