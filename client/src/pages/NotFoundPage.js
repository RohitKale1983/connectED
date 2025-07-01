import React from 'react';
import { Link } from 'react-router-dom';

const NotFoundPage = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-indigo-50 to-purple-100 text-gray-800 p-4 sm:p-8">
      {/* Optional: A friendly illustration or icon */}
      <div className="mb-8 animate-bounce-slow">
        <svg
          className="w-32 h-32 text-indigo-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
          ></path>
        </svg>
      </div>

      <h1 className="text-7xl sm:text-8xl font-extrabold text-indigo-700 mb-4 tracking-tight drop-shadow-lg">
        404
      </h1>
      <p className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6 text-center">
        Page Not Found
      </p>
      <p className="text-lg sm:text-xl text-gray-600 text-center mb-10 max-w-lg leading-relaxed">
        Oops! It looks like the page you were trying to reach doesn't exist.
        It might have been removed, had its name changed, or is temporarily unavailable.
      </p>
      <Link
        to="/"
        className="inline-flex items-center px-8 py-4 bg-indigo-600 text-white font-bold text-lg rounded-full shadow-xl hover:bg-indigo-700 transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-indigo-300 focus:ring-opacity-75"
      >
        <svg
          className="w-5 h-5 mr-3"
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"></path>
        </svg>
        Go to Homepage
      </Link>
    </div>
  );
};

export default NotFoundPage;