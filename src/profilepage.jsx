import { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "./assets/sidebar";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [location, setQualification] = useState("");
  const [phone, setBio] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const userId = localStorage.getItem("userId");
  const navigate = useNavigate();

  useEffect(() => {
    if (!userId) {
      window.location.href = "/login";
    } else {
      axios
        .get(`http://localhost:3000/get-profile/${userId}`)
        .then((response) => {
          setUser(response.data);
          setQualification(response.data.location || "");
          setBio(response.data.phone || "");
          setLoading(false);
        })
        .catch((err) => {
          setError("Failed to fetch profile.");
          setLoading(false);
        });
    }
  }, [userId]);

  const handleUpdate = () => {
    axios
      .put("http://localhost:3000/update-profile", {
        userId,
        location,
        phone,
      })
      .then(() => {
        toast.success("Profile updated successfully!");
        setEditMode(false);
        navigate("/home");
      })
      .catch(() => {
        toast.error("Error updating profile!");
      });
  };

  const handleCancel = () => {
    if (user) {
      setQualification(user.location || "");
      setBio(user.phone || "");
    }
    setEditMode(false);
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="flex h-screen w-screen bg-gray-50">
      <Sidebar />
      <div className="p-8 w-full bg-white shadow-lg rounded-lg space-y-6">
        {user && (
          <>
            <div className="flex flex-col items-center mb-6">
              <img
                src={`http://localhost:3000${user.profile_image}`}
                alt="Profile"
                className="w-40 h-40 rounded-full object-cover border-4 border-primary"
              />
              <div className="text-2xl font-semibold text-gray-800 mt-4">
                {user.username}
              </div>
              <div className="text-xl font-medium text-gray-600">
                {user.email}
              </div>
            </div>

            <div className="mt-6">
              <label className="text-2xl font-medium text-gray-600">
                Location
              </label>
              {editMode ? (
                <input
                  type="text"
                  className="w-full p-3 border-2 border-gray-300 rounded-lg mt-2 text-xl"
                  placeholder="Enter your location"
                  value={location}
                  onChange={(e) => setQualification(e.target.value)}
                />
              ) : (
                <p className="text-xl text-gray-700 mt-2">
                  {location || "Not provided"}
                </p>
              )}
            </div>

            <div className="mt-6">
              <label className="text-2xl font-medium text-gray-600">Phone</label>
              {editMode ? (
                <textarea
                  className="w-full p-3 border-2 border-gray-300 rounded-lg mt-2 text-xl"
                  placeholder="Write something about yourself"
                  value={phone}
                  onChange={(e) => setBio(e.target.value)}
                ></textarea>
              ) : (
                <p className="text-xl text-gray-700 mt-2 whitespace-pre-line">
                  {phone || "Not provided"}
                </p>
              )}
            </div>

            <div className="mt-6 space-x-4">
              {!editMode ? (
                <button
                  className="bg-primary text-white px-6 py-3 rounded-full text-xl hover:bg-black"
                  onClick={() => setEditMode(true)}
                >
                  Edit Profile
                </button>
              ) : (
                <>
                  <button
                    className="bg-green text-white px-6 py-3 rounded-full text-xl hover:bg-black"
                    onClick={handleUpdate}
                  >
                    Update Profile
                  </button>
                  <button
                    className="bg-gray-400 text-white px-6 py-3 rounded-full text-xl hover:bg-gray-500"
                    onClick={handleCancel}
                  >
                    Cancel
                  </button>
                </>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
