import React, { useEffect, useState } from "react";
import { DotsVerticalIcon } from "@heroicons/react/outline";
import JobCard from "./taskcard";
import axios from "axios";
import Sidebar from "./assets/sidebar";
import Header from "./assets/header";
import Task_Card from "./taskoverviewcard_2";

const Homepage = () => {
  const [TaskList, setTaskList] = useState([]);
  const [showAllTasks, setShowAllTasks] = useState(false);
  const role = localStorage.getItem("userRole");
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    if (!userId) return; // Ensure userId exists before making a request

    const endpoint =
      role === "Task Poster" ? "/accepted-tasker" : "/accepted-tasks";

    axios
      .get(`http://localhost:3000${endpoint}`, { params: { userId } })
      .then((response) => {
        setTaskList(response?.data || []);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, [role, userId]); // Dependencies ensure it refetches if role/userId changes

  const filteredTasks = TaskList.filter((list) => list.acceptedStatus === 1);
  const displayedTasks = showAllTasks
    ? filteredTasks
    : filteredTasks.slice(0, 2);

  return (
    <div className="flex h-screen w-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 p-6 overflow-y-auto">
        <Header />

        <section className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-black">Your Tasks</h2>
            {filteredTasks.length > 2 && (
              <button
                onClick={() => setShowAllTasks(!showAllTasks)}
                className="text-indigo-600"
              >
                {showAllTasks ? "Show less" : "View all"}
              </button>
            )}
          </div>
          <div className="grid grid-cols-2 gap-4">
            {displayedTasks.map((list) => (
              <Task_Card props={list} key={list.id} />
            ))}
          </div>
        </section>

        {/* Pals Section */}
        <section>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-black">Your taskers</h2>
            <a href="#" className="text-blue-700">
              View all
            </a>
          </div>
          <div className="grid grid-cols-2 gap-6">
            <PalCard name="Rabi Rai" role="Pet Keeping" />
            <PalCard name="Susma shakya" role="Household chores" />
          </div>
        </section>
      </div>
    </div>
  );
};

const PalCard = ({ name, role }) => (
  <div className="flex items-center p-4 bg-white rounded shadow border">
    <div className="w-12 h-12 bg-gray-300 rounded-full mr-4"></div>
    <div className="flex-1">
      <h4 className="font-semibold text-gray-800">{name}</h4>
      <p className="text-sm text-gray-500">{role}</p>
    </div>
    <button className="bg-gray-100 text-gray-700 px-3 py-1 rounded text-sm">
      Message
    </button>
  </div>
);

export default Homepage;
