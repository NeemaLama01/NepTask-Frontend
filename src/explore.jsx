import React, { useEffect, useState } from "react";
import { Search } from "lucide-react";
import axios from "axios";
import JobCard from "./taskcard";
import Sidebar from "./assets/sidebar";
import Subheader from "./assets/subheader";

const Explore = () => {
  const [IdeaList, setIdeaList] = useState([]);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchIdeas(); // Initial data fetch
  }, []);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchIdeas(searchQuery);
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  const fetchIdeas = (query = "") => {
    const url = query.trim()
      ? `http://localhost:3000/get-All-Idea?query=${query}`
      : "http://localhost:3000/get-All-Idea";

    axios
      .get(url)
      .then((response) => {
        setIdeaList(response?.data);
        setError("");
      })
      .catch((error) => {
        console.error("Error fetching task:", error);
        setIdeaList([]); // Clear list on error
        setError("Failed to load tasks. Please try again.");
      });
  };

  return (
    <div className="flex h-screen w-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 p-6 overflow-y-auto">
        <Subheader />
        {error && <p className="text-red-500">{error}</p>}

        {/* Search Bar */}
        <div className="max-w-md bg-white rounded-lg overflow-hidden shadow-lg">
          <div className="flex items-center border-b border-gray-200 px-4">
            <input
              type="text"
              className="w-full py-4 px-6 focus:outline-none"
              placeholder="Enter the task name, task type..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button className="p-2 rounded-sm transition duration-300">
              <Search className="h-6 w-6 text-black opacity-50" />
            </button>
          </div>
        </div>

        {/* Ideas Section */}
        <section className="mt-5">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-3xl font-semibold text-black">Explore Tasks</h2>
            <a href="#" className="text-blue-700">
              View all
            </a>
          </div>
          <div className="grid grid-cols-3 gap-6">
            {IdeaList.map((list) => (
              <JobCard props={list} key={list.id} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Explore;
