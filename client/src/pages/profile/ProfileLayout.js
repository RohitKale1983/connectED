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
    <div className="flex h-screen">
      <aside className="w-64 bg-white p-4 border-r shadow-sm">
        <h2 className="text-lg font-bold mb-4">My Profile</h2>
        <nav className="space-y-2">
          <Link to="/profile/view" className={linkClass("/profile/view")}>
            👁 View Profile
          </Link>
          <Link to="/profile/edit" className={linkClass("/profile/edit")}>
            ✏️ Update Profile
          </Link>
          <Link to="/profile/become-mentor" className={linkClass("/profile/become-mentor")}>
            🎓 Become a Mentor
          </Link>
          <Link
            to="/"
            onClick={() => {
              localStorage.removeItem("token");
              localStorage.removeItem("user");
            }}
            className="block px-4 py-2 text-red-600 hover:bg-red-100 rounded-md"
          >
            🔓 Logout
          </Link>
        </nav>
      </aside>

      <main className="flex-1 p-6 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default ProfileLayout;
