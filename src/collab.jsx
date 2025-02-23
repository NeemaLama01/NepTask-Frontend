import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Header from "./assets/header";

const Collab = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const formData = location.state || {};
  const [loading, setLoading] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);

  const handleSubmit = async () => {
    if (!agreeTerms) {
      toast.error("You must agree to the terms and conditions to proceed.");
      return;
    }

    setLoading(true);
    try {
      const userId = localStorage.getItem("userId");
      await axios.post("http://localhost:3000/create-task", {
        userId,
        ...formData,
        status: true,
      });
      
      toast.success("Project activated successfully!");
      navigate("/my-tasks");
    } catch (error) {
      toast.error("Error activating project. Please try again.");
      console.error("Submission error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleArchive = async () => {
    setLoading(true);
    try {
      const userId = localStorage.getItem("userId");
      await axios.post("http://localhost:3000/create-task", {
        userId,
        ...formData,
        status: false,
      });
      
      toast.success("Task archived successfully.");
      navigate("/home");
    } catch (error) {
      console.error("Submission error:", error);
      toast.error("Error archiving project. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex bg-white h-screen rounded-lg shadow-md p-8">
      
      <div className="bg-white border-r border-gray-200 flex flex-col p-6">
        
        <ul className="flex-1">
          <li className="mb-10 text-xl font-light text-gray-700 transition duration-300 cursor-pointer p-4 rounded">
            <div className="space-y-10">
              <p>1. Details</p>
              <p className="p-2 text-primary bg-gray-200 rounded">
                2. Collaboration Terms
              </p>
            </div>
          </li>
        </ul>
      </div>
      <div className="flex flex-col w-screen px-5 mt-6">
        <h1 className="text-2xl font-bold mb-6">Collaboration Agreement</h1>
        <p>
          This Agreement outlines the terms and conditions for collaboration on NepTask projects.
          By proceeding, all parties agree to adhere to the following terms:
        </p>

        {/* Roles & Responsibilities */}
        <div>
          <label className="block text-xl mt-5 font-bold text-gray-700">
            Roles & Responsibilities
          </label>
          <ul className="list-disc ml-5">
            <li>Collaborators must complete assigned tasks within the agreed deadlines.</li>
            <li>Fair and transparent communication should be maintained between all parties.</li>
          </ul>
        </div>

        {/* Payment & Task Completion */}
        <div>
          <label className="block text-xl mt-5 font-bold text-gray-700">
            Payment & Task Completion
          </label>
          <ul className="list-disc ml-5">
            <li>Payment will be processed only after successful task completion and client approval.</li>
            <li>Any disputes regarding task completion will be resolved through NepTask’s support team.</li>
          </ul>
        </div>

        {/* Confidentiality & Trust */}
        <div>
          <label className="block text-xl mt-5 font-bold text-gray-700">
            Confidentiality & Trust
          </label>
          <ul className="list-disc ml-5">
            <li>Personal and project-related information must remain confidential.</li>
            <li>Trust and integrity are key to successful collaborations on NepTask.</li>
          </ul>
        </div>

        {/* Agreement Acceptance Checkbox */}
        <div className="mt-6">
          <label className="inline-flex items-center">
            <input
              type="checkbox"
              checked={agreeTerms}
              onChange={(e) => setAgreeTerms(e.target.checked)}
              className="form-checkbox"
            />
            <span className="ml-2 text-gray-700">I agree to the terms and conditions of NepTask.</span>
          </label>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between mt-10">
          <button
            type="button"
            onClick={handleArchive}
            className="inline-flex justify-center rounded-md bg-white py-2 px-4 text-sm font-medium text-primary border border-primary hover:bg-gray-700"
            disabled={loading}
          >
            {loading ? "Archiving..." : "Archive"}
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className="inline-flex justify-center rounded-md bg-primary py-2 px-4 text-sm font-medium text-white hover:bg-indigo-700"
            disabled={loading}
          >
            {loading ? "Activating..." : "Activate Project"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Collab;
