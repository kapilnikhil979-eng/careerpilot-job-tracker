import { useState } from "react";

function Signup({ onSignup }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [loading, setLoading] = useState(false);

  async function handleSignup(e) {
    e.preventDefault();

    setMessage("");
    setError("");
    setLoading(true);

    try {
      const response = await fetch(
        "http://localhost:5000/api/auth/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name,
            email,
            password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Signup failed");
        return;
      }

      setMessage("Account created successfully ✅");

      setName("");
      setEmail("");
      setPassword("");

      // Go back to Login
      setTimeout(() => {
        onSignup();
      }, 1000);

    } catch (error) {
      console.error("SIGNUP ERROR:", error);

      setError(
        "Unable to connect to server. Make sure backend is running."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-lg">

        <h1 className="text-3xl font-bold text-center mb-2">
          Create Account
        </h1>

        <p className="text-gray-500 text-center mb-6">
          Create your Job Tracker account
        </p>

        {error && (
          <div className="mb-4 rounded-lg bg-red-100 border border-red-300 text-red-700 px-4 py-3">
            {error}
          </div>
        )}

        {message && (
          <div className="mb-4 rounded-lg bg-green-100 border border-green-300 text-green-700 px-4 py-3">
            {message}
          </div>
        )}

        <form onSubmit={handleSignup} className="space-y-5">

          {/* NAME */}

          <div>
            <label className="block mb-1 font-medium">
              Name
            </label>

            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />
          </div>

          {/* EMAIL */}

          <div>
            <label className="block mb-1 font-medium">
              Email
            </label>

            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />
          </div>

          {/* PASSWORD */}

          <div>
            <label className="block mb-1 font-medium">
              Password
            </label>

            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Minimum 6 characters"
              className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
              minLength={6}
              required
            />
          </div>

          {/* SIGNUP BUTTON */}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 disabled:opacity-50"
          >
            {loading ? "Creating Account..." : "Sign Up"}
          </button>
        </form>

        {/* BACK TO LOGIN */}

        <div className="text-center mt-6">
          <p className="text-gray-600">
            Already have an account?
          </p>

          <button
            type="button"
            onClick={onSignup}
            className="text-blue-600 font-semibold hover:underline mt-1"
          >
            Back to Login
          </button>
        </div>

      </div>
    </div>
  );
}

export default Signup;