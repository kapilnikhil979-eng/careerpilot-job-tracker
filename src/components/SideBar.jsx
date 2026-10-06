function Sidebar({ currentPage, onNavigate, darkMode }) {
  const menuItems = [
    {
      name: "Dashboard",
      icon: "📊",
    },
    {
      name: "Job Applications",
      icon: "💼",
    },
    {
      name: "Resume Analyzer",
      icon: "📄",
    },
    {
      name: "Interview Prep",
      icon: "🎤",
    },
    {
      name: "Settings",
      icon: "⚙️",
    },
  ];

  return (
    <aside
      className={`fixed left-0 top-0 h-screen w-64 border-r transition-colors ${
        darkMode
          ? "border-gray-700 bg-gray-900"
          : "border-gray-200 bg-white"
      }`}
    >
      {/* Logo */}
      <div
        className={`border-b p-6 ${
          darkMode ? "border-gray-700" : "border-gray-200"
        }`}
      >
        <h1 className="text-2xl font-bold text-blue-600">
          CareerPilot
        </h1>

        <p
          className={`mt-1 text-sm ${
            darkMode ? "text-gray-400" : "text-gray-500"
          }`}
        >
          Career Management
        </p>
      </div>

      {/* Navigation */}
      <nav className="space-y-2 p-4">
        {menuItems.map((item) => (
          <button
            key={item.name}
            onClick={() => onNavigate(item.name)}
            className={`flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left font-medium transition ${
              currentPage === item.name
                ? darkMode
                  ? "bg-blue-900 text-blue-300"
                  : "bg-blue-50 text-blue-600"
                : darkMode
                ? "text-gray-300 hover:bg-gray-800"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            <span className="text-lg">
              {item.icon}
            </span>

            <span>{item.name}</span>
          </button>
        ))}
      </nav>

      {/* Bottom Section */}
      <div
        className={`absolute bottom-0 w-full border-t p-4 ${
          darkMode ? "border-gray-700" : "border-gray-200"
        }`}
      >
        {/* Career Message */}
        <div
          className={`rounded-lg p-4 ${
            darkMode ? "bg-gray-800" : "bg-gray-50"
          }`}
        >
          <p
            className={`text-sm font-medium ${
              darkMode ? "text-white" : "text-gray-700"
            }`}
          >
            Keep going! 🚀
          </p>

          <p
            className={`mt-1 text-xs ${
              darkMode ? "text-gray-400" : "text-gray-500"
            }`}
          >
            Track your career journey with CareerPilot.
          </p>
        </div>

        {/* Logout Button */}
        <button
          onClick={() => onNavigate("Logout")}
          className={`mt-3 flex w-full items-center justify-center gap-2 rounded-lg px-4 py-3 font-medium transition ${
            darkMode
              ? "bg-red-900/30 text-red-400 hover:bg-red-900/50"
              : "bg-red-50 text-red-600 hover:bg-red-100"
          }`}
        >
          <span>🚪</span>
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;