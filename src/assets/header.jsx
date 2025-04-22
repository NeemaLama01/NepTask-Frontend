import { BellIcon } from "@heroicons/react/outline";
import { useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import axios from "axios";

const Header = () => {
  const navigate = useNavigate();
  const userRole = localStorage.getItem("userRole");
  const userId = localStorage.getItem("userId"); // Ensure userId is available
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [showProfileOptions, setShowProfileOptions] = useState(false);
  const [profileImage, setProfileImage] = useState("");

  const notificationRef = useRef(null);
  const profileRef = useRef(null);
  const socketRef = useRef(null); // Store socket instance

  useEffect(() => {
    // Fetch notifications from localStorage or API
    const storedNotifications = JSON.parse(localStorage.getItem("notifications")) || [];
    setNotifications(storedNotifications);

    // Set Profile Image
    const storedImage = localStorage.getItem("profileImage");
    if (storedImage) {
      setProfileImage(`http://localhost:3000${storedImage}`);
    }
  }, []);

  // Toggle dropdowns
  const toggleNotifications = () => setShowNotifications(!showNotifications);
  const toggleProfileOptions = () => setShowProfileOptions(!showProfileOptions);

  // Close dropdowns if clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setShowProfileOptions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleTaskClick = () => {
    navigate("/create-task");
  };

  const handleUpdateRedirect = () => {
    navigate("/profilepage");
  };
  // Handle file upload
  const handleUploadClick = async (event) => {
    const file = event.target.files[0];
    if (!file || !userId) return;

    const formData = new FormData();
    formData.append("profileImage", file);
    formData.append("userId", userId);

    try {
      const response = await axios.post("http://localhost:3000/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const imageUrl = `http://localhost:3000${response.data.imageUrl}`;
      setProfileImage(imageUrl);
      localStorage.setItem("profileImage", response.data.imageUrl); // Store relative path
      setShowProfileOptions(false);
    } catch (error) {
      console.error("Error uploading image", error);
    }
  };

  return (
    <header className="flex justify-between items-center mb-6 relative ">
      {/* Greeting Text */}
      <h1 className="text-2xl font-semibold text-black">Good morning {localStorage.getItem("userName")} 👋</h1>

      {/* Actions */}
      <div className="flex items-center space-x-6">
        {/* New Task Button */}
        {userRole === "Task Poster" && (
          <button onClick={handleTaskClick} className="bg-primary text-white px-4 py-2 rounded">
            + New Task
          </button>
        )}

        {/* Notification Icon 
        <button className="relative" onClick={toggleNotifications}>
          <BellIcon className="h-6 w-6 hover:text-gray-700" />
          {notifications.length > 0 && (
            <span className="absolute top-0 right-0 bg-red-500 h-2 w-2 rounded-full"></span>
          )}
        </button>

        {/* Notification Dropdown 
        {showNotifications && (
          <div ref={notificationRef} className="absolute top-12 right-16 bg-white shadow-lg rounded-lg w-64 p-4 z-50 border">
            <h3 className="text-sm font-semibold mb-2">Notifications</h3>
            {notifications.length > 0 ? (
              <ul>
                {notifications.map((notif, index) => (
                  <li key={index} className="text-xs text-gray-600 p-2 border-b last:border-none">
                    {notif}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-xs text-gray-400">No new notifications</p>
            )}
          </div>
        )}
*/}
        {/* Profile Icon */}
        <div className="relative">
          <div className="w-10 h-10 bg-gray-300 rounded-full overflow-hidden cursor-pointer border border-400" onClick={toggleProfileOptions}>
            <img src={profileImage || "/default-avatar.png"} alt="Profile" className="w-full h-full object-cover" />
          </div>

          {/* Profile Options Dropdown */}
          {showProfileOptions && (
            <div ref={profileRef} className="absolute top-12 right-0 bg-white shadow-lg rounded-lg w-40 p-2 z-50 border">
              {/* Hidden File Input */}
              <input
                type="file"
                accept="image/*"
                className="hidden"
                id="uploadProfile"
                onChange={handleUploadClick}
              />
              <label htmlFor="uploadProfile" className="block text-sm text-gray-700 p-2 hover:bg-gray-100 cursor-pointer">
                Upload Image
              </label>
              
              {userRole !== "admin" && (
                <button onClick={handleUpdateRedirect} className="w-full text-left text-sm text-gray-700 p-2 hover:bg-gray-100 rounded">
                  View Profile
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;