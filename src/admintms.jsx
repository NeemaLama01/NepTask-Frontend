import React, { useEffect, useState } from "react";
import axios from "axios";
import AdminSidebar from "./assets/adminsidebar";
import Header from "./assets/header";

const AdminTms = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [rejectionReason, setRejectionReason] = useState({});
  const [showRejectionInput, setShowRejectionInput] = useState({}); // Track which task is rejecting
  const [hideButtons, setHideButtons] = useState({}); // Track which task buttons should be hidden

  useEffect(() => {
    const fetchData = async () => {
      try {
        const usersResponse = await axios.get("http://localhost:3000/admintask");
        setTasks(usersResponse.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const updateApproval = async (id, reason, approval_status) => {
    try {
      await axios.put(`http://localhost:3000/admin_approval`, {
        id,
        rejection_reason: reason,
        admin_approval: approval_status,
      });
    } catch (error) {
      console.error("Error updating task:", error);
      throw error; // Re-throw to handle in the calling function
    }
  };

  const handleApprove = async (id) => {
    try {
      // Optimistically update the UI
      setTasks(prevTasks =>
        prevTasks.map(task =>
          task.id === id ? { ...task, admin_approval: 1 } : task
        )
      );
      
      // Update in backend
      await updateApproval(id, "", 1);
    } catch (error) {
      console.error("Error approving task:", error);
      // Revert if API call fails
      setTasks(prevTasks =>
        prevTasks.map(task =>
          task.id === id ? { ...task, admin_approval: 0 } : task
        )
      );
    }
  };

  const handleReject = (id) => {
    // Show the rejection input and hide approve/reject buttons for the current task
    setShowRejectionInput((prev) => ({ ...prev, [id]: true }));
    setHideButtons((prev) => ({ ...prev, [id]: true }));
    setRejectionReason((prev) => ({ ...prev, [id]: "" })); // Reset the reason input
  };

  const handleRejectionSubmit = async (id) => {
    if (!rejectionReason[id]) return;

    try {
      // Optimistically update the UI
      setTasks(prevTasks =>
        prevTasks.map(task =>
          task.id === id
            ? { ...task, admin_approval: 2, rejection_reason: rejectionReason[id] }
            : task
        )
      );
      
      // Update in backend
      await updateApproval(id, rejectionReason[id], 2);
      setRejectionReason(prev => ({ ...prev, [id]: undefined }));
      setShowRejectionInput(prev => ({ ...prev, [id]: false })); // Hide rejection input after submission
      setHideButtons(prev => ({ ...prev, [id]: false })); // Show the approve/reject buttons again after submission
    } catch (error) {
      console.error("Error rejecting task:", error);
      // Revert if API call fails
      setTasks(prevTasks =>
        prevTasks.map(task =>
          task.id === id ? { ...task, admin_approval: 0 } : task
        )
      );
    }
  };

  const handleRejectionReasonChange = (id, value) => {
    setRejectionReason(prev => ({ ...prev, [id]: value }));
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex h-screen w-screen bg-gray-50">
      <AdminSidebar />

      <div className="flex-1 p-6 overflow-y-auto">
        <Header />

        <table className="w-full border-collapse bg-white shadow-lg rounded-lg mt-7">
          <thead>
            <tr className="text-center text-white bg-primary">
              <th className="py-2 px-4">Task Title</th>
              <th className="py-2 px-4">Task Poster</th>
              <th className="py-2 px-4">Price Range</th>
              <th className="py-2 px-4">Task Type</th>
              <th className="py-2 px-4">Task Info</th>
              <th className="py-2 px-4">Approval</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((item) => (
              <tr key={item.id} className="text-center border-t hover:bg-gray-100">
                <td className="py-3 px-4">{item.taskTitle}</td>
                <td className="py-3 px-4">{item.name}</td>
                <td className="py-3 px-4">{item.priceRange}</td>
                <td className="py-3 px-4">{item.taskType}</td>
                <td className="py-3 px-4">{item.taskInfo}</td>
                <td className="py-3 px-4">
                  {/* Pending Approval */}
                  {item.admin_approval !== 1 && item.admin_approval !== 2 && !hideButtons[item.id] && (
                    <>
                      <button
                        className="btn text-white bg-[#008847] rounded-md px-3 py-2 mr-2"
                        onClick={() => handleApprove(item.id)}
                      >
                        Approve
                      </button>
                      <button
                        className="btn text-white bg-[#EF403E] rounded-md mr-2 px-3 py-2"
                        onClick={() => handleReject(item.id)}
                      >
                        Reject
                      </button>
                    </>
                  )}

                  {/* Rejection Reason Input */}
                  {showRejectionInput[item.id] && (
                    <div className="mt-2 flex flex-col">
                      <input
                        type="text"
                        value={rejectionReason[item.id] || ""}
                        onChange={(e) => handleRejectionReasonChange(item.id, e.target.value)}
                        placeholder="Enter rejection reason"
                        className="px-2 py-1 border rounded w-auto"
                      />
                      <button
                        className="btn bg-[#EF403E] text-white mt-2 px-3 py-1 rounded"
                        onClick={() => handleRejectionSubmit(item.id)}
                        disabled={!rejectionReason[item.id]}
                      >
                        Submit Rejection
                      </button>
                    </div>
                  )}

                  {/* Approved Status */}
                  {item.admin_approval === 1 && (
                    <span className="text-green-600 font-medium">✅ Approved</span>
                  )}

                  {/* Rejected Status */}
                  {item.admin_approval === 2 && (
                    <div>
                      <span className="text-red-600 font-medium">❌ Rejected</span>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminTms;
