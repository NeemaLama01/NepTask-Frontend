import React, { useState } from "react";
import axios from "axios";


const TaskoverviewCard2 = ({ props }) => {
  const [comment, setComment] = useState(props.comment || "No comment available");
  const [completionPercent, setCompletionPercent] = useState(props.completionPercent || 0);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [editMode, setEditMode] = useState(false);
  
  const userRole = localStorage.getItem("userRole"); // Get user role from localStorage

  const handleSave = async () => {
    setLoading(true);
    setSuccess(false);

    try {
      const response = await axios.put("http://localhost:3000/comment", {
        taskId: props.id,
        comment,
        completionPercent,
      });

      if (response.status === 200) {
        setSuccess(true);
        setEditMode(false);
      } else {
        console.error("❌ Failed to update task");
      }
    } catch (error) {
      console.error("❌ Error updating task:", error);
    }

    setLoading(false);
  };

  return (
    <div className="mx-auto w-full bg-white shadow-md rounded-lg overflow-hidden hover:rounded-xl hover:shadow-slate-300 transition-all">
      <div className="px-4 py-6">
        <h2 className="text-lg font-semibold text-gray-800">{props.taskTitle}</h2>
        <span className="text-xs">{props.taskInfo}</span>

        <div className="mt-4 flex gap-4">
          <p className="text-sm bg-purple-200 p-2 rounded text-purple-700">{props.priceRange}</p>
          <p className="text-sm text-white bg-green p-2 rounded">{props.taskType}</p>
        </div>

        {/* Show comment and completion details only if acceptedStatus === 1 */}
        {props.acceptedStatus === 1 && (
          <div className="mt-4 border-t pt-4">
            {!editMode ? (
              <>
                {/* Display Mode */}
                <p className="text-sm text-gray-700"><strong>Comment:</strong> {comment}</p>
                <p className="text-sm text-gray-700"><strong>Completion:</strong> {completionPercent}%</p>

                {/* Show Edit button only if userRole is "Tasker" */}
                {userRole === "Tasker" && (
                  <button
                    className="mt-3 w-full bg-yellow text-white font-semibold py-2 rounded-md hover:bg-yellow-600 transition"
                    onClick={() => setEditMode(true)}
                  >
                    Edit
                  </button>
                )}
              </>
            ) : (
              <>
                {/* Edit Mode */}
                <label className="block text-sm font-medium text-gray-700">Comment:</label>
                <textarea
                  className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  rows="2"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                />

                <label className="block text-sm font-medium text-gray-700 mt-2">Completion Percentage:</label>
                <select
                  className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  value={completionPercent}
                  onChange={(e) => setCompletionPercent(Number(e.target.value))}
                >
                  {[...Array(11)].map((_, i) => (
                    <option key={i} value={i * 10}>{i * 10}%</option>
                  ))}
                </select>

                <div className="flex gap-3 mt-4">
                  <button
                    className="flex-1 bg-primary text-white font-semibold py-2 rounded-md hover:bg-blue-600 transition disabled:opacity-50"
                    onClick={handleSave}
                    disabled={loading}
                  >
                    {loading ? "Updating..." : "Save"}
                  </button>
                  <button
                    className="flex-1 bg-gray text-white font-semibold py-2 rounded-md hover:bg-gray transition"
                    onClick={() => setEditMode(false)}
                  >
                    Cancel
                  </button>
                </div>

                {success && <p className="mt-2 text-green text-sm">✅ Updated successfully!</p>}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskoverviewCard2;
