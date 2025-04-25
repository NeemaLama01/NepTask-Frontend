import { BellIcon } from "@heroicons/react/outline";
import { useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { io } from "socket.io-client";
import { formatDistanceToNow } from "date-fns";

const Header = () => {
  const navigate = useNavigate();
  const userRole = localStorage.getItem("userRole");
  const userId = localStorage.getItem("userId");
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [showProfileOptions, setShowProfileOptions] = useState(false);
  const [profileImage, setProfileImage] = useState("");
  const [hasUnread, setHasUnread] = useState(false);

  const notificationRef = useRef(null);
  const profileRef = useRef(null);
  const socketRef = useRef(null); // Store socket instance

  useEffect(() => {
    // Fetch notifications from API on component mount
   const fetchNotifications = async () => {
  try {
    const response = await axios.get(`http://localhost:3000/notifications/${userId}`);
    const notifData = response.data.notifications;
    setNotifications(notifData);
    setHasUnread(notifData.some((notif) => notif.isUnread)); // check if any are unread
  } catch (error) {
    console.error("Error fetching notifications", error);
  }
};

    if (userId) {
      fetchNotifications();

      // Setup real-time notification listener
      if (!socketRef.current) {
        socketRef.current = io("http://localhost:3000");

        socketRef.current.on("newNotification", (notif) => {
          console.log("🔔 New notification received:", notif);
          setNotifications((prev) => [notif, ...prev]); // Prepend new notification
        });
      }
    }

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, [userId]);
  useEffect(() => {
    const storedImage = localStorage.getItem("profileImage");
    if (storedImage) {
      setProfileImage(`http://localhost:3000${storedImage}`);
    }
  }, []);

  // Toggle dropdowns
 
  const toggleProfileOptions = () => setShowProfileOptions(!showProfileOptions);

  const toggleNotifications = async () => {
    const newShow = !showNotifications;
    setShowNotifications(newShow);
  
    if (newShow && hasUnread) {
      try {
        await axios.post(`http://localhost:3000/notifications/mark-read`, { userId });
        setHasUnread(false); // Clear red dot
        // Optionally update notification state too
        setNotifications((prev) => prev.map(n => ({ ...n, isUnread: false })));
      } catch (err) {
        console.error("Error marking notifications as read", err);
      }
    }
  };

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
    <header className="flex justify-between items-center mb-6 relative">
      <h1 className="text-2xl font-semibold text-black">Good morning {localStorage.getItem("userName")} 👋</h1>
      <div className="flex items-center space-x-6">
        {userRole === "Founder" && (
          <button onClick={handleTaskClick} className="bg-indigo-600 text-white px-4 py-2 rounded">
            + New Task
          </button>
        )}

        <button className="relative" onClick={toggleNotifications}>
          <BellIcon className="h-6 w-6 hover:text-gray-700" />
          {hasUnread && (
  <span className="absolute top-0 right-0 bg-red h-2 w-2 rounded-full"></span>
)}
        </button>

        {showNotifications && (
          <div ref={notificationRef} className="absolute top-12 right-16 bg-white shadow-lg rounded-lg w-64 p-4 z-50 border">
            <h3 className="text-sm font-semibold mb-2">Notifications</h3>
            {notifications.length > 0 ? (
              <ul>
{notifications.map((notif, index) => (
  <li key={index} className="text-xs text-gray-600 p-2 border-b last:border-none">
    <div>You have a new <span className="font-medium">{notif.type}</span></div>
    <div className="text-[10px] text-gray-400">
      {formatDistanceToNow(new Date(notif.createdAt), { addSuffix: true })}
    </div>
  </li>
))}
              </ul>
            ) : (
              <p className="text-xs text-gray-400">No new notifications</p>
            )}
          </div>
        )}

        <div className="relative">
          <div className="w-10 h-10 bg-gray-300 rounded-full overflow-hidden cursor-pointer" onClick={toggleProfileOptions}>
            <img src={profileImage || "/default-avatar.png"} alt="Profile" className="w-full h-full object-cover" />
          </div>

          {showProfileOptions && (
            <div ref={profileRef} className="absolute top-12 right-0 bg-white shadow-lg rounded-lg w-40 p-2 z-50 border">
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