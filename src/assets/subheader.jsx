import { BellIcon } from "@heroicons/react/outline";
import { useEffect, useRef, useState } from "react";
import axios from "axios";

const Subheader = () => {
  const userId = localStorage.getItem("userId"); // Ensure userId is available
  const [profileImage, setProfileImage] = useState("");

  useEffect(() => {
    // Set Profile Image from Local Storage
    const storedImage = localStorage.getItem("profileImage");
    if (storedImage) {
      setProfileImage(`http://localhost:3000${storedImage}`);
    }
  }, []);

  return (
    <header className="flex items-center justify-end mb-6">
      {/* Notification Bell */}
      <button className="relative mr-5">
        <BellIcon className="h-6 w-6 hover:text-gray-700" />
        <span className="absolute top-0 right-0 bg-red-500 h-2 w-2 rounded-full"></span>
      </button>

      {/* Profile Image (Without Dropdown) */}
      <div className="w-10 h-10 bg-gray-300 rounded-full overflow-hidden">
        <img src={profileImage || "/default-avatar.png"} alt="Profile" className="w-full h-full object-cover" />
      </div>
    </header>
  );
};

export default Subheader;