function StatCard({ title, value, icon, darkMode }) {
  return (
    <div
      className={`group rounded-xl border p-5 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-lg sm:p-6 ${
        darkMode
          ? "border-gray-700 bg-gray-800 hover:border-gray-600"
          : "border-gray-200 bg-white hover:border-blue-200"
      }`}
    >
      <div className="flex items-center justify-between gap-4">

        {/* =========================
            TEXT
        ========================= */}

        <div className="min-w-0">
          <p
            className={`truncate text-sm font-medium ${
              darkMode ? "text-gray-400" : "text-gray-500"
            }`}
          >
            {title}
          </p>

          <h3
            className={`mt-2 text-2xl font-bold sm:text-3xl ${
              darkMode ? "text-white" : "text-gray-900"
            }`}
          >
            {value}
          </h3>

          <p
            className={`mt-1 text-xs ${
              darkMode ? "text-gray-500" : "text-gray-400"
            }`}
          >
            Updated automatically
          </p>
        </div>

        {/* =========================
            ICON
        ========================= */}

        <div
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-xl transition-transform duration-200 group-hover:scale-110 sm:h-12 sm:w-12 sm:text-2xl ${
            darkMode
              ? "bg-gray-700"
              : "bg-blue-50"
          }`}
        >
          {icon}
        </div>
      </div>
    </div>
  );
}

export default StatCard;