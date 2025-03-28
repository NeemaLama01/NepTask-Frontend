import { useState } from "react";
import axios from "axios";

const ForgetPassword = () => {
  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    // Validate passwords match
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const res = await axios.put("http://localhost:3000/forgot-password", {
        email,
        token,
        newPassword,
      });
      setMessage(res.data.message);
    } catch (err) {
      setError(
        err.response?.data?.error || "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-semibold text-center mb-4">
          Reset Password
        </h2>
        <p className="text-gray-600 text-center mb-4">
          Enter your email, token, and new password
        </p>

        {message && <p className="text-green-500 text-center">{message}</p>}
        {error && <p className="text-red-500 text-center">{error}</p>}

        <form onSubmit={handleSubmit} className="mt-4">
          {/* Email Input */}
          <div className="mb-4">
            <input
              type="email"
              className="w-full p-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-500"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* Token Input */}
          <div className="mb-4">
            <input
              type="text"
              className="w-full p-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-500"
              placeholder="Enter your token"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              required
            />
          </div>

          {/* New Password Input */}
          <div className="mb-4">
            <input
              type="password"
              className="w-full p-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-500"
              placeholder="Enter new password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </div>

          {/* Confirm Password Input */}
          <div className="mb-4">
            <input
              type="password"
              className="w-full p-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-500"
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-primary text-white px-4 py-2 mt-4 rounded-lg hover:bg-black transition"
            disabled={loading}
          >
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </form>

        <div className="text-center mt-4">
          <a href="/login" className="text-blue-600 hover:underline">
            Back to Login
          </a>
        </div>
      </div>
    </div>
  );
};

export default ForgetPassword;
