import React from 'react';
import { Link } from 'react-router-dom';

const CareerHubPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-50 flex items-center justify-center py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl w-full bg-white rounded-3xl shadow-2xl p-8 sm:p-12 md:p-16 border border-purple-200 text-center transform transition-all duration-300 ease-in-out hover:shadow-3xl">
        <h1 className="text-5xl font-extrabold text-gray-900 mb-6 leading-tight">
          Welcome to your <span className="text-purple-700">Career Hub</span>!
        </h1>
        <p className="text-xl text-gray-700 mb-12 max-w-prose mx-auto">
          Choose an option below to begin your personalized career planning journey.
        </p>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          <Link
            to="/career-finder"
            className="group flex flex-col items-center justify-center p-8 border border-indigo-300 rounded-3xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 hover:scale-[1.01] transition-all duration-300 bg-gradient-to-br from-indigo-50 to-indigo-100 text-indigo-800 hover:from-indigo-100 hover:to-indigo-200 focus:outline-none focus:ring-4 focus:ring-indigo-300 focus:ring-opacity-75 relative overflow-hidden"
          >
            <span className="absolute top-4 right-4 text-8xl opacity-5 group-hover:opacity-10 transition-opacity duration-300 pointer-events-none select-none">🧭</span>
            <span className="text-7xl mb-4 group-hover:rotate-6 transition-transform duration-300 relative z-10">🧭</span>
            <h2 className="text-3xl font-bold mb-3 text-indigo-900 relative z-10">Career Path Finder</h2>
            <p className="text-lg text-indigo-700 opacity-90 relative z-10">
              Generate personalized career suggestions and roadmaps
            </p>
          </Link>

          <Link
            to="/my-roadmaps"
            className="group flex flex-col items-center justify-center p-8 border border-green-300 rounded-3xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 hover:scale-[1.01] transition-all duration-300 bg-gradient-to-br from-green-50 to-green-100 text-green-800 hover:from-green-100 hover:to-green-200 focus:outline-none focus:ring-4 focus:ring-green-300 focus:ring-opacity-75 relative overflow-hidden"
          >
            <span className="absolute top-4 right-4 text-8xl opacity-5 group-hover:opacity-10 transition-opacity duration-300 pointer-events-none select-none">📋</span>
            <span className="text-7xl mb-4 group-hover:scale-110 transition-transform duration-300 relative z-10">📋</span>
            <h2 className="text-3xl font-bold mb-3 text-green-900 relative z-10">My Saved Roadmaps</h2>
            <p className="text-lg text-green-700 opacity-90 relative z-10">
              Access your saved career plans and track your progress.
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CareerHubPage;