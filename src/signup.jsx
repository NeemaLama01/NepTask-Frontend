import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [selectedOption, setSelectedOption] = useState("placeholder");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [token, setToken] = useState("");
  const navigate = useNavigate();

  const handleEmailChange = (e) => setEmail(e.target.value);
  const handleFullNameChange = (e) => setFullName(e.target.value);
  const handlePasswordChange = (e) => setPassword(e.target.value);
  const handleOptionChange = (e) => setSelectedOption(e.target.value);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:3000/signup", {
        email,
        fullName,
        password,
        selectedOption,
        token,
      });
      setMessage(response.data);
      navigate("/login");
    } catch (error) {
      setError(error.response?.data || "Signup failed");
    }
  };

  return (
    <div className="flex h-screen w-screen">
      {/* Left Section: Signup Form */}
      <div className="w-1/2 bg-white flex flex-col justify-center px-20">
        <h1 className="text-4xl font-bold mb-4">Signup</h1>
        <p className="text-gray-600 mb-8">
          Lorem ipsum dolor sit amet consectetur. Integer sed diam eget amet orci nulla ultricies.
        </p>

        {/* Google Signup Button 
        <button className="w-full flex items-center justify-center border border-gray-300 rounded py-2 mb-6 hover:bg-gray-50">
          <img src="/google.png" alt="Google Icon" className="h-5 w-5 mr-2" />
          <span className="text-gray-700 font-medium">Signup with Google</span>
        </button>
        
        <div className="text-center text-gray-400 mb-6">
          <span>or continue with email</span>
        </div>
*/}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && <div className="text-red-500 text-sm text-center">{error}</div>}
          {message && <div className="text-green-500 text-sm text-center">{message}</div>}

          {/* Email Input */}
          <div className="mb-4">
            <label className="text-gray-700 font-medium block mb-1">Email</label>
            <input
              id="email-address"
              name="email"
              type="email"
              required
              className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              placeholder="Enter your email address"
              value={email}
              onChange={handleEmailChange}
            />
            
          </div>

          {/* Full Name */}
          <div className="mb-4">
            <label className="text-gray-700 font-medium block mb-1">Fullname</label>
            <input
              type="text"
              required
              placeholder="Enter your Full Name"
              className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              value={fullName}
              onChange={handleFullNameChange}
            />
          </div>

          {/* Role */}
          <div className="mb-4">
            <label className="text-gray-700 font-medium block mb-1">Role</label>
            <select
              required
              value={selectedOption}
              onChange={handleOptionChange}
              className="block appearance-none w-full bg-white border border-gray-300 text-gray-900 py-2 px-4 pr-8 rounded-md focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 sm:text-sm"
            >
              <option value="placeholder" disabled>
                Register as a ...
              </option>
              <option value="Tasker">Register as a Tasker</option>
              <option value="Task Poster">Register as a Task Poster</option>
            </select>
          </div>

          {/* Password */}
          <div className="mb-4">
            <label className="text-gray-700 font-medium block mb-1">Password</label>
            <input
              type="password"
              required
              placeholder="Password"
              className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              value={password}
              onChange={handlePasswordChange}
            />
            <p className="text-sm text-gray-500 mt-1">Must be at least 8 characters.</p>
          </div>


          {/* Submit Button */}
          <button className="w-full bg-primary text-white py-2 rounded font-medium hover:bg-gray-800">
            Create account
          </button>
        </form>

        {/* Login Link */}
        <p className="text-center text-gray-500 mt-4">
          Already have an account?{" "}
          <a href="/login" className="text-primary hover:underline">
            Login
          </a>
        </p>
      </div>

      {/* Right Section: Image and Overlay */}
      <div className="w-1/2 relative">
        <img src="/image-9.png" alt="Teamwork" className="w-full h-full object-cover" />
        <div className="absolute bottom-10 left-10 text-white">
          <h2 className="text-2xl font-semibold mb-2">NepTask</h2>
          <p className="text-3xl font-bold leading-tight">
            Find the tasker
            <br /> you’ve been searching for
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
