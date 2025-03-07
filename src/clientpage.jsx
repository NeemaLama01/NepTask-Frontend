import React, { useEffect, useState } from "react";
import { Search } from "lucide-react"; 
import axios from "axios";
import Sidebar from "./assets/sidebar";
import Subheader from "./assets/subheader";

import ClientCard from "./clientcard";


const ClientPage = () => {
  const [UserList, setUserList] = useState([]);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const userId = localStorage.getItem("userId"); 

  useEffect(() => {
    fetchUsers(); // Initial data fetch
  }, []);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchUsers(searchQuery);
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  const fetchUsers = (query = "") => {
    const url = query.trim()
      ? `http://localhost:3000/getUsers?query=${query}`
      : "http://localhost:3000/getUsers";

    axios
      .get(url, {
        headers: { userId }, 
      })
      .then((response) => {
        setUserList(response?.data);
        setError("");
      })
      .catch((error) => {
        console.error("Error fetching Users:", error);
        setUserList([]); // Clear list on error
        setError("Failed to load Users. Please try again.");
      });
  };

  return (
    <div className="flex h-screen w-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 p-6 overflow-y-auto">
        <div className="flex justify-between">
          <h2 className="text-3xl font-semibold text-black">Connections</h2>
          <Subheader />
        </div>

        {error && <p className="text-red-500">{error}</p>}

        {/* Search Bar */}
        <section className="mt-auto">
          <div className="flex justify-between items-center mb-4">
            <div className="max-w-md bg-white rounded-lg overflow-hidden shadow-lg">
              <div className="flex items-center border-b border-gray-200 px-4">
              <input
              type="text"
              className="w-full py-4 px-6 focus:outline-none"
              placeholder="Enter the name, role..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
                <button className="p-2 rounded-sm transition duration-300">
                  <Search className="h-6 w-6 text-black opacity-50" />
                </button>
              </div>
            </div>
            <a href="#" className="text-indigo-600">View all</a>
          </div>

          {/* User List */}
          <div className="grid grid-cols-3 gap-6">
            {UserList.map((list, index) => (
              <ClientCard props={list} key={list.id || index} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default ClientPage;