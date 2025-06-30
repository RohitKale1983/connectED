// src/components/CareerSuggestionsDisplay.js
import React from 'react';

// You might want to import some simple icons if you use them, e.g., from heroicons
// import { BriefcaseIcon, ChartBarIcon, ScaleIcon } from '@heroicons/react/24/outline'; // Example icons

const CareerSuggestionsDisplay = ({ suggestions, onExploreRoadmap }) => {
  if (!suggestions || suggestions.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 text-center text-gray-600 text-xl">
        No career suggestions found. Please complete the questionnaire to get personalized recommendations!
      </div>
    );
  }

  return (
    <div className="space-y-6 sm:space-y-8 lg:space-y-10"> {/* Responsive vertical spacing between cards */}
      {suggestions.map((career, index) => (
        <div
          key={index}
          className="bg-white rounded-3xl shadow-xl border border-gray-100 p-6 sm:p-8 transition-all duration-300 ease-in-out hover:shadow-2xl hover:border-indigo-300 hover:scale-[1.01] relative overflow-hidden"
        >
          {/* Decorative Corner Element */}
          <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-50 rounded-bl-3xl opacity-50"></div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 sm:mb-5 z-10 relative">
            <h3 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-2 sm:mb-0 leading-tight">
              {career.careerName}
            </h3>
            <span className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-base sm:text-lg font-bold whitespace-nowrap
              ${
                career.fitPercentage >= 80 ? 'bg-green-100 text-green-800' :
                career.fitPercentage >= 60 ? 'bg-yellow-100 text-yellow-800' :
                'bg-red-100 text-red-800'
              }`}>
              {career.fitPercentage}% Fit
            </span>
          </div>

          <p className="text-gray-700 text-base sm:text-lg mb-5 sm:mb-6 leading-relaxed">
            {career.description}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 text-gray-600 text-sm sm:text-base mb-6">
            <div className="flex items-center">
              {/* <ScaleIcon className="h-5 w-5 text-gray-500 mr-2" /> (Example icon) */}
              <strong className="text-gray-800 mr-2">Average Salary:</strong> {career.averageSalaryLPA}
            </div>
            <div className="flex items-center">
              {/* <ChartBarIcon className="h-5 w-5 text-gray-500 mr-2" /> (Example icon) */}
              <strong className="text-gray-800 mr-2">Demand Level:</strong>
              <span className={`font-bold ${
                career.demandLevel === 'Very High' ? 'text-purple-600' :
                career.demandLevel === 'High' ? 'text-indigo-600' :
                career.demandLevel === 'Medium' ? 'text-orange-600' :
                'text-gray-500'
              }`}>
                {career.demandLevel}
              </span>
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-gray-100"> {/* Added a subtle separator */}
            <button
              onClick={() => onExploreRoadmap(career)}
              className="bg-indigo-600 text-white font-semibold py-2.5 px-6 rounded-full text-base sm:text-lg shadow-md hover:bg-indigo-700 transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2 active:scale-98"
            >
              Explore Roadmap
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CareerSuggestionsDisplay;