import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api";

const MentorshipHub = () => {
  const [isMentor, setIsMentor] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const checkMentorStatus = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.warn("No token found, user might not be logged in.");
        setLoading(false);
        return;
      }
      const res = await api.get("/mentors/check", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setIsMentor(res.data.isMentor);
    } catch (err) {
      console.error("Error checking mentor status:", err);
      if (err.response && err.response.status === 401) {
        navigate("/login");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkMentorStatus();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <p className="text-xl text-gray-500 animate-pulse">
          Loading Mentorship Hub...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl w-full bg-white rounded-2xl shadow-xl p-8 sm:p-10">
        <h2 className="text-4xl font-extrabold text-gray-800 mb-10 text-center flex items-center justify-center gap-4">
          <span className="text-indigo-500 text-5xl">🎓</span> Mentorship Hub
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {!isMentor && (
            <button
              onClick={() => navigate("/mentorship/list")}
              className="flex flex-col items-center justify-center bg-blue-50 hover:bg-blue-100 text-blue-700 p-6 rounded-xl shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-300 ease-in-out text-center border border-blue-200"
            >
              <span className="text-5xl mb-3">🧑‍🏫</span>
              <span className="text-xl font-semibold mb-1">View Mentors</span>
              <p className="text-sm text-blue-600 opacity-90">
                Discover and connect with experienced mentors
              </p>
            </button>
          )}

          <button
            onClick={() => navigate("/chat")}
            className="flex flex-col items-center justify-center bg-green-50 hover:bg-green-100 text-green-700 p-6 rounded-xl shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-300 ease-in-out text-center border border-green-200"
          >
            <span className="text-5xl mb-3">💬</span>
            <span className="text-xl font-semibold mb-1">Chat</span>
            <p className="text-sm text-green-600 opacity-90">
              Communicate with your connected mentor or student
            </p>
          </button>

          {isMentor && (
            <>
              <button
                onClick={() => navigate("/mentor/requests")}
                className="flex flex-col items-center justify-center bg-purple-50 hover:bg-purple-100 text-purple-700 p-6 rounded-xl shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-300 ease-in-out text-center border border-purple-200"
              >
                <span className="text-5xl mb-3">📥</span>
                <span className="text-xl font-semibold mb-1">
                  View Requests
                </span>
                <p className="text-sm text-purple-600 opacity-90">
                  Review and manage incoming connection requests
                </p>
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default MentorshipHub;
