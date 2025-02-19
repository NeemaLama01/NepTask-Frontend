import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";



const Collab = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const formData = location.state || {};
  const [error, setError] = useState("");
  const [equity, setEquity] = useState("");
  const [loading, setLoading] = useState(false);

  const validateEquity = () => {
    const percentage = parseFloat(equity);
    if (isNaN(percentage) || percentage < 0 || percentage > 100) {
      setError("Equity must be a valid percentage between 0 and 100.");
      return false;
    }
    setError("");
    return true;
  };

  const handleSubmit = async () => {
    if (!validateEquity()) return;

    setLoading(true);
    try {
      const userId = localStorage.getItem("userId");
      await axios.post("http://localhost:3000/create-idea", {
        userId,
        ...formData,
        equity,
        status: true,
      });

      toast.success("Project activated successfully!");
      navigate("/my-ideas");
    } catch (error) {
      toast.error("Error activating project. Please try again.");
      console.error("Submission error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleArchive = async () => {
    console.log("Archive button clicked"); // Debugging
    setLoading(true);
    try {
      const userId = localStorage.getItem("userId");
      const response = await axios.post("http://localhost:3000/create-idea", {
        userId,
        ...formData,
        equity,
        status: false,
      });
  
      toast.success("Project archived successfully.");
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
              <p className="p-2 text-indigo-600 bg-gray-200 rounded">
                2. Collaboration Terms
              </p>
            </div>
          </li>
        </ul>
      </div>

      <div className="flex flex-col w-screen px-5 mt-6">
        <h1 className="text-2xl font-bold mb-6">Collaboration Terms</h1>
        <p>
          This Collaboration Terms Agreement ("Agreement") is made on this day
          between the Initiator and any potential Collaborator(s) interested in
          contributing to the project.
        </p>

        <div className="grid grid-cols-1 gap-6">
          {error && (
            <div className="text-red-500 mx-auto text-sm text-center">
              {error}
            </div>
          )}

          {/* Project Overview */}
          <div>
            <label className="block text-xl mt-5 font-bold text-gray-700">
              Project Overview
            </label>
            <ul className="list-disc ml-5">
              <li>
                <strong>Project Title:</strong> {formData.ideaTitle}
              </li>
              <li>
                <strong>Project Description:</strong> {formData.ideaInfo}
              </li>
              <li>
                <strong>Idea Type:</strong> {formData.ideaType}
              </li>
              <li>
                <strong>Stage of Development:</strong> {formData.ideaStage}
              </li>
            </ul>
          </div>

          {/* Roles & Responsibilities */}
          <div>
            <label className="block text-xl mt-5 font-bold text-gray-700">
              Roles & Responsibilities
            </label>
            <ul className="list-disc ml-5">
              <li>
                <strong>Required Expertise:</strong> {formData.requirement}
              </li>
              <li>
                The collaborator(s) shall actively participate in the
                development, feedback, and execution of the project.
              </li>
              <li>
                Any responsibilities assigned must be fulfilled within agreed
                timelines.
              </li>
            </ul>
          </div>

          {/* Equity Distribution & Ownership */}
          <div>
            <label className="block text-xl mt-5 font-bold text-gray-700">
              Equity Distribution & Ownership
            </label>
            <ul className="list-disc ml-5">
              <li>
                <strong>Equity Share:</strong>
                <input
                  type="text"
                  value={equity}
                  onChange={(e) => setEquity(e.target.value)}
                  className="ml-2 border border-gray-300 rounded-md p-1 w-20"
                  placeholder="e.g. 10%"
                />
                (to be mutually agreed upon by all parties).
              </li>
              <li>
                Ownership of the project will be divided as per the
                contributions made by each party.
              </li>
              <li>
                Any modifications to the equity structure must be approved by
                all stakeholders.
              </li>
            </ul>
          </div>

          {/* Confidentiality & Intellectual Property */}
          <div>
            <label className="block text-xl mt-5 font-bold text-gray-700">
              Confidentiality & Intellectual Property
            </label>
            <ul className="list-disc ml-5">
              <li>
                All discussions, documents, and intellectual property related to
                the project must remain confidential.
              </li>
              <li>
                Any IP generated shall remain the joint property of all
                contributors unless otherwise specified.
              </li>
            </ul>
          </div>

          {/* Dispute Resolution */}
          <div>
            <label className="block text-xl mt-5 font-bold text-gray-700">
              Dispute Resolution
            </label>
            <ul className="list-disc ml-5">
              <li>
                Any conflicts or disputes shall be resolved through discussion
                and, if necessary, through a third-party mediator.
              </li>
            </ul>
          </div>

          {/* Agreement Acceptance */}
          <div className="flex justify-between mt-10">
            <button
              type="button"
              onClick={handleArchive}
              className="inline-flex justify-center rounded-md bg-gray-600 py-2 px-4 text-sm font-medium text-white hover:bg-gray-700"
              disabled={loading}
            >
              {loading ? "Archiving..." : "Archive"}
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              className="inline-flex justify-center rounded-md bg-indigo-600 py-2 px-4 text-sm font-medium text-white hover:bg-indigo-700"
              disabled={loading}
            >
              {loading ? "Activating..." : "Activate"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Collab;
