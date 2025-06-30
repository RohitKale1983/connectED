import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showErrorAlert, setShowErrorAlert] = useState(false);
  const navigate = useNavigate();

  /** ------------------ API helpers ------------------ */
  const token = localStorage.getItem("token");
  const headers = { Authorization: `Bearer ${token}` };

  /* Get all notifications */
  const fetchNotifications = async () => {
    setLoading(true);
    setError(null);
    setShowErrorAlert(false);
    try {
      const res = await axios.get("/api/notifications", { headers });
      setNotifications(res.data);
    } catch (err) {
      console.error("Error fetching notifications:", err);
      setError("Failed to fetch notifications. Please try again.");
      setShowErrorAlert(true);
      toast.error("Failed to fetch notifications.");
    } finally {
      setLoading(false);
    }
  };

  /* Mark every notification as read */
  const markAllAsRead = async () => {
    try {
      await axios.put("/api/notifications/mark-all-read", {}, { headers });
      await fetchNotifications();
      toast.success("All notifications marked as read!");
    } catch (err) {
      console.error("Error marking as read:", err);
      toast.error("Failed to mark all as read.");
    }
  };

  /** 💡 New Function: Mark a single notification as read */
  const markNotificationAsRead = async (notificationId) => {
    try {
      await axios.patch(`/api/notifications/${notificationId}/read`, {}, { headers });
      setNotifications((prevNotifications) =>
        prevNotifications.map((n) =>
          n._id === notificationId ? { ...n, isRead: true } : n
        )
      );
    } catch (err) {
      console.error(`Error marking notification ${notificationId} as read:`, err);
      toast.error("Failed to mark notification as read.");
    }
  };

  /* Delete only the read notifications */
  const clearReadNotifications = async () => {
    if (
      !window.confirm("Are you sure you want to clear all read notifications?")
    ) {
      return;
    }
    try {
      await axios.delete("/api/notifications/clear-read", { headers });
      await fetchNotifications();
      toast.success("Read notifications cleared!");
    } catch (err) {
      console.error("Error clearing read notifications:", err);
      toast.error("Failed to clear read notifications.");
    }
  };

  /** ------------------ lifecycle ------------------ */
  useEffect(() => {
    fetchNotifications();
  }, []);

  // Determine button disabled states
  const hasUnread = notifications.some((n) => !n.isRead);
  const hasRead = notifications.some((n) => n.isRead);

  /** ------------------ UI ------------------ */
  return (
    <div className="max-w-4xl mx-auto p-6 bg-gradient-to-br from-gray-50 to-white min-h-screen shadow-lg rounded-lg my-8">
      {/* Back link and title */}
      <div className="flex items-center mb-8 border-b pb-4 border-gray-200">
        <button
          onClick={() => navigate("/dashboard")}
          className="text-gray-600 hover:text-indigo-600 transition duration-300 ease-in-out flex items-center mr-4"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 mr-1"
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
          <span className="font-medium text-lg">Back</span>
        </button>
        <h2 className="text-4xl font-extrabold text-gray-900 flex-grow">
          Your Notifications
        </h2>
      </div>

      {/* Action buttons */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <button
          onClick={markAllAsRead}
          disabled={!hasUnread || loading}
          className={`flex-1 text-white px-6 py-3 rounded-xl shadow-md font-semibold transition duration-300 ease-in-out transform hover:scale-105 ${
            !hasUnread || loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-75"
          }`}
        >
          <div className="flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            Mark All as Read
          </div>
        </button>
        <button
          onClick={clearReadNotifications}
          disabled={!hasRead || loading}
          className={`flex-1 text-white px-6 py-3 rounded-xl shadow-md font-semibold transition duration-300 ease-in-out transform hover:scale-105 ${
            !hasRead || loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-75"
          }`}
        >
          <div className="flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm6 0a1 1 0 11-2 0v6a1 1 0 112 0V8z"
                clipRule="evenodd"
              />
            </svg>
            Clear Read Notifications
          </div>
        </button>
      </div>

      {/* Loading, Error, and List states */}
      {loading ? (
        <div className="text-center py-12 bg-white rounded-lg shadow-inner">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-500 mx-auto"></div>
          <p className="text-gray-600 mt-6 text-lg">Loading notifications...</p>
        </div>
      ) : error && showErrorAlert ? (
        <div
          className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-lg relative shadow-md"
          role="alert"
        >
          <strong className="font-bold text-xl">Error!</strong>
          <span className="block sm:inline ml-3 text-lg">{error}</span>
          <span
            className="absolute top-0 bottom-0 right-0 px-4 py-3 cursor-pointer"
            onClick={() => setShowErrorAlert(false)}
          >
            <svg
              className="fill-current h-7 w-7 text-red-500 hover:text-red-700"
              role="button"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
            >
              <title>Close</title>
              <path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z" />
            </svg>
          </span>
        </div>
      ) : notifications.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow-inner">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="w-20 h-20 text-gray-400 mx-auto mb-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.08 0 01-2.454 2.67M14.857 17.082a23.848 23.848 0 01-5.454 0M14.857 17.082c-.18.11-.37.21-.57.31-.22.2-.45.39-.69.58-.23.19-.47.37-.72.54a.72.72 0 01-.8.04 1.137 1.137 0 01-.4-.2A24.78 24.78 0 011.5 10.582m13.357 6.5A.75.75 0 0015 16.5H8.25c-.207 0-.399-.079-.548-.205L7.042 15.65M13.5 12.75l-.57.324M12 14.25l.23-.21V13.5m0 0l-1.5-.75L9 12.75m1.5-.75L12 11.25m0 0l-1.5-.75M12 14.25V13.5m0 0l-1.5-.75L9 12.75M13.5 12.75l-.57.324M12 14.25l.23-.21V13.5"
            />
          </svg>
          <p className="text-gray-600 italic text-center py-2 text-xl">
            No notifications found. You're all caught up!
          </p>
        </div>
      ) : (
        <ul className="space-y-4">
          {notifications.map((n) => (
            <li
              key={n._id}
              onClick={() => !n.isRead && markNotificationAsRead(n._id)}
              className={`p-6 border rounded-xl shadow-sm transition duration-300 ease-in-out cursor-pointer flex flex-col sm:flex-row justify-between items-start sm:items-center ${
                n.isRead
                  ? "bg-white text-gray-700 border-gray-200 hover:shadow-md"
                  : "bg-yellow-50 text-gray-900 border-yellow-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              }`}
            >
              <div className="flex-grow mb-3 sm:mb-0">
                <p className="font-semibold text-xl leading-snug">
                  {n.type === "message" ? (
                    <>
                      <span role="img" aria-label="message">💬</span>{" "}
                      {n.data?.senderId?.name
                        ? `${n.data.senderId.name} sent you a message.`
                        : "Someone sent you a message."}
                    </>
                  ) : n.type === "postReply" ? (
                    <>
                      <span role="img" aria-label="reply">📝</span>{" "}
                      {n.data?.replierId?.name
                        ? `${n.data.replierId.name} replied to your post.`
                        : "Someone replied to your post."}
                    </>
                  ) : n.type === "connectionRequest" ? (
                    <>
                      <span role="img" aria-label="connection request">🤝</span>{" "}
                      {n.data?.senderId?.name
                        ? `${n.data.senderId.name} sent you a connection request.`
                        : "Someone sent you a connection request."}
                    </>
                  ) : n.type === "connectionAccepted" ? (
                    <>
                      <span role="img" aria-label="connection accepted">✅</span>{" "}
                      {n.data?.acceptorId?.name
                        ? `${n.data.acceptorId.name} accepted your connection request.`
                        : "A mentor accepted your connection request."}
                    </>
                  ) : n.type === "connectionRejected" ? (
                    <>
                      <span role="img" aria-label="connection rejected">❌</span>{" "}
                      {n.data?.rejectorId?.name
                        ? `${n.data.rejectorId.name} rejected your connection request.`
                        : "A mentor rejected your connection request."}
                    </>
                  ) : (
                    <>
                      <span
                        role="img"
                        aria-label="notification-icon"
                        className="mr-1"
                      >
                        🔔
                      </span>{" "}
                      {n.message || "New notification."}
                    </>
                  )}
                </p>
                <p
                  className={`text-sm mt-1 ${
                    n.isRead ? "text-gray-500" : "text-yellow-700 font-medium"
                  }`}
                >
                  {new Date(n.createdAt).toLocaleString()}
                </p>
              </div>

              {/* Conditional buttons for actions */}
              <div className="flex-shrink-0 flex gap-3 mt-3 sm:mt-0 sm:ml-4">
                {n.type === "message" && n.data?.senderId && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate("/chat", {
                        state: { partnerId: n.data.senderId._id },
                      });
                    }}
                    className="text-sm bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition duration-300 ease-in-out flex items-center shadow-md hover:shadow-lg"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 mr-1"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5z" />
                      <path d="M15 7v2a4 4 0 01-4 4H9.828l-1.586 1.586A2 2 0 015.414 17H4a2 2 0 00-2 2v1a2 2 0 002 2h12a2 2 0 002-2V9a2 2 0 00-2-2h-3z" />
                    </svg>
                    Go to Chat
                  </button>
                )}

                {n.type === "connectionRequest" && n.data?.senderId && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate("/mentor/requests");
                    }}
                    className="text-sm bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-300 ease-in-out flex items-center shadow-md hover:shadow-lg"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="currentColor"
                      className="h-4 w-4 mr-1"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
                      />
                    </svg>
                    View Request
                  </button>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Notifications;