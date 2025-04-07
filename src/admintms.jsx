import React, { useEffect, useState } from "react";
import axios from "axios";
import AdminSidebar from "./assets/adminsidebar";
import Header from "./assets/header";

const AdminTms = () => {
  const [tasks, setTask] = useState([]);
  const [loading, setLoading] = useState(true);

  // Rejection reason state and approval status
  const [approvalStatus, setApprovalStatus] = useState({});
  const [rejectionReason, setRejectionReason] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const usersResponse = await axios.get("http://localhost:3000/admintask");
        setTask(usersResponse.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Handle approval action
  const handleApprove = (id) => {
    setApprovalStatus((prevStatus) => ({
      ...prevStatus,
      [id]: "approved",
    }));
  };

  // Handle reject action
  const handleReject = (id) => {
    setApprovalStatus((prevStatus) => ({
      ...prevStatus,
      [id]: "rejected",
    }));
  };

  // Handle rejection reason change
  const handleRejectionReasonChange = (id, value) => {
    setRejectionReason((prevReason) => ({
      ...prevReason,
      [id]: value,
    }));
  };

  // Handle submission of rejection reason
  const handleRejectionSubmit = (id) => {
    setApprovalStatus((prevStatus) => ({
      ...prevStatus,
      [id]: "rejected_done",
    }));
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
                  {/* Approve Button */}
                  {approvalStatus[item.id] !== "approved" && approvalStatus[item.id] !== "rejected_done" && (
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

                  {/* Approved Status */}
                  {approvalStatus[item.id] === "approved" && <span>✅ Done</span>}

                  {/* Rejected Status and Rejection Reason Input */}
                  {approvalStatus[item.id] === "rejected" && (
                    <div>
                      <input
                        type="text"
                        value={rejectionReason[item.id] || ""}
                        onChange={(e) => handleRejectionReasonChange(item.id, e.target.value)}
                        placeholder="Enter rejection reason"
                        className="px-2 py-1 border rounded"
                      />
                      <button
                        className="btn btn-primary ml-2"
                        onClick={() => handleRejectionSubmit(item.id)}
                        disabled={!rejectionReason[item.id]}
                      >
                        Submit
                      </button>
                    </div>
                  )}

                  {/* Rejected Done Status */}
                  {approvalStatus[item.id] === "rejected_done" && <span> ❌ Rejected</span>}
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
