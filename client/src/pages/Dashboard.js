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
    navigate("/");
  };

  const dashboardCards = [
    {
      to: "/career-hub", // ⭐ NEW COMBINED CARD LINK ⭐
      icon: "✨", // Sparkle or rocket for new beginning / journey
      title: "Career Hub",
      description: "Explore career paths, generate roadmaps, and track your progress",
      bgColor: "bg-gradient-to-br from-purple-50 to-purple-100", // Using a distinct color for primary feature
      textColor: "text-purple-700",
      borderColor: "border-purple-200",
      hoverColor: "hover:from-purple-100 hover:to-purple-200"
    },
    {
      to: "/notes",
      icon: "📚",
      title: "Notes & Resources",
      description: "Manage your study materials and documents",
      bgColor: "bg-gradient-to-br from-blue-50 to-blue-100",
      textColor: "text-blue-700",
      borderColor: "border-blue-200",
      hoverColor: "hover:from-blue-100 hover:to-blue-200"
    },
    {
      to: "/backlogs",
      icon: "🗣️",
      title: "Community Forum",
      description: "Connect and collaborate with peers",
      bgColor: "bg-gradient-to-br from-emerald-50 to-emerald-100",
      textColor: "text-emerald-700",
      borderColor: "border-emerald-200",
      hoverColor: "hover:from-emerald-100 hover:to-emerald-200"
    },
    {
      to: "/mentorship",
      icon: "🧑‍🏫",
      title: "Mentorship Hub",
      description: "Find guidance and expert support",
      bgColor: "bg-gradient-to-br from-pink-50 to-pink-100",
      textColor: "text-pink-700",
      borderColor: "border-pink-200",
      hoverColor: "hover:from-pink-100 hover:to-pink-200"
    }
  ];

  return (
    <div className="min-h-[calc(100vh-80px)] bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl w-full">
        {/* Welcome Card */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 sm:p-10 text-center border border-white/20 mb-8">
          <div className="mb-6">
            <h1 className="text-5xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 bg-clip-text text-transparent mb-4">
              Welcome back!
            </h1>
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">
              Hello, <span className="text-indigo-600">{auth.user?.name || "User"}</span>
            </h2>
            <p className="text-gray-600 text-lg">
              Signed in as <span className="font-medium text-gray-800">{auth.user?.email}</span>
            </p>
          </div>
        </div>

        {/* Dashboard Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {dashboardCards.map((card, index) => (
            <Link
              key={index}
              to={card.to}
              className={`group relative overflow-hidden ${card.bgColor} ${card.hoverColor} ${card.textColor} rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-300 ease-out border ${card.borderColor} p-6`}
            >
              {/* Background Pattern */}
              <div className="absolute inset-0 opacity-5">
                <div className="absolute inset-0 bg-gradient-to-br from-white to-transparent"></div>
              </div>
              
              {/* Content */}
              <div className="relative z-10 flex flex-col items-center text-center">
                <div className="text-6xl mb-4 transform group-hover:scale-110 transition-transform duration-300">
                  {card.icon}
                </div>
                <h3 className="text-xl font-bold mb-2 group-hover:text-opacity-90">
                  {card.title}
                </h3>
                <p className="text-sm opacity-80 leading-relaxed">
                  {card.description}
                </p>
              </div>

              {/* Hover Effect */}
              <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
            </Link>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="bg-white/60 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-white/20">
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
            <Link
              to="/profile"
              className="group flex items-center gap-3 bg-white text-gray-700 px-8 py-4 rounded-xl hover:bg-gray-50 transition-all duration-300 ease-out shadow-md hover:shadow-lg font-medium border border-gray-200 min-w-[180px] justify-center"
            >
              <span className="text-xl group-hover:rotate-12 transition-transform duration-300">⚙️</span>
              <span>Manage Profile</span>
            </Link>

            <button
              onClick={handleLogout}
              className="group flex items-center gap-3 bg-gradient-to-r from-red-500 to-red-600 text-white px-8 py-4 rounded-xl hover:from-red-600 hover:to-red-700 transition-all duration-300 ease-out shadow-lg hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-red-400 focus:ring-opacity-30 font-medium min-w-[180px] justify-center"
            >
              <span className="text-xl group-hover:translate-x-1 transition-transform duration-300">🚪</span>
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;