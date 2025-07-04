// src/pages/Dashboard.js
import { useContext, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";

const Dashboard = () => {
  const { auth, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  // Redirect to home if not authenticated
  useEffect(() => {
    if (!auth.token) {
      navigate("/");
    }
  }, [auth.token, navigate]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const dashboardCards = [
    {
      to: "/career-hub", 
      icon: "✨", 
      title: "Career Hub",
      description: "Explore career paths, generate roadmaps, and track your progress",
      bgColor: "bg-gradient-to-br from-purple-50 to-purple-100", 
      textColor: "text-purple-700",
      borderColor: "border-purple-200",
      hoverColor: "hover:from-purple-100 hover:to-purple-200",
      ringColor: "focus:ring-purple-300"
    },
    {
      to: "/notes",
      icon: "📚",
      title: "Notes & Resources",
      description: "Manage your study materials and documents",
      bgColor: "bg-gradient-to-br from-blue-50 to-blue-100",
      textColor: "text-blue-700",
      borderColor: "border-blue-200",
      hoverColor: "hover:from-blue-100 hover:to-blue-200",
      ringColor: "focus:ring-blue-300"
    },
    {
      to: "/backlogs",
      icon: "🗣️",
      title: "Community Forum",
      description: "Connect and collaborate with peers",
      bgColor: "bg-gradient-to-br from-emerald-50 to-emerald-100",
      textColor: "text-emerald-700",
      borderColor: "border-emerald-200",
      hoverColor: "hover:from-emerald-100 hover:to-emerald-200",
      ringColor: "focus:ring-emerald-300"
    },
    {
      to: "/mentorship",
      icon: "🧑‍🏫",
      title: "Mentorship Hub",
      description: "Find guidance and expert support",
      bgColor: "bg-gradient-to-br from-pink-50 to-pink-100",
      textColor: "text-pink-700",
      borderColor: "border-pink-200",
      hoverColor: "hover:from-pink-100 hover:to-pink-200",
      ringColor: "focus:ring-pink-300"
    }
  ];

  return (
    <div className="min-h-[calc(100vh-80px)] bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl w-full">
        {/* Welcome Card */}
        <div className="bg-white/85 backdrop-blur-md rounded-3xl shadow-2xl p-8 sm:p-12 text-center border border-white/30 mb-10 relative overflow-hidden">
          {/* Decorative background elements */}
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/30 via-purple-50/20 to-blue-50/30"></div>
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-purple-200/20 to-transparent rounded-full -translate-y-16 translate-x-16"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-blue-200/20 to-transparent rounded-full translate-y-12 -translate-x-12"></div>
          
          <div className="relative z-10">
            <h1 className="text-5xl sm:text-6xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 bg-clip-text text-transparent mb-6 animate-pulse">
              Welcome back!
            </h1>
            <h2 className="text-2xl sm:text-3xl font-semibold text-gray-800 mb-3">
              Hello, <span className="text-indigo-600 font-bold">{auth.user?.name || "User"}</span>
            </h2>
            <p className="text-gray-600 text-lg sm:text-xl">
              Signed in as <span className="font-semibold text-gray-800 bg-gray-100 px-3 py-1 rounded-full">{auth.user?.email}</span>
            </p>
          </div>
        </div>

        {/* Dashboard Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-8 mb-10">
          {dashboardCards.map((card, index) => (
            <Link
              key={index}
              to={card.to}
              className={`group relative overflow-hidden ${card.bgColor} ${card.hoverColor} ${card.textColor} rounded-3xl shadow-lg hover:shadow-2xl transform hover:scale-[1.03] transition-all duration-500 ease-out border-2 ${card.borderColor} hover:border-opacity-60 p-8 sm:p-10 focus:outline-none focus:ring-4 ${card.ringColor} focus:ring-opacity-50`}
            >
              {/* Enhanced Background Pattern */}
              <div className="absolute inset-0 opacity-[0.07]">
                <div className="absolute inset-0 bg-gradient-to-br from-white via-transparent to-white/50"></div>
                <div className="absolute top-0 right-0 w-20 h-20 bg-white rounded-full -translate-y-10 translate-x-10"></div>
                <div className="absolute bottom-0 left-0 w-16 h-16 bg-white rounded-full translate-y-8 -translate-x-8"></div>
              </div>
              
              {/* Content */}
              <div className="relative z-10 flex flex-col items-center text-center">
                <div className="text-7xl mb-6 transform group-hover:scale-125 group-hover:rotate-6 transition-all duration-500 ease-out">
                  {card.icon}
                </div>
                <h3 className="text-2xl font-bold mb-4 group-hover:text-opacity-90 leading-tight">
                  {card.title}
                </h3>
                <p className="text-base opacity-85 leading-relaxed group-hover:opacity-100 transition-opacity duration-300">
                  {card.description}
                </p>
              </div>

              {/* Enhanced Hover Effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              {/* Animated border on hover */}
              <div className="absolute inset-0 rounded-3xl border-2 border-white/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </Link>
          ))}
        </div>

        {/* Enhanced Action Buttons */}
        <div className="bg-white/70 backdrop-blur-md rounded-3xl shadow-xl p-8 border border-white/30 relative overflow-hidden">
          {/* Subtle background decoration */}
          <div className="absolute inset-0 bg-gradient-to-r from-gray-50/50 via-white/30 to-gray-50/50"></div>
          
          <div className="relative z-10 flex flex-col sm:flex-row justify-center items-center gap-6">
            <Link
              to="/profile"
              className="group flex items-center gap-4 bg-white/90 text-gray-700 px-10 py-5 rounded-2xl hover:bg-white hover:shadow-lg transition-all duration-300 ease-out shadow-md font-semibold border-2 border-gray-200 hover:border-gray-300 min-w-[200px] justify-center focus:outline-none focus:ring-4 focus:ring-gray-300 focus:ring-opacity-50"
            >
              <span className="text-2xl group-hover:rotate-45 group-hover:scale-110 transition-all duration-300">⚙️</span>
              <span className="text-lg">Manage Profile</span>
            </Link>

            <button
              onClick={handleLogout}
              className="group flex items-center gap-4 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-10 py-5 rounded-2xl transition-all duration-300 ease-out shadow-lg hover:shadow-2xl focus:outline-none focus:ring-4 focus:ring-red-400 focus:ring-opacity-50 font-semibold min-w-[200px] justify-center transform hover:scale-105"
            >
              <span className="text-2xl group-hover:translate-x-2 group-hover:scale-110 transition-all duration-300">🚪</span>
              <span className="text-lg">Sign Out</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;