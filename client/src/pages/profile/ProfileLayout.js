import React from "react";
import { Link, Outlet, useLocation } from "react-router-dom";

const ProfileLayout = () => {
  const location = useLocation();

  const linkClass = (path) =>
    `block px-4 py-2 rounded-md ${
      location.pathname === path
        ? "bg-indigo-600 text-white"
        : "text-gray-700 hover:bg-gray-100"
    }`;

  return (
    // Changed to flex-col on small screens, flex-row on medium and up
    <div className="flex flex-col md:flex-row h-screen">
      {/* Sidebar: w-full on small, w-64 on medium and up */}
      {/* Added border-b for small screens, border-r for medium and up */}
      <aside className="w-full md:w-64 bg-white p-4 border-b md:border-r shadow-sm md:shadow-none">
        <h2 className="text-lg font-bold mb-4">My Profile</h2>
        {/* Adjusted nav to be a flex container for links on small screens for potential wrapping */}
        <nav className="flex flex-col space-y-2 md:block">
          <Link to="/profile/view" className={linkClass("/profile/view")}>
            👁 View Profile
          </Link>
          <Link to="/profile/edit" className={linkClass("/profile/edit")}>
            ✏️ Update Profile
          </Link>
          <Link to="/profile/become-mentor" className={linkClass("/profile/become-mentor")}>
            🎓 Become a Mentor
          </Link>
        </nav>
      </aside>

      {/* Main content area: takes remaining space */}
      <main className="flex-1 p-4 md:p-6 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default ProfileLayout;