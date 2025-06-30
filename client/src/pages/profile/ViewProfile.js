// ✅ ViewProfile.jsx
import React, { useEffect, useState } from "react";
import api from "../../api";

const ViewProfile = () => {
  const [user, setUser] = useState(null);
  const [isMentor, setIsMentor] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        const { data } = await api.get("/api/users/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setUser(data);

        const mentorRes = await api.get("/api/mentors/check", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setIsMentor(mentorRes.data.isMentor);
      } catch (err) {
        console.error("Error loading profile:", err);
      }
    };

    fetchProfile();
  }, []);

  if (!user) return <p>Loading profile...</p>;

  return (
    <div className="max-w-xl mx-auto bg-white p-6 rounded-lg shadow-md">
      <img
        src={user.profilePic || "https://ui-avatars.com/?name=User"}
        alt="Profile"
        className="w-24 h-24 rounded-full mx-auto mb-4"
      />
      <h2 className="text-xl font-bold text-center mb-2">{user.name}</h2>
      <p className="text-gray-700 text-center">{user.bio}</p>

      <div className="mt-4 space-y-2 text-sm">
        <p>
          📧 <strong>Email:</strong> {user.email}
        </p>
        <p>
          🔗 <strong>LinkedIn:</strong>{" "}
          <a
            href={user.linkedin}
            className="text-indigo-600 hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            {user.linkedin || "N/A"}
          </a>
        </p>
        <p>
          💻 <strong>GitHub:</strong>{" "}
          <a
            href={user.github}
            className="text-indigo-600 hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            {user.github || "N/A"}
          </a>
        </p>
      </div>

      {isMentor && (
        <div className="mt-4 text-green-700 font-medium bg-green-100 px-4 py-2 rounded text-center">
          ✅ You are registered as a mentor
        </div>
      )}
    </div>
  );
};

export default ViewProfile;
