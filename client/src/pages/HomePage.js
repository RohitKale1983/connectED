import React from 'react';
import { Link } from 'react-router-dom';
import { useInView } from 'react-intersection-observer';
import logo from '../assets/logo.png';

const HomePage = () => {
  const { ref: featuresRef, inView: featuresInView } = useInView({
    threshold: 0.15,
  });

  const { ref: ctaRef, inView: ctaInView } = useInView({
    threshold: 0.15,
  });

  return (
    <div className="min-h-screen bg-white text-gray-800 font-sans antialiased">
      {/* Hero Section */}
      <section className="relative flex flex-col items-center justify-center h-screen py-16 px-4 md:px-8 lg:px-16 text-center overflow-hidden bg-gradient-to-br from-blue-50 to-purple-100">
        {/* Background Blob/Shape - Lighter, more subtle tones */}
        <div className="absolute inset-0 z-0 opacity-30 animate-pulse-slow">
          <svg className="w-full h-full" viewBox="0 0 1440 810" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g filter="url(#filter0_f_1_2)">
              <ellipse cx="720" cy="405" rx="500" ry="300" fill="#BFD7ED" /> {/* Light Blue */}
            </g>
            <g filter="url(#filter1_f_1_2)">
              <ellipse cx="600" cy="200" rx="250" ry="150" fill="#D8BFD8" /> {/* Light Purple */}
            </g>
            <g filter="url(#filter2_f_1_2)">
              <ellipse cx="1100" cy="200" rx="200" ry="120" fill="#B0E0E6" /> {/* Pale Turquoise */}
            </g>
            <defs>
              <filter id="filter0_f_1_2" x="0" y="-95" width="1440" height="1000" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                <feFlood floodOpacity="0" result="BackgroundImageFix"/>
                <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
                <feGaussianBlur stdDeviation="150" result="effect1_foregroundBlur_1_2"/>
              </filter>
              <filter id="filter1_f_1_2" x="0" y="350" width="600" height="500" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                <feFlood floodOpacity="0" result="BackgroundImageFix"/>
                <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
                <feGaussianBlur stdDeviation="100" result="effect1_foregroundBlur_1_2"/>
              </filter>
              <filter id="filter2_f_1_2" x="800" y="0" width="600" height="440" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                <feFlood floodOpacity="0" result="BackgroundImageFix"/>
                <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
                <feGaussianBlur stdDeviation="100" result="effect1_foregroundBlur_1_2"/>
              </filter>
            </defs>
          </svg>
        </div>

        <div className="relative z-10 max-w-4xl mx-auto">
          <div className="mb-6 flex flex-col items-center justify-center animate-fade-in-up">
            <img
              src={logo}
              alt="ConnectED Logo"
              className="w-24 h-24 md:w-32 md:h-32 rounded-full shadow-lg mb-4 ring-4 ring-white ring-opacity-50"
            />
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold leading-tight text-gray-900">
              <span className="text-indigo-700">Connect</span>
              <span className="text-purple-600">ED</span>
            </h1>
          </div>

          <p className="text-xl md:text-2xl text-gray-700 mb-10 animate-fade-in-up delay-100">
            Your personalized portal for <strong>career guidance</strong>, <strong>mentorship</strong>, and <strong>collaborative learning</strong>.
          </p>
          <div className="flex justify-center animate-fade-in-up delay-200">
            <Link
              to="/login"
              className="px-8 py-4 bg-blue-600 text-white text-lg font-semibold rounded-full shadow-xl hover:bg-blue-700 transform hover:scale-105 transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Get Started
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section
        ref={featuresRef}
        className={`py-20 px-4 md:px-8 lg:px-16 bg-white transition-all duration-1500 ease-out ${
          featuresInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}
      >
        <h2 className="text-4xl font-bold text-center mb-12 text-gray-900">
          What ConnectED Offers
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 max-w-6xl mx-auto">
          {/* Feature Cards - Lighter backgrounds, subtle shadows */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-8 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-2">
            <div className="text-blue-500 mb-4 flex justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-center mb-3 text-gray-800">Personalized Career Paths</h3>
            <p className="text-gray-600 text-center">
              Discover your ideal career with **AI-powered suggestions** and detailed roadmaps tailored to your skills and interests.
            </p>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-8 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-2">
            <div className="text-purple-500 mb-4 flex justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M12 20.005v-2.326a4 4 0 00-3.305-3.933m0 0a3.046 3.046 0 010-5.618m0 5.618V21a2 2 0 002 2h4a2 2 0 002-2v-3.248M18 10a4 4 0 00-4-4H6a4 4 0 00-4 4v8a2 2 0 002 2h8a2 2 0 002-2v-4a4 4 0 00-4-4z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-center mb-3 text-gray-800">Mentorship Connections</h3>
            <p className="text-gray-600 text-center">
              Connect with experienced mentors, send connection requests, and receive guidance through <strong>real-time chat</strong>.
            </p>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-blue-50 p-8 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-2">
            <div className="text-green-500 mb-4 flex justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-center mb-3 text-gray-800">Real-time Chat & Support</h3>
            <p className="text-gray-600 text-center">
              Engage in real-time conversations with peers and mentors, fostering a <strong>supportive learning community</strong>.
            </p>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section
        ref={ctaRef}
        className={`py-20 px-4 md:px-8 lg:px-16 bg-blue-600 text-white text-center transition-all duration-1500 ease-out ${
          ctaInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}
      >
        <h2 className="text-4xl font-bold mb-6">Ready to Shape Your Future?</h2>
        <p className="text-xl mb-10 max-w-3xl mx-auto">
          Join ConnectED today and take the first step towards a <strong>clear, guided, and successful career journey</strong>.
        </p>
        <Link
          to="/login"
          className="px-10 py-4 bg-white text-blue-600 text-xl font-semibold rounded-full shadow-lg hover:bg-gray-100 transform hover:scale-105 transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2"
        >
          Sign Up Now
        </Link>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 md:px-8 lg:px-16 bg-gray-100 text-gray-600 text-center text-sm">
        <p>&copy; {new Date().getFullYear()} ConnectED. All rights reserved.</p>
        <p className="mt-2">
          <Link to="/about" className="hover:underline mx-2 text-gray-600">About This Project</Link>
        </p>
      </footer>
    </div>
  );
};

export default HomePage;