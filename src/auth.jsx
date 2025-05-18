import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Auth = () => {
  const [token, setToken] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [tokenSent, setTokenSent] = useState(false); // New state
  const[loading,setLoading]=useState(false);
  
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    toast.info("Verifying token...", { autoClose: 1000 });

    try {
      const role = localStorage.getItem("userRole");

      const response = await axios.post("http://localhost:3000/authentication", {
        token,
      });

      if (response.status === 200) {
        toast.success("Email verified successfully! 🎉", { autoClose: 2000 });

        setTimeout(() => {
          if (role === "Task Poster") {
            navigate("/home");
          } else if (role === "Tasker") {
            navigate("/explore");
          }
        }, 1500);
      } else {
        toast.error("Invalid token. Please try again.");
      }
    } catch (error) {
      toast.error("Error verifying token. Please try again later.");
      console.error(error);
    }
  };

  const handleSendToken = async () => {
    setLoading(true);
    try {
      const email = localStorage.getItem("userEmail");
      await axios.post("http://localhost:3000/verify-token", { email });
      toast.success("Token sent to your email.");
      setError("");
      setTokenSent(true); // Show verify button
    } catch (err) {
      toast.error(err.response?.data || "Error sending token");
      setMessage("");
    }
   finally {
    setLoading(false); // End loading
  }
};
  

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-lg w-full space-y-8 p-16 rounded-lg shadow-lg border border-gray-300 bg-gray-50">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Verify your email
        </h2>
        <p className="mt-6 text-center font-thin text-gray-900">
          Hey there! To keep your account secure please enter your verification token below{" "}
          <span>
            and get started with <span className="font-bold">NepTask</span>.
          </span>
        </p>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {!tokenSent && (
            <div className="mb-4">
              <button
                type="button"
                onClick={handleSendToken}
                disabled={loading}
                className="w-full text-sm font-medium text-white bg-primary py-2 rounded hover:bg-black"
              >      {loading ? (
                <div className="flex items-center justify-center">
                  <svg
                    className="animate-spin h-5 w-5 text-white mr-2"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                    />
                  </svg>
                  Sending...
                </div>
              ) : ("Send token to email")}
              </button>
            </div>
          )}
        
          {tokenSent && (
            <>
              <label className="font-bold">Verification Code</label>
              <input
                id="token"
                name="token"
                type="text"
                autoComplete="off"
                required
                className="appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Enter your code"
                value={token}
                onChange={(e) => setToken(e.target.value)}
              />

              <button
                type="submit"
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-black focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Verify and continue
              </button>
            </>
          )}
        </form>
      </div>
    </div>
  );
};

export default Auth;
