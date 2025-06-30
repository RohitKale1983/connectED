import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const ConnectionRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchRequests = async () => {
    setLoading(true); // Ensure loading is true right at the start of fetch
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("/api/mentors/requests", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setRequests(res.data);
    } catch (err) {
      toast.error("Failed to load requests");
      toast.error("Oops! Something went wrong while loading requests. Please try refreshing."); // More user-friendly error
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleAction = async (id, action) => {
    try {
      const token = localStorage.getItem("token");
      await axios.patch(
        `/api/mentors/request/${id}/${action}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success(`Request ${action}ed successfully!`); // More enthusiastic message
      fetchRequests(); // Re-fetch requests to update the UI
    } catch (err) {
      toast.error("Action failed. Please try again."); // More specific error
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6 sm:p-8 md:p-10 font-sans antialiased">
      <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-xl p-6 sm:p-8 md:p-10 border border-gray-100">
        {/* Back Button and Title */}
        <div className="flex items-center mb-8 border-b pb-4 border-gray-200">
          <button
            onClick={() => navigate(-1)}
            className="text-gray-600 hover:text-indigo-700 transition duration-300 ease-in-out flex items-center mr-4 group"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 mr-1 group-hover:-translate-x-1 transition-transform"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            <span className="font-semibold text-lg">Back</span>
          </button>
          <h2 className="text-4xl font-extrabold text-gray-900 flex-grow text-center sm:text-left">
            Incoming Connection Requests
          </h2>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="flex flex-col justify-center items-center h-64 bg-gray-50 rounded-lg shadow-inner">
            <svg
              className="animate-spin h-12 w-12 text-indigo-600 mb-4"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            <p className="text-xl text-gray-700 font-medium">Fetching requests...</p>
            <p className="text-sm text-gray-500 mt-1">Please wait a moment.</p>
          </div>
        ) : requests.length === 0 ? (
          // No Requests State
          <div className="text-center py-16 bg-gray-50 rounded-lg shadow-inner">
            <svg
              className="mx-auto h-24 w-24 text-gray-400 mb-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.5"
                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
              ></path>
            </svg>
            <p className="mt-4 text-2xl font-bold text-gray-700">
              No Pending Requests
            </p>
            <p className="mt-2 text-gray-500 text-lg">
              You're all caught up! Check back later for new connection requests.
            </p>
          </div>
        ) : (
          // List of Requests
          <div className="space-y-6">
            {requests.map((req) => (
              <div
                key={req._id}
                className="bg-white border border-gray-200 shadow-md p-6 rounded-xl flex flex-col sm:flex-row items-center justify-between transition-all duration-300 ease-in-out hover:shadow-lg hover:border-indigo-300 transform hover:-translate-y-1"
              >
                <div className="flex items-center gap-4 mb-4 sm:mb-0 w-full sm:w-auto">
                  <div className="relative">
                    <img
                      src={
                        req.sender.profilePic ||
                        `https://ui-avatars.com/api/?name=${req.sender.name}&background=6366F1&color=fff&size=60&font-size=0.33` // Custom background color for avatars
                      }
                      className="w-16 h-16 rounded-full object-cover border-3 border-indigo-500 shadow-sm" // Increased border width, added shadow
                      alt={req.sender.name}
                    />
                    {req.status === "pending" && (
                      <span className="absolute top-0 right-0 block h-4 w-4 rounded-full ring-2 ring-white bg-yellow-400"></span> // Indicator for pending
                    )}
                  </div>
                  <div>
                    <p className="font-extrabold text-xl text-gray-900 leading-tight">
                      {req.sender.name}
                    </p>
                    <p className="text-sm text-gray-600">
                      {req.sender.email}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      Requested: {new Date(req.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto mt-4 sm:mt-0">
                  {req.status === "pending" ? (
                    <>
                      <button
                        onClick={() => handleAction(req._id, "accept")}
                        className="w-full sm:w-auto bg-green-600 text-white px-6 py-2.5 rounded-full font-bold hover:bg-green-700 focus:outline-none focus:ring-3 focus:ring-green-400 focus:ring-opacity-75 transition-all duration-200 ease-in-out transform hover:scale-105 shadow-md" // Enhanced button styles
                      >
                        Accept
                      </button>
                      <button
                        onClick={() => handleAction(req._id, "reject")}
                        className="w-full sm:w-auto bg-red-600 text-white px-6 py-2.5 rounded-full font-bold hover:bg-red-700 focus:outline-none focus:ring-3 focus:ring-red-400 focus:ring-opacity-75 transition-all duration-200 ease-in-out transform hover:scale-105 shadow-md" // Enhanced button styles
                      >
                        Reject
                      </button>
                    </>
                  ) : (
                    <span
                      className={`text-base font-bold capitalize px-5 py-2 rounded-full shadow-sm ${
                        req.status === "accepted"
                          ? "bg-green-100 text-green-700 border border-green-200"
                          : "bg-red-100 text-red-700 border border-red-200"
                      }`} // More prominent status badge
                    >
                      {req.status}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ConnectionRequests;