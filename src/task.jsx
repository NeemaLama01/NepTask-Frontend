import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Import styles

const task = () => {
    const [selectedOptions, setSelectedOptions] = useState([]);
    const [selectedOptions1, setSelectedOptions1] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const [isOpen1, setIsOpen1] = useState(false);
    const [taskTitle, settaskTitle] = useState("");
    const [taskInfo, settaskInfo] = useState("");
    const [taskType, settaskType] = useState("");
    const [taskStage, settaskStage] = useState("");
    const [requirement, setRequirement] = useState("");
    const [error, setError] = useState("");

    const field = ["Tech", "Errands", "Petcare", "Healthcare", "Education", "Other"];
    const task = ["task", "Prototype", "Early Development", "Beta", "Launched"];

    const navigate = useNavigate();

    const handleField = (field) => {
        setSelectedOptions((prev) =>
            prev.includes(field) ? prev.filter((item) => item !== field) : [...prev, field]
        );

        settaskType((prev) => {
            const prevArray = prev ? prev.split(", ").filter(Boolean) : [];
            return prevArray.includes(field)
                ? prevArray.filter((item) => item !== field).join(", ")
                : [...prevArray, field].join(", ");
        });
    };

    const handletask = (stage) => {
        setSelectedOptions1((prev) =>
            prev.includes(stage) ? prev.filter((item) => item !== stage) : [...prev, stage]
        );

        settaskStage((prev) => {
            const prevArray = prev ? prev.split(", ").filter(Boolean) : [];
            return prevArray.includes(stage)
                ? prevArray.filter((item) => item !== stage).join(", ")
                : [...prevArray, stage].join(", ");
        });
    };

    const handleNext = () => {
        if (!taskTitle.trim() || !taskInfo.trim() || !taskType || !taskStage || !requirement) {
            setError("Please fill in all required fields.");
            toast.error("Please fill in all required fields!", { position: "top-right" });
            return;
        }

        toast.success("task created successfully!", { position: "top-right" });

        navigate("/collab-task", {
            state: { taskTitle, taskInfo, taskType, taskStage, requirement },
        });
    };

    return (
        <div className="flex bg-white  h-screen mt-20 rounded-lg shadow-md p-8">

<div className="bg-white border-r border-gray-200 flex flex-col p-6">
  {/* Main Sidebar Items */}
  <ul className="flex-1">
    {/* List Item with Multiple Lines */}
    <li className="mb-10 text-xl font-light text-gray-700 transition duration-300 cursor-pointer p-4 rounded">
      <div className="space-y-10">
        <p className="text-indigo-600 bg-gray-200 p-2 rounded ">1. Details</p>
        <p className=" p-2">2. Collaboration Terms</p>
      </div>
    </li>
  </ul>
</div>

      <div className='flex flex-col w-screen px-5 mt-6'>
      <h1 className="text-2xl font-bold mb-6">Create new task</h1>

      <div className=" grid grid-cols-1 gap-6">
        <div>
          <label htmlFor="task-title" className="block text-sm font-medium text-gray-700">
            Task title
          </label>
          <input
            type="text"
            id="task-title"
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            placeholder="e.g. AI-based video recruitment and assessment tool"
            value={taskTitle}
            onChange={(e)=> settaskTitle(e.target.value)} 
          />
        </div>

        <div>
          <label htmlFor="project-description" className="block text-sm font-medium text-gray-700 mt-10">
            Describe your task in a sentence
          </label>
          <textarea
            id="project-description"
            rows={3}
            className="mt-1 block w-full  rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            placeholder="e.g., Improving recruitment efficiency with advanced tools for modern hiring challenges."
            required
            value={taskInfo}
            onChange={(e)=> settaskInfo(e.target.value)} 

          />
          <p className="mt-2 text-sm text-gray-500">*Max word 15 words</p>
        </div>

        <div className="w-full max-w-md">
      {/* Label */}
      <label htmlFor="task-type" className="block text-sm font-medium text-gray-700 mt-10">
        Type of the task
      </label>

      {/* Custom Dropdown Button */}
      <div className="relative">
  <button
    type="button"
    onClick={() => setIsOpen(!isOpen)}
    className="mt-1 block w-full rounded-md border border-gray-300 bg-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 text-left"
  >
    {selectedOptions.length > 0 ? selectedOptions.join(", ") : "Select options"}
  </button>

  {isOpen && (
    <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg p-2">
      {field.map((field) => (
        <label key={field} className="flex items-center p-2 hover:bg-gray-100 cursor-pointer">
          <input
            type="checkbox"
            checked={selectedOptions.includes(field)}
            onChange={() => handleField(field)}
            className="mr-2"
          />
          {field}
        </label>
      ))}
    </div>
  )}
</div>
    </div>


    <div className="w-full max-w-md">
      {/* Label */}
      <label htmlFor="stage-type" className="block text-sm font-medium text-gray-700 mt-10">
        Type of the stage
      </label>

      {/* Custom Dropdown Button */}
      <div className="relative">
  <button
    type="button"
    onClick={() => setIsOpen1(!isOpen1)}
    className="mt-1 block w-full rounded-md border border-gray-300 bg-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 text-left"
  >
    {selectedOptions1.length > 0 ? selectedOptions1.join(", ") : "Select stage"}
  </button>

  {isOpen1 && (
    <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg p-2">
      {task.map((stage) => (
        <label key={stage} className="flex items-center p-2 hover:bg-gray-100 cursor-pointer">
          <input
            type="checkbox"
            checked={selectedOptions1.includes(stage)}
            onChange={() => handletask(stage)}
            className="mr-2"
          />
          {stage}
        </label>
      ))}
    </div>
  )}
</div>

    </div>
        <div>
<label htmlFor="required-expertise" className="block text-sm font-medium text-gray-700 mt-10">
  Required expertise
</label>
<select
      id="required-expertise"
      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
      required
      value={requirement} // Important: Controlled component
      onChange={(e) => setRequirement(e.target.value)}
    >
      <option value="">Select Expertise</option> {/* Add a default/placeholder option */}
      <option value="UI/UX">UI/UX</option> {/* Add 'value' attributes */}
      <option value="Fullstack dev">Fullstack dev</option>
      {/* More options as needed */}
    </select>
        </div>

        <div className="flex justify-between mt-10">
        <button
            type="button"
            className="inline-flex justify-center rounded-md border border-transparent bg-white-600 py-2 px-4 text-sm font-medium text-black shadow-sm hover:bg-black hover:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleNext}
            className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Next
          </button>

        </div>
      </div>
    </div>
    </div>
   
  );
};


export default task;
