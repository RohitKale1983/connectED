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
    <div className="min-h-screen bg-white text-gray-800 font-sans antialiased overflow-hidden">
      {/* Enhanced Hero Section */}
      <section className="relative flex flex-col items-center justify-center h-screen py-16 px-4 md:px-8 lg:px-16 text-center overflow-hidden bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-100">
        {/* Enhanced Background Elements */}
        <div className="absolute inset-0 z-0">
          {/* Animated gradient orbs */}
          <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-br from-blue-200/30 to-indigo-300/30 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute top-40 right-20 w-96 h-96 bg-gradient-to-br from-purple-200/30 to-pink-300/30 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute bottom-20 left-1/3 w-64 h-64 bg-gradient-to-br from-cyan-200/30 to-blue-300/30 rounded-full blur-3xl animate-pulse delay-2000"></div>
          
          {/* Floating elements */}
          <div className="absolute top-1/4 left-1/4 w-4 h-4 bg-indigo-400/60 rounded-full animate-bounce delay-300"></div>
          <div className="absolute top-1/3 right-1/3 w-3 h-3 bg-purple-400/60 rounded-full animate-bounce delay-700"></div>
          <div className="absolute bottom-1/3 left-1/5 w-5 h-5 bg-blue-400/60 rounded-full animate-bounce delay-1000"></div>
          <div className="absolute bottom-1/4 right-1/4 w-2 h-2 bg-pink-400/60 rounded-full animate-bounce delay-1500"></div>
        </div>

        {/* Enhanced Main Content */}
        <div className="relative z-10 max-w-5xl mx-auto">
          <div className="mb-8 flex flex-col items-center justify-center animate-fade-in-up">
            <div className="relative mb-8 group">
              <img
                src={logo}
                alt="ConnectED Logo"
                className="w-28 h-28 md:w-36 md:h-36 rounded-full shadow-2xl ring-4 ring-white/50 ring-offset-4 ring-offset-transparent transition-all duration-500 group-hover:scale-110 group-hover:shadow-3xl group-hover:ring-indigo-300/50"
              />
              {/* Floating glow effect */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-indigo-400/20 to-purple-400/20 blur-2xl scale-125 opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
            </div>
            
            <h1 className="text-6xl md:text-7xl lg:text-8xl font-black leading-tight text-gray-900 mb-4">
              <span className="bg-gradient-to-r from-indigo-700 via-indigo-800 to-indigo-900 bg-clip-text text-transparent animate-pulse">Connect</span>
              <span className="bg-gradient-to-r from-purple-600 via-purple-700 to-purple-800 bg-clip-text text-transparent animate-pulse delay-200">ED</span>
            </h1>
            
            {/* Animated subtitle */}
            <div className="h-1 w-32 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-full mb-6 animate-pulse"></div>
          </div>

          <p className="text-xl md:text-2xl lg:text-3xl text-gray-700 mb-12 animate-fade-in-up delay-100 leading-relaxed max-w-4xl mx-auto">
            Your personalized portal for <span className="font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">career guidance</span>, <span className="font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">mentorship</span>, and <span className="font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">collaborative learning</span>.
          </p>
          
          <div className="flex flex-row sm:flex-row justify-center gap-4 animate-fade-in-up delay-200">
            <Link
              to="/login"
              className="group relative px-10 py-5 bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 text-white text-lg font-bold rounded-full shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300 ease-in-out focus:outline-none focus:ring-4 focus:ring-indigo-400 focus:ring-offset-2 overflow-hidden"
            >
              <span className="relative z-10 flex items-center gap-2">
                Get Started
                <svg className="w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path>
                </svg>
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-white/5 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
            </Link>
          </div>
        </div>
      </section>

      {/* Enhanced Features Section */}
      <section
        ref={featuresRef}
        className={`py-24 px-4 md:px-8 lg:px-16 bg-gradient-to-b from-white to-gray-50 transition-all duration-1500 ease-out ${
          featuresInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl md:text-6xl font-black text-gray-900 mb-6">
              What <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">ConnectED</span> Offers
            </h2>
            <div className="h-1 w-24 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full mx-auto mb-4"></div>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Discover a comprehensive platform designed to accelerate your career journey
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Enhanced Feature Cards */}
            <div className="group relative bg-gradient-to-br from-blue-50 via-indigo-50 to-blue-100 p-8 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 hover:rotate-1 border border-blue-200/50 hover:border-blue-300/50 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative z-10">
                <div className="text-indigo-600 mb-6 flex justify-center transform group-hover:scale-110 transition-transform duration-500">
                  <div className="p-4 bg-white rounded-2xl shadow-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-center mb-4 text-gray-800 group-hover:text-indigo-800 transition-colors duration-300">
                  Personalized Career Paths
                </h3>
                <p className="text-gray-600 text-center leading-relaxed group-hover:text-gray-700 transition-colors duration-300">
                  Discover your ideal career with <span className="font-semibold text-indigo-600">AI-powered suggestions</span> and detailed roadmaps tailored to your unique skills and interests.
                </p>
              </div>
            </div>

            <div className="group relative bg-gradient-to-br from-purple-50 via-pink-50 to-purple-100 p-8 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 hover:rotate-1 border border-purple-200/50 hover:border-purple-300/50 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative z-10">
                <div className="text-purple-600 mb-6 flex justify-center transform group-hover:scale-110 transition-transform duration-500">
                  <div className="p-4 bg-white rounded-2xl shadow-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-center mb-4 text-gray-800 group-hover:text-purple-800 transition-colors duration-300">
                  Mentorship Connections
                </h3>
                <p className="text-gray-600 text-center leading-relaxed group-hover:text-gray-700 transition-colors duration-300">
                  Connect with experienced mentors, send connection requests, and receive guidance through <span className="font-semibold text-purple-600">real-time chat</span> and personalized sessions.
                </p>
              </div>
            </div>

            <div className="group relative bg-gradient-to-br from-emerald-50 via-teal-50 to-emerald-100 p-8 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 hover:rotate-1 border border-emerald-200/50 hover:border-emerald-300/50 overflow-hidden md:col-span-2 lg:col-span-1">
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative z-10">
                <div className="text-emerald-600 mb-6 flex justify-center transform group-hover:scale-110 transition-transform duration-500">
                  <div className="p-4 bg-white rounded-2xl shadow-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-center mb-4 text-gray-800 group-hover:text-emerald-800 transition-colors duration-300">
                  Real-time Chat & Support
                </h3>
                <p className="text-gray-600 text-center leading-relaxed group-hover:text-gray-700 transition-colors duration-300">
                  Engage in real-time conversations with peers and mentors, fostering a <span className="font-semibold text-emerald-600">supportive learning community</span> that grows with you.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Call to Action Section */}
      <section
        ref={ctaRef}
        className={`relative py-24 px-4 md:px-8 lg:px-16 bg-gradient-to-br from-indigo-600 via-purple-600 to-indigo-700 text-white text-center transition-all duration-1500 ease-out overflow-hidden ${
          ctaInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}
      >
        {/* Background elements */}
        <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-white/10"></div>
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-10 left-10 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
          <div className="absolute bottom-10 right-10 w-48 h-48 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-white/5 rounded-full blur-3xl"></div>
        </div>
        
        <div className="relative z-10 max-w-5xl mx-auto">
          <h2 className="text-5xl md:text-6xl font-black mb-8 leading-tight">
            Ready to Shape Your <span className="bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">Future</span>?
          </h2>
          <p className="text-xl md:text-2xl mb-12 max-w-4xl mx-auto leading-relaxed opacity-90">
            Join ConnectED today and take the first step towards a <span className="font-bold">clear, guided, and successful career journey</span> with personalized support every step of the way.
          </p>
          <div className="flex flex-row sm:flex-row justify-center gap-4">
            <Link
              to="/login"
              className="group relative px-12 py-6 bg-white text-indigo-700 text-xl font-bold rounded-full shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300 ease-in-out focus:outline-none focus:ring-4 focus:ring-white focus:ring-offset-2 overflow-hidden"
            >
              <span className="relative z-10 flex items-center gap-2">
                Sign Up Now
                <svg className="w-6 h-6 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path>
                </svg>
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-50/50 to-purple-50/50 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
            </Link>
          </div>
        </div>
      </section>

      {/* Enhanced Footer */}
      <footer className="relative py-12 px-4 md:px-8 lg:px-16 bg-gradient-to-br from-gray-900 to-gray-800 text-gray-300 text-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-gray-800/50 to-gray-900/50"></div>
        <div className="relative z-10 max-w-4xl mx-auto">
          <div className="flex flex-col md:flex-row justify-center items-center gap-6 mb-8">
            <img src={logo} alt="ConnectED Logo" className="w-12 h-12 rounded-full shadow-lg" />
            <h3 className="text-2xl font-bold">
              <span className="text-indigo-400">Connect</span>
              <span className="text-purple-400">ED</span>
            </h3>
          </div>
          <p className="text-sm mb-4 opacity-75">
            &copy; {new Date().getFullYear()} ConnectED. All rights reserved.
          </p>
          <div className="flex justify-center gap-6">
            <Link 
              to="/about" 
              className="hover:text-indigo-400 transition-colors duration-300 text-sm font-medium hover:underline"
            >
              About This Project
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;