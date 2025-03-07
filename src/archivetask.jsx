import React, { useEffect, useState } from "react";
import { Search } from "lucide-react";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import TaskCard from "./taskcard";
import Sidebar from "./assets/sidebar";
import { NavLink } from "react-router-dom";
import Subheader from "./assets/subheader";

const Archive = () => {
  const [TaskList, setTaskList] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  const role = localStorage.getItem("userRole");
  const userId = localStorage.getItem("userId") || ""; // Ensure userId is a string

  useEffect(() => {
    fetchTasks(); // Initial data fetch
  }, []);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchTasks(searchQuery);
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  const fetchTasks = async (query = "")  => {
    try {
      const url = query
        ? `http://localhost:3000/get-Archive-Task?query=${query}`
        : "http://localhost:3000/get-Archive-Task";
      
      const response = await axios.get(url, {
        params: role === "Task Poster" && userId ? { userId } : undefined,
      });

      setTaskList(response?.data);
    } catch (error) {
        toast.error("No Tasks found");
      console.error("Error fetching Tasks:", error);
      setTaskList([]); // Clear list on error
      
    }
  };

  return (
    <div className="flex h-screen w-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 p-6 overflow-y-auto">
        <Subheader />

        {/* Search Bar */}
        <div className="max-w-md bg-white rounded-lg overflow-hidden shadow-lg">
          <div className="flex items-center border-b border-gray-200 px-4">
            <input
              type="text"
              className="w-full py-4 px-6 focus:outline-none"
              placeholder="Enter the Task title, Task type..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button className="p-2 rounded-sm transition duration-300">
              <Search className="h-6 w-6 text-black opacity-50" />
            </button>
          </div>
        </div>

        {/* Tasks Section with Navigation */}
        <section className="mt-5">
          <div className="flex items-center mb-4 border-b border-gray-400 pb-2">
            <NavLink
              to="/my-tasks"
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
          <div className="grid grid-cols-3 gap-6">
            {TaskList.length > 0 ? (
              TaskList.map((list) => <TaskCard props={list} key={list.id} />)
            ) : (
              <p className="text-gray-500 text-lg">No archived tasks found.</p>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Archive;
