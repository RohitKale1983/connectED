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
    <div className="min-h-screen flex flex-col">
      <Navbar onProfileClick={toggleSidebar} user={currentUser} />

      {/* !!! CRUCIAL CHANGE HERE: Added pt-16 to account for fixed Navbar height !!! */}
      {/* The Navbar has an effective height around 64px (4rem), so pt-16 works well */}
      <main className="flex-grow container mx-auto px-4 py-8 pt-20"> {/* Adjusted pt for spacing */}
        {children}
      </main>

      <ProfileSidebar isOpen={isSidebarOpen} onClose={toggleSidebar} user={currentUser} />
    </div>
  );
};

export default MainLayout;