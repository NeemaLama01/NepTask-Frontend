import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import AdminSidebar from "./assets/adminsidebar";
import Header from "./assets/header";
import { Doughnut, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
} from "chart.js";

// Register all required components
ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale
);

const AdminHomepage = () => {
  const [users, setUserData] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [payment, setPayment] = useState([]);
  const [admintask,setAdmintask] = useState([]);
  const role = localStorage.getItem("userRole");
  const userId = localStorage.getItem("userId");

  // Refs for chart instances
  const doughnutRef = useRef(null);
  const barRef = useRef(null);

  useEffect(() => {
    if (!userId) return;

    const fetchData = async () => {
      try {
        const tasksResponse = await axios.get(
          "http://localhost:3000/get-All-Task"
        );
        setTasks(tasksResponse.data);

        const paymentResponse = await axios.get(
          "http://localhost:3000/adminPayment"
        );
        setPayment(paymentResponse.data);
       
        const adminResponse = await axios.get(
          "http://localhost:3000/admintask"
        );
        setAdmintask(adminResponse.data);     

        const usersResponse = await axios.get(
          "http://localhost:3000/getUsers",
          { headers: { userId } }
        );
        setUserData(usersResponse.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    // Cleanup function to destroy charts when component unmounts
    return () => {
      if (doughnutRef.current) {
        doughnutRef.current.destroy();
      }
      if (barRef.current) {
        barRef.current.destroy();
      }
    };
  }, [role, userId]);

  if (loading) {
    return <div>Loading...</div>;
  }

  const paymentData = {
    labels: ["Paid", "Pending"],
    datasets: [
      {
        data: [
          payment.filter((payment) => payment.status === "Paid").length, // Count Paid
          payment.filter((payment) => payment.status === "Pending").length,
        ], // Count Pending
        backgroundColor: ["#4CAF50", "#FFC107"],
        hoverOffset: 4,
      },
    ],
  };

  const taskData = {
    labels: ["Tasks"],
    datasets: [
      {
        label: "Active",
        data: [admintask.filter((activetask) => activetask.status === "1").length],// Count Paid
        backgroundColor: "#4CAF50",
        barThickness: 40,
      },
      {
        label: "Archived",
        data: [admintask.filter((archivetask) => archivetask.status === "0").length],
        backgroundColor: "#F44336",
        barThickness: 40,
      },
    ],
  };

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        grid: { display: false },
      },
      y: {
        beginAtZero: true,
        grid: { display: false },
      },
    },
  };
  return (
    <div className="flex h-screen w-screen bg-gray-50">
      <AdminSidebar />

      <div className="flex-1 p-6 overflow-y-auto">
        <Header />

        <section className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <div className="grid grid-cols-3 gap-6 w-screen">
              <div className="bg-secondary flex flex-col items-center p-6 rounded-lg shadow-md transition-transform duration-300 hover:scale-105 hover:shadow-xl">
                <span className="text-5xl">📋</span>
                <h2 className="text-xl font-semibold mt-4">Task Posters</h2>
                <p className="text-gray-600 mt-2">
                  {users.filter((user) => user.role === "Task Poster").length}
                </p>
              </div>

              <div className="bg-secondary flex flex-col items-center p-6 rounded-lg shadow-md transition-transform duration-300 hover:scale-105 hover:shadow-xl">
                <span className="text-5xl">📝</span>
                <h2 className="text-xl font-semibold mt-4">Tasks</h2>
                <p className="text-gray-600 mt-2">{tasks.length}</p>
              </div>

              <div className="bg-secondary flex flex-col items-center p-6 rounded-lg shadow-md transition-transform duration-300 hover:scale-105 hover:shadow-xl">
                <span className="text-5xl">👨‍💻</span>
                <h2 className="text-xl font-semibold mt-4">Taskers</h2>
                <p className="text-gray-600 mt-2">
                  {users.filter((user) => user.role === "Tasker").length}
                </p>
              </div>
            </div>
          </div>
        </section>

        <div className="flex flex-row gap-6 items-stretch h-[300px]">
          {/* Doughnut Chart - Fixed width, constrained height */}
          <div className="w-[24rem] bg-white p-3 rounded-xl shadow-md flex flex-col">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">
              Payment Status
            </h3>
            <div className="flex-1 min-h-0">
              <Doughnut
                data={paymentData}
                options={{
                  maintainAspectRatio: false, // Disable aspect ratio
                  responsive: true,
                }}
                height="100%"
              />
            </div>
            <div className="flex justify-around mt-2 text-sm text-gray-600">
              <div>
                <span className="block font-bold">
                  {payment.length > 0
                    ? (
                        (payment.filter((payment) => payment.status === "Paid")
                          .length /
                          payment.length) *
                        100
                      ).toFixed(2)
                    : 0}
                  %
                </span>
                Paid
              </div>
              <div>
                <span className="block font-bold">
                  {payment.length > 0
                    ? (
                        (payment.filter(
                          (payment) => payment.status === "Pending"
                        ).length /
                          payment.length) *
                        100
                      ).toFixed(2)
                    : 0}
                  %
                </span>
                Pending
              </div>
            </div>
          </div>

          {/* Bar Chart - Flexible width, same height */}
          <div className="flex-1 bg-white p-4 rounded-xl shadow-md flex flex-col">
            <h3 className="text-lg font-semibold mb-4 text-gray-700">
              Task Status Overview
            </h3>
            <div className="flex-1 min-h-0">
              <Bar
                data={taskData}
                options={{
                  barOptions,
                  maintainAspectRatio: false, // Disable aspect ratio
                }}
                height="100%"
              />
            </div>
          </div>
        </div>

       
        {/* Payment Table*/}
        <table className="w-full border-collapse bg-white shadow-lg rounded-lg mt-7 ">
          <thead>
            <tr className="text-center text-white bg-primary">
              <th className="py-2 px-4 ">Task Title</th>
              <th className="py-2 px-4">Task Poster</th>
              <th className="py-2 px-4">Tasker</th>
              <th className="py-2 px-4">Transaction Amount</th>
              <th className="py-2 px-4">NepTask Commission</th>
              <th className="py-2 px-4">Status</th>
            </tr>
          </thead>
          <tbody>
            {payment.map((item, index) => (
              <tr
                key={index}
                className="text-center border-t hover:bg-gray-100"
              >
                <td className="py-3 px-4">{item.task}</td>
                <td className="py-3 px-4">{item.taskposter || "N/A"}</td>
                <td className="py-3 px-4">{item.tasker || "N/A"}</td>
                <td className="py-3 px-4">NRs.{item.offerPrice || "N/A"}</td>
                <td className="py-3 px-4">
                  {" "}
                  NRs.{item.offerPrice ? item.offerPrice * 0.1 : "N/A"}
                </td>
                <td className="py-3 px-4">{item.status || "Pending"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminHomepage;
