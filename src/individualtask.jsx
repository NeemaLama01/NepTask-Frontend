import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import clsx from "clsx";
import dayjs from "dayjs";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import TaskCard from "./taskcard";
import BiddingFormOverlay from "./biddingform";
import Sidebar from "./assets/sidebar";
import Subheader from "./assets/subheader";

const IndividualTask = () => {
  const [taskInfo, setTaskInfo] = useState(null);
  const [taskList, setTaskList] = useState([]);
  const [appliedTaskers, setAppliedTaskers] = useState([]);
  const [showReasonInput, setShowReasonInput] = useState({});
  const [rejectionReasons, setRejectionReasons] = useState({});
  const [showBiddingForm, setShowBiddingForm] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();
  const userRole = localStorage.getItem("userRole");

  const isExplorePage = location.pathname.startsWith("/explore");

  // Fetch individual task details
  useEffect(() => {
    if (id) {
      axios
        .get(`http://localhost:3000/show-task/${id}`)
        .then((response) => setTaskInfo(response?.data))
        .catch((error) => console.error("Error fetching task:", error));
    }
  }, [id]);

  // Fetch all tasks for recommendations
  useEffect(() => {
    axios
      .get("http://localhost:3000/get-all-Task")
      .then((response) => setTaskList(response?.data))
      .catch((error) => console.error("Error fetching tasks:", error));
  }, [taskInfo]);

  // Fetch applied taskers
  const fetchAppliedTaskers = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3000/get-tasker/${id}`
      );
      setAppliedTaskers(response?.data?.taskers || []);
    } catch (error) {
      console.error("Error fetching applied taskers:", error);
      setAppliedTaskers([]);
    }
  };

  useEffect(() => {
    if (id && userRole === "Task Poster") {
      fetchAppliedTaskers();
    }
  }, [id, userRole]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Handle applying to a task
  const handleApply = (e) => {
    e.preventDefault();
    setShowBiddingForm(true);
  };

  // Handle submitting bid
  const handleBidSubmit = async (offerPrice, comments) => {
    const userId = localStorage.getItem("userId");
    const userName= localStorage.getItem("userName")
    const applicationData = {
      taskId: taskInfo?.id,
      taskerId: userId,
      offerPrice: parseFloat(offerPrice),
      comments: comments.trim(),
      tasker:userName,
    };

    try {
      const response = await axios.post(
        "http://localhost:3000/apply-task",
        applicationData
      );

      if (response.status === 200) {
        toast.success("Task Applied Successfully 🎉");
        fetchAppliedTaskers();
        setShowBiddingForm(false);
        navigate("/home");
      }
    } catch (error) {
      console.error(
        "Error applying for task:",
        error.response?.data || error.message
      );
      toast.error("You have already applied for the task.");
    }
  };

  // Handle accept/reject tasker
  const handleAcceptReject = async (taskerId, status) => {
    const reason = status === 0 ? rejectionReasons[taskerId] : null;

    if (status === 0 && !reason) {
      toast.error("Please provide a rejection reason.");
      return;
    }

    try {
      const response = await axios.post("http://localhost:3000/update-tasker", {
        taskId: id,
        taskerId,
        status,
        rejectionReason: reason,
      });

      if (response.status === 200) {
        toast.success(
          `Tasker ${status === 1 ? "Accepted" : "Rejected"} Successfully 🎉`
        );
        fetchAppliedTaskers();
      }
    } catch (error) {
      console.error(
        "Error updating tasker status:",
        error.response?.data || error.message
      );
      toast.error("Something went wrong!");
    }
  };

  const handlePayment = async (tasker) => {
    const formData = {
      total: tasker.offerPrice, // Dynamically set the offer price
      email: localStorage.getItem("userEmail"),
      name: localStorage.getItem("userName"),
      phone: "9800000000", // If needed, fetch dynamically
      items: taskInfo.taskTitle, // Tasker name as the purchased item
    };

    try {
      const response = await axios.post(
        "http://localhost:3000/payment",
        formData
      );
      const esewaData = response.data;

      // Redirect user to Esewa payment page with form data
      const paymentUrl = `https://rc-epay.esewa.com.np/api/epay/main/v2/form`;
      const form = document.createElement("form");
      form.method = "POST";
      form.action = paymentUrl;

      Object.keys(esewaData).forEach((key) => {
        const input = document.createElement("input");
        input.type = "hidden";
        input.name = key;
        input.value = esewaData[key];
        form.appendChild(input);
      });

      document.body.appendChild(form);
      form.submit();
    } catch (error) {
      console.error("Payment Error:", error);
      alert("Failed to initiate payment.");
    }
  };

  return (
    <div className="flex h-screen w-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 pt-6 overflow-y-auto">
        <div className="flex justify-between shadow-md">
          <h1 className="text-2xl font-bold text-black mb-10 px-6">
            Task Detail
          </h1>
          <Subheader />
        </div>
        <main className="bg-gray-50 px-2 pb-20">
         {/*<h1 className="text-4xl font-bold text-primary">Task Detail</h1>*/} 
          <div className="container mt-10 px-4 ml-auto">
            <div className="max-w-4xl bg-white shadow-md rounded-lg overflow-hidden mb-4 p-6 flex gap-6">
              {/* Left: Task Image */}
              <div className="w-1/2 flex items-center justify-center">
                {taskInfo?.image ? (
                  <img
                    src={`http://localhost:3000${taskInfo?.image}`}
                    alt="Task Image"
                    className="w-full h-auto object-cover rounded-md"
                  />
                ) : (
                  <div className="w-full h-64 bg-gray-200 flex items-center justify-center rounded-md">
                    <p className="text-gray-500">No image found</p>
                  </div>
                )}
              </div>

              {/* Right: Task Details */}
              <div className="w-1/2">
                <h2 className="text-xl font-semibold mb-4">
                  {taskInfo?.taskTitle || "Loading..."}
                </h2>
                <p className="mb-3">
                  <strong>Details:</strong>{" "}
                  {taskInfo?.taskInfo || "No details available"}
                </p>
                <p className="mb-3">
                  <strong>Requirements:</strong>{" "}
                  {taskInfo?.requirements || "N/A"}
                </p>
                <p className="mb-6">
                  <strong>Price Range:</strong>{" "}
                  {taskInfo?.priceRange || "Not specified"}
                </p>
                <p className="mb-6">
                  <strong>Posted by:</strong>{" "}
                  {taskInfo?.name || "Not specified"}
                </p>

                {userRole === "Tasker" && (
                  <button
                    className={clsx(
                      "group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md  text-white hover:bg-indigo-700 ",
                      dayjs(taskInfo?.submitBy).isBefore(new Date())
                        ? "bg-gray-500 cursor-not-allowed"
                        : "bg-primary"
                    )}
                    disabled={dayjs(taskInfo?.submitBy).isBefore(new Date())}
                    onClick={handleApply}
                  >
                    Apply Now
                  </button>
                )}
              </div>
            </div>
   
            {userRole === "Tasker" && (
              <>
                <h1 className="text-4xl font-bold mt-12 mb-8">
                  Recommended Tasks
                </h1>
                <div className="grid grid-cols-3 gap-5">
                {[...taskList]
                  .sort(() => Math.random() - 0.5) // shuffle the list
                  .slice(0, 3) // take first 3
                  .map((list) => (
                  <TaskCard key={list.id} 
                  props={list} 
                  isExplorePage={isExplorePage}
                  userRole={userRole} />
                ))}
                </div>
              </>
            )}
            {userRole === "Task Poster" && (
              <div className="mt-8">
                <h2 className="text-2xl font-bold mb-4 text-primary">
                  Applied Taskers
                </h2>
                {appliedTaskers.length > 0 ? (
                  <table className="min-w-full bg-white border border-gray-300 shadow-md rounded-lg">
                    <thead className="bg-primary text-white">
                      <tr>
                        <th className="py-3 px-4 border-b text-left">Name</th>
                        <th className="py-3 px-4 border-b text-left">
                          Offer Price
                        </th>
                        <th className="py-3 px-4 border-b text-left">
                          Comment
                        </th>
                        <th className="py-3 px-4 border-b text-left">Status</th>
                        <th className="py-3 px-4 border-b text-left">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {appliedTaskers.map((tasker) => (
                        <tr
                          key={tasker.id}
                          className="hover:bg-gray-50 transition"
                        >
                          <td className="py-3 px-4 border-b">{tasker.name}</td>
                          <td className="py-3 px-4 border-b">
                            Rs. {tasker.offerPrice}
                          </td>
                          <td className="py-3 px-4 border-b">
                            {tasker.comments}
                          </td>
                          <td className="py-3 px-4 border-b">
                            {tasker.status === 1
                              ? "Accepted"
                              : tasker.status === 0
                              ? "Rejected"
                              : "Pending"}
                          </td>
                          <td className="py-3 px-4 border-b">
                            {tasker.status === 1 ? ( // Show Pay Now if Accepted
                              <button
                                className="bg-green text-white px-4 py-1 rounded"
                                onClick={() => handlePayment(tasker)}
                              >
                                Pay Now
                              </button>
                            ) : tasker.status !== null ? ( // If decision is made
                              <span className="text-gray-600">
                                Decision Made
                              </span>
                            ) : (
                              // If no decision has been made
                              <>
                                <button
                                  className="bg-green text-white px-4 py-1 rounded mr-2"
                                  onClick={() =>
                                    handleAcceptReject(tasker.id, 1)
                                  }
                                >
                                  Accept
                                </button>
                                <button
                                  className="bg-red text-white px-4 py-1 rounded"
                                  onClick={() =>
                                    setShowReasonInput({
                                      ...showReasonInput,
                                      [tasker.id]: true,
                                    })
                                  }
                                >
                                  Reject
                                </button>
                                {showReasonInput[tasker.id] && (
                                  <div className="mt-2">
                                    <input
                                      type="text"
                                      placeholder="Reason for rejection"
                                      className="border p-2 rounded"
                                      onChange={(e) =>
                                        setRejectionReasons({
                                          ...rejectionReasons,
                                          [tasker.id]: e.target.value,
                                        })
                                      }
                                    />
                                    <button
                                      className="bg-blue text-white px-4 py-1 rounded ml-2"
                                      onClick={() =>
                                        handleAcceptReject(tasker.id, 0)
                                      }
                                    >
                                      Submit Reason
                                    </button>
                                  </div>
                                )}
                              </>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <p>No taskers have applied yet.</p>
                )}
              </div>
            )}
          </div>

          {showBiddingForm && (
            <BiddingFormOverlay
              onClose={() => setShowBiddingForm(false)}
              onSubmit={handleBidSubmit}
              priceRange={taskInfo?.priceRange} // Pass the price range here
            />
          )}
        </main>
      </div>
    </div>
  );
};

export default IndividualTask;
