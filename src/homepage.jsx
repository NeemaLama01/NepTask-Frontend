import React, { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "./assets/sidebar";
import Header from "./assets/header";
import ClientCard1 from "./clientcard1";
import TaskoverviewCard2 from "./taskoverviewcard_2";

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
              <TaskoverviewCard2 props={list} key={list.id} />
            ))}
          </div>
        </section>

        {/* Pals Section */}
        <section>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-black">Your connections</h2>
            <a href="#" className="text-indigo-600">View all</a>
          </div>
          <div className="grid grid-cols-2 gap-6">
<ClientCard1 />
          </div>
        </section>
      </div>
    </div>
  );
};


export default Homepage;
