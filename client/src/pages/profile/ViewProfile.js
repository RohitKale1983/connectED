import React, { useEffect, useState } from "react";
import api from "../../api";

const ViewProfile = () => {
  const [user, setUser] = useState(null);
  const [isMentor, setIsMentor] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        const { data } = await api.get("/api/users/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setUser(data);

        const mentorRes = await api.get("/api/mentors/check", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setIsMentor(mentorRes.data.isMentor);
      } catch (err) {
        console.error("Error loading profile:", err);
      }
    };

    fetchProfile();
  }, []);

  if (!user) {
    return (
      <div className="max-w-2xl mx-auto mt-8 px-4">
        <div className="bg-gradient-to-br from-white via-gray-50 to-indigo-50 rounded-2xl shadow-xl p-8 border border-gray-200/50">
          <div className="animate-pulse">
            <div className="w-28 h-28 bg-gray-200 rounded-full mx-auto mb-6"></div>
            <div className="h-6 bg-gray-200 rounded-lg w-3/4 mx-auto mb-4"></div>
            <div className="h-4 bg-gray-200 rounded-lg w-1/2 mx-auto mb-6"></div>
            <div className="space-y-3">
              <div className="h-4 bg-gray-200 rounded-lg w-full"></div>
              <div className="h-4 bg-gray-200 rounded-lg w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded-lg w-2/3"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto mt-8 px-4">
      <div className="bg-gradient-to-br from-white via-gray-50 to-indigo-50 rounded-2xl shadow-xl border border-gray-200/50 overflow-hidden">
        {/* Header Background */}
        <div className="h-32 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 relative">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="absolute -bottom-14 left-1/2 transform -translate-x-1/2">
            <div className="relative">
              <img
                src={user.profilePic || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name || 'User')}&background=6366F1&color=FFFFFF&size=112`}
                alt="Profile"
                className="w-28 h-28 rounded-full object-cover border-4 border-white shadow-xl ring-4 ring-indigo-100/50"
              />
            </div>
          </div>
        </div>

        {/* Profile Content */}
        <div className="pt-16 pb-8 px-8">
          {/* Name and Bio */}
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-3 tracking-tight">
              {user.name}
            </h2>
            <p className="text-gray-600 text-lg leading-relaxed max-w-lg mx-auto">
              {user.bio || "No bio available"}
            </p>
          </div>

          {/* Contact Information */}
          <div className="space-y-4 mb-6">
            <div className="flex items-center gap-4 p-4 bg-white/80 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-500">Email</p>
                <p className="text-gray-900 font-medium">{user.email}</p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 bg-white/80 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-500">LinkedIn</p>
                {user.linkedin ? (
                  <a
                    href={user.linkedin}
                    className="text-blue-600 hover:text-blue-700 font-medium hover:underline transition-colors duration-200"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View LinkedIn Profile
                  </a>
                ) : (
                  <p className="text-gray-400">Not provided</p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 bg-white/80 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200">
              <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-gray-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-500">GitHub</p>
                {user.github ? (
                  <a
                    href={user.github}
                    className="text-gray-700 hover:text-gray-900 font-medium hover:underline transition-colors duration-200"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View GitHub Profile
                  </a>
                ) : (
                  <p className="text-gray-400">Not provided</p>
                )}
              </div>
            </div>
          </div>

          {/* Mentor Status */}
          {isMentor && (
            <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-xl p-4 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-emerald-800 font-semibold">Verified Mentor</p>
                  <p className="text-emerald-600 text-sm">You are registered as a mentor on our platform</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ViewProfile;