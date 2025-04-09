import React, { useEffect, useState } from "react";
import { Search } from "lucide-react";
import axios from "axios";
import TaskCard from "./taskcard";
import Subheader from "./assets/subheader";
import AdminSidebar from "./assets/adminsidebar";

const AdminExplore = () => {
  const [TaskList, setTaskList] = useState([]);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchTasks(); // Initial data fetch
  }, []);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchTasks(searchQuery);
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  const fetchTasks = (query = "") => {
    const url = query.trim()
      ? `http://localhost:3000/get-All-Task?query=${query}`
      : "http://localhost:3000/get-All-Task";

    axios
      .get(url)
      .then((response) => {
        setTaskList(response?.data);
        setError("");
      })
      .catch((error) => {
        console.error("Error fetching task:", error);
        setTaskList([]); // Clear list on error
        setError("Failed to load tasks. Please try again.");
      });
  };

  return (
    <div className="flex h-screen w-screen bg-gray-50">
      <AdminSidebar />
      <div className="flex-1 p-6 overflow-y-auto">
        <Subheader />
        {error && <p className="text-red-500">{error}</p>}

        {/* Search Bar */}
        <div className="max-w-md bg-white rounded-lg overflow-hidden shadow-lg">
          <div className="flex items-center border-b border-gray-200 px-4">
            <input
              type="text"
              className="w-full py-4 px-6 focus:outline-none"
              placeholder="Enter the task name, task type..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button className="p-2 rounded-sm transition duration-300">
              <Search className="h-6 w-6 text-black opacity-50" />
            </button>
          </div>
        </div>

        {/* Task Section */}
        <section className="mt-5">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-3xl font-semibold text-black">Explore Tasks</h2>
            <a href="#" className="text-blue-700">
              View all
            </a>
          </div>
          <div className="grid grid-cols-3 gap-6">
            {TaskList.map((list) => (
              <TaskCard props={list} key={list.id} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default AdminExplore;
