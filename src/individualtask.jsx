import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import clsx from "clsx";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import TaskCard from "./taskcard";
import { useLocation } from "react-router-dom";

const IndividualTask = () => {
  const [taskInfo, setTaskInfo] = useState({});
  const [taskList, setTaskList] = useState([]);
  const [appliedTaskers, setAppliedTaskers] = useState([]);
  const [showReasonInput, setShowReasonInput] = useState({});
  const [rejectionReasons, setRejectionReasons] = useState({});
  const navigate = useNavigate();
  const location = useLocation(); // ✅ Get current route
  const { id } = useParams();
  const userRole = localStorage.getItem("userRole");

  const isExplorePage = location.pathname.startsWith("/explore");

  const handleApply = async (e) => {
    e.preventDefault();
    const userId = localStorage.getItem("userId");

    try {
      const response = await axios.post("http://localhost:3000/apply-task", {
        taskId: id,
        taskerId: userId,
      });

      if (response.status === 200) {
        toast.success("Task Applied Successfully 🎉");
        navigate("/home");
      } else {
        toast.error("Error Applying Job 😢");
      }
    } catch (error) {
      toast.error(error?.response?.data || "Something went wrong!");
      console.error(error);
    }
  };

  const fetchAppliedTaskers = async () => {
    try {
      const response = await axios.get(`http://localhost:3000/get-tasker/${id}`);
      setAppliedTaskers(response?.data?.taskers || []);
    } catch (error) {
      console.error("Error fetching applied taskers:", error);
      setAppliedTaskers([]);
    }
  };

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
        toast.success(`Tasker ${status === 1 ? "Accepted" : "Rejected"} Successfully 🎉`);
        fetchAppliedTaskers(); // Refresh applied taskers after update
      } else {
        toast.error("Error updating tasker status 😢");
      }
    } catch (error) {
      toast.error(error?.response?.data || "Something went wrong!");
      console.error(error);
    }
  };

  useEffect(() => {
    axios
      .get("http://localhost:3000/get-all-Task")
      .then((response) => setTaskList(response?.data))
      .catch((error) => console.log(error));
  }, []);

  useEffect(() => {
    if (id) {
      axios
        .get(`http://localhost:3000/show-task/${id}`)
        .then((response) => setTaskInfo(response?.data))
        .catch((error) => console.log(error));
    }
  }, [id]);

  useEffect(() => {
    if (id && userRole === "Task Poster") {
      fetchAppliedTaskers();
    }
  }, [id, userRole]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <main className="bg-gray-200 pt-20 px-20 pb-20">
      <h1 className="text-4xl font-bold">Task Detail</h1>
      <div className="container mt-20 mx-auto px-4">
        <div className="max-w-2xl mx-auto bg-white shadow-md rounded-lg overflow-hidden mb-4 p-4">
          <h2 className="text-xl font-semibold">{taskInfo.taskTitle}</h2>
          <p className="mt-4"><strong>Details:</strong> {taskInfo.taskInfo}</p>
          <p className="mt-4"><strong>Requirements:</strong> {taskInfo.requirements}</p>
          <p className="mt-4"><strong>Stage:</strong> {taskInfo.priceRange}</p>


          {userRole === "Tasker" && (
            <button
              className={clsx(
                "group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500",
                dayjs(taskInfo.submitBy).isBefore(new Date()) ? "bg-primary pointer-events-none" : "bg-primary"
              )}
              disabled={dayjs(taskInfo.submitBy).isBefore(new Date())}
              onClick={handleApply}
            >
              Apply Now
            </button>
          )}
        </div>

        {userRole === "Tasker" && (
  <>
    <h1 className="text-4xl font-bold mt-12 mb-8">Recommended Tasks</h1>
    <div className="grid grid-cols-3 gap-5">
      {taskList.slice(0, 3).map((list) => (
        <TaskCard props={list} key={list.id} isExplorePage={isExplorePage} userRole={userRole} />
      ))}
    </div>
  </>
)}

        {userRole === "Task Poster" && (
          <div className="mt-8">
            <h2 className="text-2xl font-bold mb-4">Applied Taskers</h2>
            {appliedTaskers.length > 0 ? (
              <table className="min-w-full bg-white border border-gray-300 shadow-md rounded-lg">
                <thead className="bg-gray-100 text-gray-700">
                  <tr>
                    <th className="py-3 px-4 border-b text-left">Name</th>
                    <th className="py-3 px-4 border-b text-left">Email</th>
                    <th className="py-3 px-4 border-b text-left">Status</th>
                    <th className="py-3 px-4 border-b text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {appliedTaskers.map((tasker) => {
                    const statusText = tasker.status === 1 ? "Accepted" :
                      tasker.status === 0 ? "Rejected" : "Pending";

                    return (
                      <tr key={tasker.id} className="hover:bg-gray-50 transition">
                        <td className="py-3 px-4 border-b">{tasker.name}</td>
                        <td className="py-3 px-4 border-b">{tasker.email}</td>
                        <td className="py-3 px-4 border-b">{statusText}</td>
                        <td className="py-3 px-4 border-b">
                          {tasker.status === null ? (
                            <>
                              {showReasonInput[tasker.id] ? (
                                <div className="flex items-center">
                                  <textarea
                                    className="border rounded p-2 mr-2"
                                    placeholder="Enter rejection reason"
                                    value={rejectionReasons[tasker.id] || ""}
                                    onChange={(e) =>
                                      setRejectionReasons({ ...rejectionReasons, [tasker.id]: e.target.value })
                                    }
                                  />
                                  <button className="bg-primary text-white px-4 py-1 rounded hover:bg-blue-600" onClick={() => handleAcceptReject(tasker.id, 0)}>
                                    Submit
                                  </button>
                                </div>
                              ) : (
                                <>
                                  <button className="bg-green-500 text-white px-4 py-1 rounded mr-2 hover:bg-green-600" onClick={() => handleAcceptReject(tasker.id, 1)}>Accept</button>
                                  <button className="bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600" onClick={() => setShowReasonInput({ ...showReasonInput, [tasker.id]: true })}>Reject</button>
                                </>
                              )}
                            </>
                          ) : <span className="text-gray-500">Decision Made</span>}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            ) : <p className="text-gray-500">No taskers have applied yet.</p>}
          </div>
        )}
      </div>
    </main>
  );
};

export default IndividualTask;