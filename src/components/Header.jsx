function Header({ darkMode, user }) {
  const userName = user?.name || "User";

  return (
    <header className="mb-8 flex items-center justify-between">
      {/* User Profile */}
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 font-bold text-white">
          {userName.charAt(0).toUpperCase()}
        </div>

        <div>
          <p
            className={`font-medium ${
              darkMode ? "text-white" : "text-gray-800"
            }`}
          >
            {userName}
          </p>

          <p
            className={`text-sm ${
              darkMode ? "text-gray-400" : "text-gray-500"
            }`}
          >
            Full Stack Developer
          </p>
        </div>
      </div>
    </header>
  );
}

export default Header;