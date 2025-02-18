import { BellIcon } from "@heroicons/react/outline";
import { useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";

const Header = () => {
  const navigate = useNavigate();
  const userRole = localStorage.getItem("userRole");
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const notificationRef = useRef(null);

  useEffect(() => {
    // Fetch notifications from localStorage or API (Replace this with actual API call)
    const storedNotifications = JSON.parse(localStorage.getItem("notifications")) || [];
    setNotifications(storedNotifications);
  }, []);

  // Toggle notifications dropdown
  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
  };

  // Close dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleIdeaClick = () => {
    navigate("/create-idea");
  };

  return (
    <header className="flex justify-between items-center mb-6 relative">
      {/* Greeting Text */}
      <h1 className="text-2xl font-semibold text-black">Good morning Ngima 👋</h1>

      {/* Actions (New Idea Button, Notification, and Profile) */}
      <div className="flex items-center space-x-6">
        {/* New Idea Button - Conditionally rendered based on user role */}
        {userRole === "Founder" && (
          <button onClick={handleIdeaClick} className="bg-blue-700 text-white px-4 py-2 rounded">
            + New Task
          </button>
        )}

        {/* Notification Icon */}
        <button className="relative" onClick={toggleNotifications}>
          <BellIcon className="h-6 w-6 hover:text-gray-700" />
          {/* Notification Dot (Only visible if there are unread notifications) */}
          {notifications.length > 0 && (
            <span className="absolute top-0 right-0 bg-red-500 h-2 w-2 rounded-full"></span>
          )}
        </button>

        {/* Notification Dropdown */}
        {showNotifications && (
          <div
            ref={notificationRef}
            className="absolute top-12 right-16 bg-white shadow-lg rounded-lg w-64 p-4 z-50 border"
          >
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

        {/* Profile Icon */}
        <div className="w-10 h-10 bg-gray-300 rounded-full overflow-hidden">
          <img
            src="/profile.jpg" 
            alt="Profile"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </header>
  );
};

export default Header;
