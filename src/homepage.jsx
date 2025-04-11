import React, { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "./assets/sidebar";
import Header from "./assets/header";
import ClientCard1 from "./clientcard1";
import TaskoverviewCard2 from "./taskoverviewcard_2";

const Homepage = () => {
  const [TaskList, setTaskList] = useState([]);
  const [showAllTasks, setShowAllTasks] = useState(false);
  const [showAllPals, setShowAllPals] = useState(false);
  const [PalList, setPalList] = useState([]);
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

      axios
      .get(`http://localhost:3000/getFriend`, { params: { userId } })
      .then((response) => {
        setPalList(response?.data || []);
      })
      .catch((error) => {
        console.error("Error fetching pals:", error);
      });

  }, [role, userId]); // Dependencies ensure it refetches if role/userId changes

  const filteredTasks = TaskList.filter((list) => list.acceptedStatus === 1);
  const displayedTasks = showAllTasks
    ? filteredTasks
    : filteredTasks.slice(0, 2);
    const displayedPals = showAllPals ? PalList : PalList.slice(0, 2);


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
            {console.log(displayedTasks)}
            {displayedTasks.map((list) => (
              <TaskoverviewCard2 props={list} key={list.id} />
            ))}
          </div>
        </section>

        {/* Pals Section */}
        <section>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-3xl font-bold text-gray-800">Your Pals</h2>
              {PalList.length > 2 && (
                <button
                  onClick={() => setShowAllPals(!showAllPals)}
                  className="text-indigo-600 hover:underline font-medium"
                >
                  {showAllPals ? "Show less" : "View all"}
                </button>
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {displayedPals.map((pal, index) => (
                <ClientCard1 key={pal.id || pal.userId || index} props={pal} />
              ))}
            </div>
          </section>
      </div>
    </div>
  );
};

export default Homepage;
