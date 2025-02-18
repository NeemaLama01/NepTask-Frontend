import React, { useEffect, useState } from "react";
import { Search } from "lucide-react";
import { NavLink } from "react-router-dom"; // Import NavLink for navigation
import { toast } from "react-toastify"; // Import Toastify
import "react-toastify/dist/ReactToastify.css"; // Import Toastify styles
import axios from "axios";
import JobCard from "./taskcard";
import Sidebar from "./assets/sidebar";
import Header from "./assets/header";

// Initialize Toastify
// toast.configure();

const Mytasks = () => {
  const [IdeaList, setIdeaList] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  const role = localStorage.getItem("userRole");
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    fetchIdeas(); // Initial data fetch
  }, []);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchIdeas(searchQuery);
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  const fetchIdeas = async (query = "") => {
    try {
      const url = query.trim()
        ? `http://localhost:3000/get-Active-Idea?query=${query}`
        : "http://localhost:3000/get-Active-Idea";

      const response = await axios.get(url, {
        params: role === "Task Poster" ? { userId } : {}, // Pass userId only if role is Task Poster
      });

      setIdeaList(response?.data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
      setIdeaList([]); // Clear list on error
      toast.error("Failed to load tasks. Please try again.");
    }
  };

  return (
    <div className="flex h-screen w-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 p-6 overflow-y-auto">
        <Header />

        {/* Search Bar */}
        <div className="max-w-md bg-white rounded-lg overflow-hidden shadow-lg">
          <div className="flex items-center border-b border-gray-200 px-4">
            <input
              type="text"
              className="w-full py-4 px-6 focus:outline-none"
              placeholder="Enter the task title, task type..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button className="p-2 rounded-sm transition duration-300">
              <Search className="h-6 w-6 text-black opacity-50" />
            </button>
          </div>
        </div>

        {/* Ideas Section with Navigation */}
        <section className="mt-5">
          <div className="flex items-center mb-4 border-b border-gray-400 pb-2">
            <NavLink
              to="/my-ideas"
              className={({ isActive }) =>
                `text-3xl font-semibold mx-4 pb-1 ${
                  isActive
                    ? "text-indigo-600 border-b-4 border-indigo-600"
                    : "text-gray-500"
                }`
              }
            >
              Active Tasks
            </NavLink>
            <div className="h-8 w-[2px] bg-gray-400"></div>{" "}
            {/* Vertical Line */}
            <NavLink
              to="/archive"
              className={({ isActive }) =>
                `text-3xl font-semibold mx-4 pb-1 ${
                  isActive
                    ? "text-indigo-600 border-b-4 border-indigo-600"
                    : "text-gray-500"
                }`
              }
            >
              Archive Tasks
            </NavLink>
          </div>

          {/* Display Ideas */}
          <div className="grid grid-cols-3 gap-6">
            {IdeaList.map((list) => (
              <JobCard props={list} key={list.id} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Mytasks;
