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
    if (!userId) return;

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
  }, [role, userId]);

  const filteredTasks = TaskList.filter((list) => list.acceptedStatus === 1);
  const displayedTasks = showAllTasks ? filteredTasks : filteredTasks.slice(0, 2);
  const displayedPals = showAllPals ? PalList : PalList.slice(0, 2);

  // Empty state component
  const EmptyState = ({ 
    title, 
    description, 
    buttonText, 
    buttonLink, 
    gifSrc = "/ezgif-5fd302026faaa8.png" 
  }) => (
    <div className="bg-white rounded-2xl shadow-xl p-6 border border-secondary">
    <div className="flex flex-col items-center justify-center h-64 text-center py-12">
      <div className="flex justify-center mb-4">
        <img
          src={gifSrc}
          alt="Empty state"
          className="w-28 h-28 object-contain"
        />
      </div>
      <h2 className="text-xl font-bold text-primary mb-2">{title}</h2>
      <p className="text-gray-600 mb-6">{description}</p>
      {buttonText && (
        <button
          className="px-4 py-3 bg-primary text-white rounded-lg hover:bg-black transition-colors shadow-lg flex items-center space-x-2"
          onClick={() => (window.location.href = buttonLink)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z"
              clipRule="evenodd"
            />
          </svg>
          <span>{buttonText}</span>
        </button>
      )}
    </div>
    </div>
  );

  return (
    <div className="flex h-screen w-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 p-6 overflow-y-auto">
        <Header />

        {/* Tasks Section */}
        <section className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold text-black">Your Tasks</h2>
            {filteredTasks.length > 2 && (
              <button
                onClick={() => setShowAllTasks(!showAllTasks)}
                className="text-indigo-600"
              >
                {showAllTasks ? "Show less" : "View all"}
              </button>
            )}
          </div>
          
          {filteredTasks.length > 0 ? (
            <div className="grid grid-cols-2 gap-4">
              {displayedTasks.map((list) => (
                <TaskoverviewCard2 props={list} key={list.id} />
              ))}
            </div>
          ) : (
            <EmptyState
              title="No Tasks Found"
              description="You currently have no active or completed tasks."
              buttonText="Browse Available Tasks"
              buttonLink="/my-tasks"
            />
          )}
        </section>

        {/* Connections Section */}
        <section>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold text-gray-800">Your Connections</h2>
            {PalList.length > 2 && (
              <button
                onClick={() => setShowAllPals(!showAllPals)}
                className="text-indigo-600 hover:underline font-medium"
              >
                {showAllPals ? "Show less" : "View all"}
              </button>
            )}
          </div>
          
          {PalList.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {displayedPals.map((pal, index) => (
                <ClientCard1 key={pal.id || pal.userId || index} props={pal} />
              ))}
            </div>
          ) : (
            <EmptyState
              title="No Connections Yet"
              description="You haven't connected with anyone yet."
              buttonText="Find People to Connect"
              buttonLink="/client"
            />
          )}
        </section>
      </div>
    </div>
  );
};

export default Homepage;