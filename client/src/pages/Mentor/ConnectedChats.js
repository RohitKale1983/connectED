import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import ChatRoom from "./ChatRoom"; // Assuming ChatRoom can accept an onBackToUsers prop
import { useNavigate } from "react-router-dom";

const ConnectedChats = () => {
  const [connectedUsers, setConnectedUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [loadingUsers, setLoadingUsers] = useState(true);
  // New state to control visibility of chat vs. user list on small screens
  const [showChatRoomMobile, setShowChatRoomMobile] = useState(false);
  const navigate = useNavigate();

  const fetchConnectedUsers = async () => {
    setLoadingUsers(true); // Set loading true before fetching
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("/api/mentors/connected", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setConnectedUsers(res.data);
    } catch (err) {
      toast.error("Failed to load connected users");
      console.error("Fetch connected users error:", err);
    } finally {
      setLoadingUsers(false); // Set loading false after fetching
    }
  };

  useEffect(() => {
    fetchConnectedUsers();
  }, []);

  // Handler for selecting a user and showing chat on mobile
  const handleUserSelect = (user) => {
    setSelectedUser(user);
    // On small screens, hide the user list and show the chat room
    if (window.innerWidth < 768) { // Assuming md breakpoint is 768px
      setShowChatRoomMobile(true);
    }
  };

  // Handler for going back to user list from chat room on mobile
  const handleBackToUsers = () => {
    setSelectedUser(null);
    setShowChatRoomMobile(false);
  };

  return (
    <div className="flex h-screen bg-gray-100 font-sans antialiased">
      {/* Sidebar - list of connected users */}
      {/*
        On small screens:
        - If showChatRoomMobile is true, hide this sidebar.
        - If showChatRoomMobile is false, show this sidebar (takes full width).
        On medium screens and up (md:):
        - Always show this sidebar (takes 1/3, 1/4, or 1/5 width).
      */}
      <div
        className={`w-full md:w-1/3 lg:w-1/4 xl:w-1/5 bg-white border-r border-gray-200 shadow-lg flex flex-col ${
          showChatRoomMobile ? "hidden md:flex" : "flex"
        }`}
      >
        <div className="p-4 border-b border-gray-200 flex items-center">
          <button
            onClick={() => navigate(-1)} // Navigates back in browser history
            className="text-gray-600 hover:text-gray-800 transition duration-300 ease-in-out flex items-center mr-3 p-1 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-300"
            aria-label="Go back"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6" // Slightly larger icon
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
            <span className="font-medium hidden sm:inline">Back</span> {/* Hide text on very small screens */}
          </button>
          <h2 className="text-2xl font-bold text-gray-800 flex-1">Connected Users</h2>
        </div>
        <div className="flex-1 overflow-y-auto py-2">
          {loadingUsers ? (
            <div className="flex justify-center items-center h-full text-gray-500">
              <svg
                className="animate-spin -ml-1 mr-3 h-6 w-6 text-indigo-500" // Changed color for spinner
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
              Loading users...
            </div>
          ) : connectedUsers.length === 0 ? (
            <p className="text-gray-500 text-center py-4 px-4">
              No connected users found. Start by requesting a mentor connection!
            </p>
          ) : (
            connectedUsers.map((user) => (
              <div
                key={user._id}
                onClick={() => handleUserSelect(user)}
                className={`flex items-center gap-4 p-3 mx-2 my-1 rounded-lg cursor-pointer transition-colors duration-200 ease-in-out group
                  ${
                    selectedUser && selectedUser._id === user._id
                      ? "bg-indigo-100 text-indigo-800 shadow-md border border-indigo-200"
                      : "hover:bg-gray-100 text-gray-700"
                  }`}
              >
                <img
                  src={
                    user.profilePic ||
                    `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=E0E7FF&color=4338CA&size=48` // More consistent colors
                  }
                  className="w-12 h-12 rounded-full object-cover border-2 border-transparent group-hover:border-indigo-400 transition-colors duration-200"
                  alt={`${user.name}'s avatar`}
                />
                <span className="font-medium text-lg truncate">
                  {user.name}
                </span>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Chat area */}
      {/*
        On small screens:
        - If showChatRoomMobile is true AND a user is selected, show this chat area (takes full width).
        - Otherwise, hide this chat area.
        On medium screens and up (md:):
        - Always show this chat area (takes remaining width).
      */}
      <div
        className={`flex-1 flex flex-col bg-white rounded-lg shadow-xl m-4 overflow-hidden ${
          selectedUser && (showChatRoomMobile || window.innerWidth >= 768)
            ? "flex"
            : "hidden md:flex"
        }`}
      >
        {selectedUser ? (
          // Pass the handleBackToUsers function to ChatRoom for mobile navigation
          <ChatRoom user={selectedUser} onBackToUsers={handleBackToUsers} />
        ) : (
          <div className="flex-1 flex flex-col justify-center items-center text-gray-500 p-8">
            <svg
              className="w-24 h-24 mb-4 text-gray-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.5"
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              ></path>
            </svg>
            <p className="text-xl font-medium mb-2">Start a conversation</p>
            <p className="text-center text-sm max-w-xs">
              Select a user from the left sidebar to begin chatting.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ConnectedChats;