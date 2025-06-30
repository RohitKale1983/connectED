import React, { useEffect, useState } from "react";
import api from "../api";
import { toast } from "react-toastify";

const MentorList = () => {
  const [mentors, setMentors] = useState([]);

  const fetchMentors = async () => {
    try {
      const res = await api.get("/api/mentors/all");
      setMentors(res.data);
    } catch (err) {
      console.error("Failed to fetch mentors", err);
      toast.error("Could not load mentors");
    }
  };

  useEffect(() => {
    fetchMentors();
  }, []);

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h2 className="text-3xl font-bold mb-6">Mentors You Can Connect With</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {mentors.map((mentor) => (
          <div
            key={mentor._id}
            className="bg-white shadow-md p-4 rounded-2xl flex flex-col items-center text-center"
          >
            <img
              src={mentor.profilePic || `https://ui-avatars.com/?name=${mentor.user.name}`}
              alt="mentor"
              className="w-20 h-20 rounded-full mb-3"
            />
            <h3 className="text-xl font-semibold text-gray-800">{mentor.user.name}</h3>
            <p className="text-sm text-gray-600">{mentor.college} • {mentor.branch}</p>
            <p className="mt-2 text-gray-700 text-sm">{mentor.bio}</p>

            {/* Later: Add stars for rating */}
             <div className="mt-2 text-yellow-500">⭐⭐⭐⭐☆</div> 

            <button
              className="mt-4 bg-indigo-600 text-white px-4 py-2 rounded-full hover:bg-indigo-700 transition"
              onClick={() => alert("Send connection request functionality coming soon!")}
            >
              Connect
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MentorList;
