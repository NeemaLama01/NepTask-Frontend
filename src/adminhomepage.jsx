import React, { useEffect, useState } from "react";
import axios from "axios";
import AdminSidebar from "./assets/adminsidebar";
import Header from "./assets/header";

const AdminHomepage = () => {
  const [TaskList, setTaskList] = useState([]);
  const [users, setUserData] = useState([]);
  const [tasks, setTasks] = useState([]);
  const role = localStorage.getItem("userRole");
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    if (!userId) return;

    // Fetch all tasks
    axios
      .get("http://localhost:3000/get-All-Task")
      .then((response) => {
        setTasks(response.data);
      })
      .catch((error) => {
        console.error("Error fetching tasks:", error);
      });

    // Fetch accepted tasks based on role
    const endpoint = role === "Task Poster" ? "/accepted-tasker" : "/accepted-tasks";
    axios
      .get(`http://localhost:3000${endpoint}`, { params: { userId } })
      .then((response) => {
        setTaskList(response?.data || []);
      })
      .catch((error) => {
        console.error("Error fetching accepted tasks:", error);
      });

    // Fetch all users
    axios
      .get("http://localhost:3000/getUsers", {
        headers: { userId },
      })
      .then((response) => {
        setUserData(response.data);
      })
      .catch((error) => {
        console.error("Error fetching users data:", error);
      });
  }, [role, userId]);

  return (
    <div className="flex h-screen w-screen bg-gray-50">
      <AdminSidebar />

      <div className="flex-1 p-6 overflow-y-auto">
        <Header />

        <section className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <div className="grid grid-cols-3 gap-6 w-screen">
              {/* Task Posters Count */}
              <div className="bg-[#FFCC80] bg-opacity-80 flex flex-col items-center p-6 rounded-lg shadow-md">
                <span className="text-5xl">📋</span>
                <h2 className="text-xl font-semibold mt-4">Task Posters</h2>
                <p className="text-gray-600 mt-2">
                  {users.filter((user) => user.role === "Task Poster").length}
                </p>
              </div>

              {/* Tasks Count */}
              <div className="bg-[#FFF59D] bg-opacity-80 flex flex-col items-center p-6 rounded-lg shadow-md">
                <span className="text-5xl">📝</span>
                <h2 className="text-xl font-semibold mt-4">Tasks</h2>
                <p className="text-gray-600 mt-2">{tasks.length}</p>
              </div>

              {/* Taskers Count */}
              <div className="bg-[#A8E6A3] bg-opacity-80 flex flex-col items-center p-6 rounded-lg shadow-md">
                <span className="text-5xl">👨‍💻</span>
                <h2 className="text-xl font-semibold mt-4">Taskers</h2>
                <p className="text-gray-600 mt-2">
                  {users.filter((user) => user.role === "Tasker").length}
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default AdminHomepage;
