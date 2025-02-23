import React, { useEffect, useState } from "react";
import { Search } from "lucide-react";
import { NavLink } from "react-router-dom"; // Import NavLink for navigation
import { toast } from "react-toastify"; // Import Toastify
import "react-toastify/dist/ReactToastify.css"; // Import Toastify styles
import axios from "axios";
import TaskCard from "./taskcard";
import Sidebar from "./assets/sidebar";
import Header from "./assets/header";
import TaskOverviewCard from "./taskoverviewcard";

// Initialize Toastify
// toast.configure();

const Mytasks = () => {
  const [TaskList, setTaskList] = useState([]);
  const [acceptedList, setAcceptedList] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  const role = localStorage.getItem("userRole");
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    if (role === "Task Poster") {
      fetchTasks();
    } else if (role === "Tasker") {
      fetchAcceptedTasks();
    }
  }, []);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (role === "Task Poster") {
        fetchTasks(searchQuery);
      } else if (role === "Tasker") {
        fetchAcceptedTasks(searchQuery);
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  // Fetch Active Tasks for Task Poster
  const fetchTasks = async (query = "") => {
    try {
      const url = query.trim()
        ? `http://localhost:3000/get-Active-Task?query=${query}`
        : "http://localhost:3000/get-Active-Task";

      const response = await axios.get(url, {
        params: { userId },
      });

      setTaskList(response?.data || []);
    } catch (error) {
      console.error("Error fetching tasks:", error);
      setTaskList([]);
      toast.error("Failed to load tasks. Please try again.");
    }
  };

  // Fetch Accepted Tasks for Tasker
  const fetchAcceptedTasks = async (query = "") => {
    try {
      const url = query.trim()
        ? `http://localhost:3000/get-pending-Task?query=${query}`
        : "http://localhost:3000/get-pending-Task";

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
            {role === "Task Poster" ? (
              <>
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
                  Active Tasks
                </NavLink>

                <div className="h-8 w-[2px] bg-gray-400"></div>

                <NavLink
                  to="/archive"
                  className={({ isActive }) =>
                    `text-3xl font-semibold mx-4 pb-1 ${
                      isActive
                        ? "text-primary border-b-4 border-primary"
                        : "text-gray-500"
                    }`
                  }
                >
                  Archive Tasks
                </NavLink>
              </>
            ) : (
              <>
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
                        ? "text-yellow-600 border-b-4 border-yellow-600"
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
                        ? "text-yellow-600 border-b-4 border-yellow-600"
                        : "text-gray-500"
                    }`
                  }
                >
                  Rejected Tasks
                </NavLink>
              </>
            )}
          </div>

          {/* Display Tasks */}
          <div className="grid grid-cols-3 gap-6">
            {role === "Task Poster"
              ? TaskList.map((list) => <TaskCard props={list} key={list.id} />)
              : acceptedList.map((list) => (
                  <TaskOverviewCard props={list} key={list.id} />
                ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Mytasks;
