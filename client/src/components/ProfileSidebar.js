import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const ProfileSidebar = ({ isOpen, onClose, user }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    toast.success("Logged out successfully!");
    onClose(); 
    navigate("/login"); 
  };

  const sidebarClasses = `
    fixed 
    top-16 
    right-0 
    h-[calc(100vh-4rem)] 
    w-72 md:w-80 
    bg-gradient-to-br from-white via-gray-50 to-indigo-50
    backdrop-blur-sm
    shadow-2xl transform transition-all duration-300 ease-out
    z-30 border-l border-gray-200/50
    ${isOpen ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}
  `;

  const overlayClasses = `
    fixed inset-0 bg-gradient-to-br from-black/40 via-black/50 to-black/60 
    backdrop-blur-[2px] z-20
    transition-all duration-300 ease-out
    ${isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}
  `;

  if (!isOpen && !user) return null; 

  return (
    <>
      {/* Enhanced Overlay */}
      <div className={overlayClasses} onClick={onClose}></div>

      {/* Polished Sidebar */}
      <div className={sidebarClasses}>
        <div className="p-6 flex flex-col h-full overflow-y-auto scrollbar-hide">
          {/* Refined Close Button */}
          <button
            onClick={onClose}
            className="absolute top-8 left-4 text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2 rounded-full p-2 transition-all duration-200 hover:bg-white/80 hover:shadow-md"
            aria-label="Close sidebar"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2.5"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Enhanced User Profile Section */}
          <div className="flex flex-col items-center mt-12 mb-8">
            <div className="relative mb-4">
              <img
                src={user?.profilePic || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'User')}&background=6366F1&color=FFFFFF&size=96`}
                alt="Profile"
                className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-xl ring-4 ring-indigo-100/50"
              />
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-400 rounded-full border-2 border-white shadow-sm"></div>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-1 tracking-tight">
              {user?.name || "Guest User"}
            </h3>
            {user?.email && (
              <p className="text-sm text-gray-600 font-medium opacity-80">
                {user.email}
              </p>
            )}
          </div>

          {/* Enhanced Navigation Links */}
          <nav className="flex-grow flex flex-col space-y-2">
            <Link
              to="/profile/view"
              onClick={onClose}
              className="group flex items-center gap-3 px-4 py-3 rounded-xl text-gray-700 hover:bg-white/80 hover:text-indigo-700 hover:shadow-md transition-all duration-200 font-medium border border-transparent hover:border-indigo-100"
            >
              <div className="p-1 rounded-lg bg-indigo-50 group-hover:bg-indigo-100 transition-colors duration-200">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              View Profile
            </Link>
            
            <Link
              to="/profile/edit"
              onClick={onClose}
              className="group flex items-center gap-3 px-4 py-3 rounded-xl text-gray-700 hover:bg-white/80 hover:text-indigo-700 hover:shadow-md transition-all duration-200 font-medium border border-transparent hover:border-indigo-100"
            >
              <div className="p-1 rounded-lg bg-indigo-50 group-hover:bg-indigo-100 transition-colors duration-200">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </div>
              Edit Profile
            </Link>
            
            <Link
              to="/profile/become-mentor"
              onClick={onClose}
              className="group flex items-center gap-3 px-4 py-3 rounded-xl text-gray-700 hover:bg-white/80 hover:text-indigo-700 hover:shadow-md transition-all duration-200 font-medium border border-transparent hover:border-indigo-100"
            >
              <div className="p-1 rounded-lg bg-indigo-50 group-hover:bg-indigo-100 transition-colors duration-200">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 13.255A23.55 23.55 0 0112 15c-1.662 0-3.32-.11-4.943-.325M21 12c0 2.895-1.145 5.568-3 7.425M12 21c4.418 0 8-3.582 8-8s-3.582-8-8-8-8 3.582-8 8 3.582 8 8 8zM15 9a3 3 0 11-6 0 3 3 0 016 0zm3 0h.01M6 9h.01" />
                </svg>
              </div>
              Become a Mentor
            </Link>
          </nav>

          {/* Enhanced Logout Button */}
          <button
            onClick={handleLogout}
            className="flex items-center justify-center gap-3 mt-8 bg-gradient-to-r from-red-500 to-red-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-red-600 hover:to-red-700 hover:shadow-lg hover:shadow-red-500/25 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-gray-50 transform hover:scale-[1.02] active:scale-[0.98]"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Logout
          </button>
        </div>
      </div>
    </>
  );
};

export default ProfileSidebar;