import React from "react";
import {
  HomeIcon,
  GlobeAltIcon,
  ClipboardListIcon,
  UserGroupIcon,
} from "@heroicons/react/outline";
import { PowerOffIcon } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

const AdminSidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const sidebarItems = [
    { name: "Dashboard", icon: <HomeIcon className="h-5 w-5 mr-2" />, path: "/home" },
    { name: "Explore", icon: <GlobeAltIcon className="h-5 w-5 mr-2" />, path: "/explore" },
    { name: "Task Management System", icon: <ClipboardListIcon className="h-5 w-5 mr-2" />, path: "/admin-tms" },
    { name: "User Management System", icon: <UserGroupIcon className="h-5 w-5 mr-2" />, path: "/client" },
  ];

  // Function to handle logout
  const handleLogout = () => {
    localStorage.clear(); // Clear all local storage
    navigate("/login"); // Redirect to login page
  };

  return (
    <div className="w-64 bg-white border-r border-gray-200 flex flex-col h-screen p-6">
      <h2 className="text-2xl font-semibold text-blue-700  mb-8">NepTask</h2>
      <ul className="flex-1">
        {sidebarItems.map((item, index) => (
          <li
            key={index}
            onClick={() => navigate(item.path)}
            className={`mb-5 text-xl flex items-center cursor-pointer transition duration-300 px-3 py-2 rounded-md 
              ${
                location.pathname === item.path
                  ? "text-blue-700 bg-gray-200 font-semibold"
                  : "text-gray-700 hover:text-blue-700  hover:bg-gray-200"
              }`}
          >
            {item.icon}
            {item.name}
          </li>
        ))}
      </ul>
      <div
        className="mt-auto flex items-center text-gray-700 hover:text-red-600 hover:bg-gray-200 transition duration-300 cursor-pointer px-3 py-2 rounded-md"
        onClick={handleLogout}
      >
        <PowerOffIcon className="h-5 w-5 mr-2" />
        <span>Logout</span>
      </div>
    </div>
  );
};

export default AdminSidebar;
