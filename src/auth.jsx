import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Auth = () => {
  const [token, setToken] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    toast.info("Verifying token...", { autoClose: 1000 });

    try {
      const role = localStorage.getItem("userRole");
      const id = localStorage.getItem("userId");

      const response = await axios.post("http://localhost:3000/authentication", {
        token,
        id,
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

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-lg w-full space-y-8 p-16 rounded-lg shadow-lg border border-gray-300 bg-gray-50">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Verify your email
        </h2>
        <p className="mt-6 text-center font-thin text-gray-900">
          To keep a trusted and safe community, we’ve sent an email from{" "}
          <span className="font-bold">neptask@gmail.com</span> for verification. You’ll only do this once.
        </p>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
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
            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-gray focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Verify and continue
          </button>
        </form>
      </div>
    </div>
  );
};

export default Auth;
