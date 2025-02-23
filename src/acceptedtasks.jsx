import React, { useEffect, useState } from "react";
import { Search } from "lucide-react";
import { NavLink } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import Sidebar from "./assets/sidebar";
import Header from "./assets/header";
import TaskOverviewCard from "./taskoverviewcard";

const AcceptedTasks = () => {
  const [acceptedList, setAcceptedList] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  const userId = localStorage.getItem("userId");

  useEffect(() => {
    fetchAcceptedTasks();
  }, []);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchAcceptedTasks(searchQuery);
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  // Fetch Accepted Tasks for Talent
  const fetchAcceptedTasks = async (query = "") => {
    try {
      const url = query.trim()
        ? `http://localhost:3000/accepted-tasks?query=${query}`
        : "http://localhost:3000/accepted-tasks";

      const response = await axios.get(url, {
        params: { userId },
      });

      setAcceptedList(response?.data || []);
    } catch (error) {
      console.error("Error fetching accepted tasks:", error);
      setAcceptedList([]);
      toast.error("Failed to load accepted tasks. Please try again.");
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

        {/* Navigation Tabs */}
        <section className="mt-5">
          <div className="flex items-center mb-4 border-b border-gray-400 pb-2">
            <NavLink
              to="/my-tasks"
              className={({ isActive }) =>
                `text-3xl font-semibold mx-4 pb-1 ${
                  isActive
                    ? "text-primary border-b-4 border-primary"
                    : "text-gray-500"
                }`
              }
            >
              Applied Tasks
            </NavLink>

            <div className="h-8 w-[2px] bg-gray-400"></div>

            <NavLink
              to="/accepted-tasks"
              className={({ isActive }) =>
                `text-3xl font-semibold mx-4 pb-1 ${
                  isActive
                    ? "text-primary border-b-4 border-primary"
                    : "text-gray-500"
                }`
              }
            >
              Accepted Tasks
            </NavLink>

            <div className="h-8 w-[2px] bg-gray-400"></div>

            <NavLink
              to="/rejected-tasks"
              className={({ isActive }) =>
                `text-3xl font-semibold mx-4 pb-1 ${
                  isActive
                    ? "text-primary border-b-4 border-yellow-600"
                    : "text-gray-500"
                }`
              }
            >
              Rejected Tasks
            </NavLink>
          </div>

          {/* Display Accepted Tasks */}
          <div className="grid grid-cols-3 gap-6">
            {acceptedList
              .filter((list) => list.acceptedStatus === 1)
              .map((list) => (
                <TaskOverviewCard props={list} key={list.id} />
              ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default AcceptedTasks;
