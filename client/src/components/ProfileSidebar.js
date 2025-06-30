import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify'; // Assuming toast is available globally or passed down

const ProfileSidebar = ({ isOpen, onClose, user }) => {
  const navigate = useNavigate();

  // Handle user logout (can reuse the one from Navbar or have a centralized one)
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    // You might want to trigger a global auth context update here if you have one
    toast.success("Logged out successfully!");
    onClose(); // Close the sidebar
    navigate("/"); // Redirect to home or login page
  };

  // Tailwind classes for animation and positioning
  const sidebarClasses = `
    fixed /* Stays fixed in the viewport */
    top-16 /* Starts 4rem (64px) from the top, pushing it below the Navbar */
    right-0 /* Aligns to the right edge of the screen */
    h-[calc(100vh-4rem)] /* Calculates height: full viewport height minus Navbar height */
    w-64 md:w-80 bg-white
    shadow-2xl transform transition-transform duration-300 ease-in-out
    z-50 border-l border-gray-200
    ${isOpen ? 'translate-x-0' : 'translate-x-full'} /* Slide in/out animation */
  `;

  const overlayClasses = `
    fixed inset-0 bg-black bg-opacity-50 z-40
    transition-opacity duration-300 ease-in-out
    ${isOpen ? 'opacity-100 block' : 'opacity-0 hidden'}
  `;

  // Only render if it's open or has user data (for initial render without flashing)
  if (!isOpen && !user) return null; 

  return (
    <>
      {/* Overlay: Darkens background and closes sidebar on click outside */}
      <div className={overlayClasses} onClick={onClose}></div>

      {/* Sidebar Content */}
      <div className={sidebarClasses}>
        <div className="p-6 flex flex-col h-full overflow-y-auto"> {/* Added overflow-y-auto for scrollable content */}
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 left-4 text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded-full p-2"
            aria-label="Close sidebar"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* User Info */}
          <div className="flex flex-col items-center mt-12 mb-8">
            <img
              src={user?.profilePic || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'User')}&background=E0E7FF&color=4338CA&size=96`}
              alt="Profile"
              className="w-24 h-24 rounded-full object-cover border-4 border-indigo-500 shadow-md mb-4"
            />
            <h3 className="text-xl font-bold text-gray-900 mb-1">{user?.name || "Guest User"}</h3>
            {user?.email && <p className="text-sm text-gray-600">{user.email}</p>}
          </div>

          {/* Navigation Links */}
          <nav className="flex-grow flex flex-col space-y-3">
            <Link
              to="/profile/view"
              onClick={onClose}
              className="flex items-center gap-3 px-4 py-2 rounded-lg text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 transition-colors duration-200"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              View Profile
            </Link>
            <Link
              to="/profile/edit"
              onClick={onClose}
              className="flex items-center gap-3 px-4 py-2 rounded-lg text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 transition-colors duration-200"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Edit Profile
            </Link>
            <Link
              to="/profile/become-mentor"
              onClick={onClose}
              className="flex items-center gap-3 px-4 py-2 rounded-lg text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 transition-colors duration-200"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 13.255A23.55 23.55 0 0112 15c-1.662 0-3.32-.11-4.943-.325M21 12c0 2.895-1.145 5.568-3 7.425M12 21c4.418 0 8-3.582 8-8s-3.582-8-8-8-8 3.582-8 8 3.582 8 8 8zM15 9a3 3 0 11-6 0 3 3 0 016 0zm3 0h.01M6 9h.01" />
              </svg>
              Become a Mentor
            </Link>
            {/* Add more links as needed */}
          </nav>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="flex items-center justify-center gap-2 mt-8 bg-red-500 text-white px-4 py-2.5 rounded-full font-semibold hover:bg-red-600 transition-colors duration-200 shadow-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
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