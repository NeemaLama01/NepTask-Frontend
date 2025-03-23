import React from "react";

const TaskOverviewCard = ({ props }) => {
    const statusColor = props.acceptedStatus == 1 
    ? "bg-green"  // Active (Green)
    : props.acceptedStatus == 0 
    ? "bg-red"    // Inactive (Red)
    : "bg-yellow"; // Null (Yellow)

  return (
    <div className="mx-auto w-full bg-white shadow-md rounded-lg overflow-hidden hover:rounded-xl hover:shadow-slate-300 transition-all">
      <div className="px-4 py-6">
        <h2 className="text-lg font-semibold text-gray-800">{props.taskTitle}</h2>
        <span className="text-xs text-gray-600">{props.taskInfo}</span>

        <div className="mt-4 flex gap-4">
          <p className="text-sm bg-purple-200 p-2 rounded text-purple-600">{props.priceRange}</p>
          <p className="text-sm text-white bg-green p-2 rounded">{props.taskType}</p>
        </div>


        {/* Show reason if rejected (acceptedStatus === 0) */}
        {props.acceptedStatus == 0 && props.reason && (
          <div className="mt-4 p-3 bg-orange-100  text-red rounded">
            <p className="text-sm font-semibold ">Rejection Reason:</p>
            <p className="text-xs">{props.reason}</p>
          </div>
        )}
                <div className="flex justify-between items-center mt-4">
          <div className="flex items-center">
            <p className="mr-2 text-sm font-medium">Status:</p>
            <div className={`rounded-full w-3 h-3 ${statusColor}`}></div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default TaskOverviewCard;
