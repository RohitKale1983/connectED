// src/components/MainLayout.js

import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';
import ProfileSidebar from './ProfileSidebar';

const MainLayout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  useEffect(() => {
    try {
      const storedUser = JSON.parse(localStorage.getItem("user"));
      if (storedUser) {
        setCurrentUser(storedUser);
      } else {
        setCurrentUser(null);
      }
    } catch (e) {
      console.error("Failed to parse user from localStorage:", e);
      localStorage.removeItem("user");
      setCurrentUser(null);
    }
  }, []);

  useEffect(() => {
    const handleStorageChange = () => {
      try {
        const updatedUser = JSON.parse(localStorage.getItem("user"));
        setCurrentUser(updatedUser);
      } catch (e) {
        console.error("Failed to parse user from localStorage:", e);
        localStorage.removeItem("user");
        setCurrentUser(null);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 font-inter"> {/* Added bg-gray-50 and font-inter for consistency */}
      <Navbar onProfileClick={toggleSidebar} user={currentUser} />

      {/* Main content area */}
      {/* Removed 'container' class which applies max-width by default. */}
      {/* Added w-full for full width on all screens. */}
      {/* Changed px-4 to px-0 for mobile, then re-introduced padding for larger screens. */}
      {/* Added max-w-full lg:max-w-screen-xl to control max width only on larger screens. */}
      <main className="flex-grow w-full px-0 sm:px-4 md:px-6 lg:px-8 mx-auto max-w-full lg:max-w-screen-xl py-8 pt-20">
        {children}
      </main>

      <ProfileSidebar isOpen={isSidebarOpen} onClose={toggleSidebar} user={currentUser} />
    </div>
  );
};

export default MainLayout;
