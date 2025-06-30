// client/src/components/Layout/Navbar.js
import React, { useEffect, useState } from "react";
import api from "../../api";
import { NavLink, useNavigate } from "react-router-dom";
import ConnectEDLogo from "../assets/logo.png"; 

const Navbar = ({ onProfileClick, user }) => {
  const [unreadCount, setUnreadCount] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const fetchUnreadCount = async () => {
    try {
      const token = localStorage.getItem("token");
      if (token) {
        const res = await api.get("/api/notifications/unread-count", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUnreadCount(res.data.count || 0);
      } else {
        setUnreadCount(0);
      }
    } catch (error) {
      console.error("Failed to fetch notification count:", error.message);
      if (error.response && error.response.status === 401) {
        setUnreadCount(0);
      }
    }
  };

  useEffect(() => {
    fetchUnreadCount();
    const interval = setInterval(fetchUnreadCount, 5000); // Poll every 5 seconds
    return () => clearInterval(interval);
  }, [user]);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleNavLinkClick = (path) => {
    navigate(path);
    setIsMobileMenuOpen(false); // Close mobile menu after clicking a link
  };

  return (
    <nav className="fixed top-0 left-0 w-full bg-white px-4 sm:px-6 py-3 sm:py-4 flex justify-between items-center rounded-b-xl shadow-lg border-b border-gray-100 z-50">
      {/* Brand/Portal Title with Logo and Creative Text */}
      <div
        className="flex items-center cursor-pointer transition-transform duration-300 ease-in-out hover:scale-105"
        onClick={() => handleNavLinkClick("/dashboard")}
      >
        {/* Logo */}
        <img
          src={ConnectEDLogo}
          alt="ConnectED Logo"
          className="h-8 sm:h-9 w-auto mr-2 sm:mr-3" // Adjust height as needed
        />
        {/* Creative Website Name */}
        <span className="text-xl sm:text-2xl font-extrabold tracking-tight">
          <span className="text-indigo-700">Connect</span>
          <span className="text-purple-600">ED</span>
        </span>
      </div>

      {/* Mobile Menu Button (Hamburger) */}
      <div className="md:hidden flex items-center">
        <button
          onClick={toggleMobileMenu}
          className="text-gray-700 hover:text-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded-md p-2"
          aria-label="Toggle navigation menu"
        >
          {isMobileMenuOpen ? (
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              ></path>
            </svg>
          ) : (
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16m-7 6h7"
              ></path>
            </svg>
          )}
        </button>
      </div>

      {/* Navigation Links and User Actions (Desktop and Mobile) */}
      <div
        className={`fixed inset-x-0 top-16 bg-white shadow-lg md:shadow-none border-t border-gray-100 md:relative md:top-0 md:border-t-0 md:flex md:items-center md:gap-6 transition-all duration-300 ease-in-out ${
          isMobileMenuOpen ? "block" : "hidden"
        } md:block`}
      >
        <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-6 p-4 md:p-0">
          {/* Dashboard Link */}
          <NavLink
            to="/dashboard"
            onClick={() => handleNavLinkClick("/dashboard")}
            className={({ isActive }) =>
              `text-gray-700 hover:text-indigo-600 font-medium px-3 py-2 rounded-lg transition-colors duration-200 ${
                isActive ? "bg-indigo-50 text-indigo-800 font-semibold shadow-sm" : ""
              }`
            }
          >
            Dashboard
          </NavLink>

          {/* Notifications Link */}
          <NavLink
            to="/notifications"
            onClick={() => handleNavLinkClick("/notifications")}
            className={({ isActive }) =>
              `relative text-gray-700 hover:text-indigo-600 font-medium px-3 py-2 rounded-lg transition-colors duration-200 ${
                isActive ? "bg-indigo-50 text-indigo-800 font-semibold shadow-sm" : ""
              }`
            }
          >
            <span className="flex items-center gap-1">
              <span className="text-xl">🔔</span> Notifications
            </span>
            {/* Unread Count Badge */}
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-2 bg-red-500 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full shadow-md animate-bounce-once">
                {unreadCount}
              </span>
            )}
          </NavLink>

          {/* User Profile Link (Conditionally Rendered) */}
          {user ? (
            <div
              onClick={() => { onProfileClick(); setIsMobileMenuOpen(false); }}
              className="flex items-center gap-2 bg-gray-50 hover:bg-gray-100 px-3 py-1.5 rounded-full cursor-pointer transition-all duration-200 ease-in-out shadow-sm border border-gray-100 mt-2 md:mt-0"
            >
              <img
                src={user.profilePic || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name || 'User')}&background=E0E7FF&color=4338CA&size=32`}
                alt="Profile"
                className="w-8 h-8 rounded-full object-cover ring-1 ring-indigo-300 ring-offset-1"
              />
              <span className="text-sm font-medium text-gray-800">{user.name}</span>
            </div>
          ) : (
            <div className="flex flex-col md:flex-row gap-2 md:gap-4 mt-2 md:mt-0">
              <NavLink
                to="/login"
                onClick={() => handleNavLinkClick("/login")}
                className={({ isActive }) =>
                  `text-gray-700 hover:text-indigo-600 font-medium px-3 py-2 rounded-lg transition-colors duration-200 ${
                    isActive ? "bg-indigo-50 text-indigo-800 font-semibold shadow-sm" : ""
                  }`
                }
              >
                Login
              </NavLink>
              <NavLink
                to="/register"
                onClick={() => handleNavLinkClick("/register")}
                className={({ isActive }) =>
                  `text-indigo-600 bg-indigo-50 px-5 py-2 rounded-full hover:bg-indigo-100 transition duration-300 ease-in-out shadow-sm ${
                    isActive ? "bg-indigo-100 ring-2 ring-indigo-300" : ""
                  }`
                }
              >
                Register
              </NavLink>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;