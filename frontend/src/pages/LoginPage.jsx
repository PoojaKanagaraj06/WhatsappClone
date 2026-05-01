import { useState } from "react";
import api from "../services/api";

function LoginPage({ onLoginSuccess }) {
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    const trimmedUsername = username.trim();

    if (!trimmedUsername) {
      setError("Please enter a username");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const { data: user } = await api.post("/users", {
        username: trimmedUsername,
      });

      // Save user to localStorage
      localStorage.setItem("currentUser", JSON.stringify(user));

      // Call success callback
      onLoginSuccess(user);
    } catch (err) {
      console.error("Login failed:", err);
      setError("Failed to login. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen w-full bg-gradient-to-br from-[#25d366] to-[#075e54] flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-2xl p-8 w-full max-w-md">
        {/* Logo/Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-[#25d366] mb-2">WhatsApp</h1>
          <p className="text-gray-600 text-sm">Chat Clone</p>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              disabled={loading}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#25d366] focus:ring-2 focus:ring-[#25d366] focus:ring-opacity-20 disabled:bg-gray-100"
              autoFocus
            />
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading || !username.trim()}
            className="w-full bg-[#25d366] text-white font-semibold py-3 rounded-lg hover:bg-[#20bd5c] disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            {loading ? "Logging in..." : "Continue"}
          </button>
        </form>

        {/* Info Text */}
        <p className="text-center text-gray-500 text-xs mt-6">
          Enter a username to get started. If the username exists, you'll login to that account.
          Otherwise, a new account will be created.
        </p>
      </div>
    </div>
  );
}

export default LoginPage;
