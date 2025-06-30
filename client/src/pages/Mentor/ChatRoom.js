import React, { useEffect, useState, useRef } from "react";
import io from "socket.io-client";
import axios from "axios";
import { toast } from "react-toastify";

const socket = io("http://localhost:5000"); 

const ChatRoom = ({ user, onBackToUsers }) => {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [partnerTyping, setPartnerTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const currentUser = JSON.parse(localStorage.getItem("user"));
  const TYPING_TIMEOUT = 1000;
  const typingTimeout = useRef(null);

  useEffect(() => {
    if (!user || !currentUser) return;

    socket.emit("register", currentUser._id);

    const fetchMessages = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`/api/messages/${user._id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMessages(res.data);
      } catch (err) {
        console.error("Failed to load messages", err);
      }
    };

    fetchMessages();

    socket.on("receiveMessage", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    socket.on("typing", ({ senderId }) => {
      if (senderId === user._id) setPartnerTyping(true);
    });

    socket.on("stopTyping", ({ senderId }) => {
      if (senderId === user._id) setPartnerTyping(false);
    });

    return () => {
      socket.off("receiveMessage");
      socket.off("typing");
      socket.off("stopTyping");
    };
  }, [user]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleTyping = (e) => {
    setText(e.target.value);

    socket.emit("typing", {
      senderId: currentUser._id,
      receiverId: user._id,
    });

    if (typingTimeout.current) clearTimeout(typingTimeout.current);

    typingTimeout.current = setTimeout(() => {
      socket.emit("stopTyping", {
        senderId: currentUser._id,
        receiverId: user._id,
      });
    }, TYPING_TIMEOUT);
  };

  const sendMessage = () => {
    if (!text.trim()) return;

    const message = {
      senderId: currentUser._id,
      receiverId: user._id,
      message: text,
    };

    socket.emit("sendMessage", message);
    setText("");
    // Immediately clear typing timeout on send
    if (typingTimeout.current) clearTimeout(typingTimeout.current);
    socket.emit("stopTyping", {
      senderId: currentUser._id,
      receiverId: user._id,
    });
  };

  const handleDeleteMessage = async (messageId) => {
    // Optional: Add a confirmation dialog here for better UX
    // if (window.confirm("Are you sure you want to delete this message?")) {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `/api/messages/delete/${messageId}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setMessages((prev) =>
        prev.map((m) =>
          m._id === messageId ? { ...m, deleted: true, content: "[Message deleted]" } : m // Changed content to show a clear message
        )
      );
      toast.success("Message deleted!"); // Use toast for feedback
    } catch (err) {
      console.error("Delete failed:", err);
      toast.error("Failed to delete message.");
    }
    // }
  };

  return (
    <div className="flex flex-col h-full bg-gray-50 md:rounded-lg md:shadow-lg">
      {/* Chat Header */}
      <div className="p-4 border-b border-gray-200 bg-white shadow-sm md:rounded-t-lg flex items-center">
        <button
          onClick={onBackToUsers}
          className="mr-3 p-2 rounded-full hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-200 ease-in-out"
          aria-label="Back to connected users"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-gray-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
        </button>
        <h2 className="text-lg font-semibold text-gray-800 md:text-xl truncate">
          {user.name}
        </h2>
      </div>

      {/* Message List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 md:p-6">
        {messages.map((msg, idx) => (
          <div
            key={msg._id || idx}
            className={`flex ${
              msg.sender === currentUser._id ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`relative max-w-[80%] sm:max-w-xs px-4 py-2 rounded-xl text-sm shadow-md group ${ // Added 'group' class here
                msg.sender === currentUser._id
                  ? "bg-indigo-600 text-white"
                  : "bg-gray-200 text-gray-800"
              }`}
              // Removed onContextMenu here
            >
              {msg.deleted ? (
                <span className="text-xs italic text-gray-400">
                  <i className="fas fa-trash-alt mr-1"></i>Message deleted
                </span>
              ) : (
                <>
                  {msg.content}
                  {/* Delete button appears only for current user's messages on hover/focus */}
                  {msg.sender === currentUser._id && !msg.deleted && (
                    <button
                      onClick={() => handleDeleteMessage(msg._id)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 text-xs opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity duration-200 ease-in-out"
                      aria-label="Delete message"
                      title="Delete message"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm6 0a1 1 0 11-2 0v6a1 1 0 112 0V8z" clipRule="evenodd" />
                      </svg>
                    </button>
                  )}
                </>
              )}
            </div>
          </div>
        ))}

        {partnerTyping && (
          <div className="flex justify-start">
            <div className="text-xs text-gray-500 bg-gray-100 px-3 py-1 rounded-full animate-pulse">
              Typing<span>.</span><span>.</span><span>.</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Box */}
      <div className="flex p-4 border-t border-gray-200 bg-white md:p-6 md:rounded-b-lg">
        <input
          value={text}
          onChange={handleTyping}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          className="flex-1 border border-gray-300 rounded-l-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200 ease-in-out text-sm md:text-base"
          placeholder="Type a message..."
        />
        <button
          onClick={sendMessage}
          disabled={!text.trim()}
          className={`bg-indigo-600 text-white px-5 py-2 rounded-r-full ml-1 flex items-center justify-center transition duration-200 ease-in-out ${
            !text.trim() ? "opacity-50 cursor-not-allowed" : "hover:bg-indigo-700"
          }`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M14 5l7 7m0 0l-7 7m7-7H3"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default ChatRoom;