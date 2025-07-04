// client/src/components/Layout/Navbar.js
import React, { useEffect, useState } from "react";
import api from "../api";
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
    <nav className="fixed top-0 left-0 w-full bg-white/95 backdrop-blur-md px-4 sm:px-8 py-4 sm:py-5 flex justify-between items-center rounded-b-2xl shadow-xl border-b-2 border-gradient-to-r from-indigo-100 via-purple-100 to-blue-100 z-50">
      {/* Enhanced Background Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-indigo-50/50 via-white/80 to-purple-50/50 rounded-b-2xl"></div>
      
      {/* Brand/Portal Title with Logo and Creative Text */}
      <div
        className="relative z-10 flex items-center cursor-pointer transition-all duration-300 ease-in-out hover:scale-105 group"
        onClick={() => handleNavLinkClick("/dashboard")}
      >
        {/* Logo with enhanced styling */}
        <div className="relative mr-3 sm:mr-4">
          <img
            src={ConnectEDLogo}
            alt="ConnectED Logo"
            className="h-10 sm:h-12 w-auto drop-shadow-md group-hover:drop-shadow-lg transition-all duration-300"
          />
          {/* Subtle glow effect on hover */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-indigo-400/20 to-purple-400/20 blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </div>
        {/* Enhanced Website Name */}
        <div className="flex flex-col">
          <span className="text-2xl sm:text-3xl font-black tracking-tight leading-none">
            <span className="bg-gradient-to-r from-indigo-700 to-indigo-800 bg-clip-text text-transparent group-hover:from-indigo-600 group-hover:to-indigo-700 transition-all duration-300">Connect</span>
            <span className="bg-gradient-to-r from-purple-600 to-purple-700 bg-clip-text text-transparent group-hover:from-purple-500 group-hover:to-purple-600 transition-all duration-300">ED</span>
          </span>
          <div className="h-0.5 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
        </div>
      </div>

      {/* Enhanced Mobile Menu Button */}
      <div className="md:hidden flex items-center relative z-10">
        <button
          onClick={toggleMobileMenu}
          className="text-gray-700 hover:text-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-400 rounded-xl p-3 bg-white/80 hover:bg-white shadow-md hover:shadow-lg transition-all duration-300 backdrop-blur-sm border border-gray-200/50"
          aria-label="Toggle navigation menu"
        >
          <div className="relative w-6 h-6">
            {isMobileMenuOpen ? (
              <svg
                className="w-6 h-6 transform rotate-90 transition-transform duration-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2.5"
                  d="M6 18L18 6M6 6l12 12"
                ></path>
              </svg>
            ) : (
              <svg
                className="w-6 h-6 transition-transform duration-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2.5"
                  d="M4 6h16M4 12h16m-7 6h7"
                ></path>
              </svg>
            )}
          </div>
        </button>
      </div>

      {/* Enhanced Navigation Links and User Actions */}
      <div
        className={`fixed inset-x-0 top-20 bg-white/95 backdrop-blur-md shadow-2xl md:shadow-none border-t-2 border-gradient-to-r from-indigo-100 to-purple-100 md:relative md:top-0 md:border-t-0 md:flex md:items-center md:gap-8 md:bg-transparent md:backdrop-blur-none transition-all duration-500 ease-in-out transform ${
          isMobileMenuOpen ? "translate-y-0 opacity-100" : "-translate-y-4 opacity-0 pointer-events-none"
        } md:transform-none md:opacity-100 md:pointer-events-auto rounded-b-2xl md:rounded-none`}
      >
        <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-8 p-6 md:p-0">
          {/* Enhanced Dashboard Link */}
          <NavLink
            to="/dashboard"
            onClick={() => handleNavLinkClick("/dashboard")}
            className={({ isActive }) =>
              `group relative text-gray-700 hover:text-indigo-600 font-semibold px-4 py-3 md:py-2 rounded-xl transition-all duration-300 overflow-hidden ${
                isActive 
                  ? "bg-gradient-to-r from-indigo-50 to-purple-50 text-indigo-800 shadow-md border border-indigo-200/50" 
                  : "hover:bg-white/80 hover:shadow-md"
              }`
            }
          >
            <span className="relative z-10 flex items-center gap-2">
              <span className="text-lg">🏠</span>
              Dashboard
            </span>
            {/* Animated background on hover */}
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-100/50 to-purple-100/50 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left rounded-xl"></div>
          </NavLink>

          {/* Enhanced Notifications Link */}
          <NavLink
            to="/notifications"
            onClick={() => handleNavLinkClick("/notifications")}
            className={({ isActive }) =>
              `group relative text-gray-700 hover:text-indigo-600 font-semibold px-4 py-3 md:py-2 rounded-xl transition-all duration-300 overflow-hidden ${
                isActive 
                  ? "bg-gradient-to-r from-indigo-50 to-purple-50 text-indigo-800 shadow-md border border-indigo-200/50" 
                  : "hover:bg-white/80 hover:shadow-md"
              }`
            }
          >
            <span className="relative z-10 flex items-center gap-2">
              <span className="text-lg transform group-hover:scale-110 transition-transform duration-300">🔔</span>
              Notifications
            </span>
            {/* Enhanced Unread Count Badge */}
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-gradient-to-r from-red-500 to-red-600 text-white text-xs font-bold min-w-[20px] h-5 flex items-center justify-center rounded-full shadow-lg animate-pulse border-2 border-white">
                {unreadCount > 99 ? '99+' : unreadCount}
              </span>
            )}
            {/* Animated background on hover */}
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-100/50 to-purple-100/50 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left rounded-xl"></div>
          </NavLink>

          {/* Enhanced User Profile Section */}
          {user ? (
            <div
              onClick={() => { onProfileClick(); setIsMobileMenuOpen(false); }}
              className="group flex items-center gap-3 bg-gradient-to-r from-gray-50 to-gray-100 hover:from-indigo-50 hover:to-purple-50 px-4 py-3 md:py-2 rounded-xl cursor-pointer transition-all duration-300 ease-in-out shadow-md hover:shadow-lg border border-gray-200/50 hover:border-indigo-200/50 mt-2 md:mt-0"
            >
              <div className="relative">
                <img
                  src={user.profilePic || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name || 'User')}&background=E0E7FF&color=4338CA&size=40`}
                  alt="Profile"
                  className="w-9 h-9 rounded-full object-cover ring-2 ring-indigo-300/50 ring-offset-2 ring-offset-white group-hover:ring-indigo-400 transition-all duration-300"
                />
                {/* Online status indicator */}
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white shadow-sm"></div>
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-gray-800 group-hover:text-indigo-800 transition-colors duration-300 leading-tight">
                  {user.name}
                </span>
              </div>
              <div className="ml-1 text-gray-400 group-hover:text-indigo-500 transition-colors duration-300">
                <svg className="w-4 h-4 transform group-hover:translate-x-0.5 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                </svg>
              </div>
            </div>
          ) : (
            <div className="flex flex-col md:flex-row gap-3 md:gap-4 mt-4 md:mt-0">
              <NavLink
                to="/login"
                onClick={() => handleNavLinkClick("/login")}
                className={({ isActive }) =>
                  `group relative text-gray-700 hover:text-indigo-600 font-semibold px-5 py-3 md:py-2 rounded-xl transition-all duration-300 overflow-hidden ${
                    isActive 
                      ? "bg-gradient-to-r from-indigo-50 to-purple-50 text-indigo-800 shadow-md border border-indigo-200/50" 
                      : "hover:bg-white/80 hover:shadow-md border border-gray-200/50"
                  }`
                }
              >
                <span className="relative z-10">Login</span>
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-100/50 to-purple-100/50 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left rounded-xl"></div>
              </NavLink>
              <NavLink
                to="/register"
                onClick={() => handleNavLinkClick("/register")}
                className={({ isActive }) =>
                  `group relative bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold px-6 py-3 md:py-2 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 overflow-hidden ${
                    isActive ? "ring-2 ring-indigo-300 ring-offset-2 ring-offset-white" : ""
                  }`
                }
              >
                <span className="relative z-10 flex items-center gap-2">
                  <span>Register</span>
                  <span className="text-sm group-hover:translate-x-0.5 transition-transform duration-300">→</span>
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-white/5 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left rounded-xl"></div>
              </NavLink>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;