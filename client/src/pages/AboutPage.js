import React from "react";

const AboutPage = () => {
  return (
    <div className="container mx-auto p-8 py-12 bg-white shadow-xl rounded-lg my-8 font-sans border border-gray-200">
      <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6 text-center tracking-tight leading-tight">
        About <span className="text-indigo-600">ConnectED</span> Project
      </h1>
      <p className="text-lg text-gray-700 leading-relaxed mb-6 max-w-3xl mx-auto text-center">
        ConnectED is an educational project demonstrating full-stack web
        development using the <strong className="text-gray-800">MERN</strong>{" "}
        (MongoDB, Express.js, React.js, Node.js) stack. It simulates a platform
        for students and professionals to connect with mentors, receive career
        guidance, and manage their learning journey.
      </p>

      <div className="grid md:grid-cols-2 gap-8 my-8">
        <div className="bg-gray-50 p-6 rounded-lg shadow-sm border border-gray-100">
          <h2 className="text-2xl font-bold text-gray-800 mb-3">Key Features</h2>
          <ul className="list-disc list-inside text-gray-700 space-y-2">
            <li>User Authentication & Authorization</li>
            <li>Real-time Chat with Socket.IO</li>
            <li>Comprehensive Profile Management</li>
            <li>Mentor Review System</li>
            <li>AI-powered Career Suggestion Tool</li>
          </ul>
        </div>
        <div className="bg-gray-50 p-6 rounded-lg shadow-sm border border-gray-100">
          <h2 className="text-2xl font-bold text-gray-800 mb-3">Important Note</h2>
          <p className="text-gray-700 leading-relaxed">
            This is a <strong className="text-red-600">demonstration project</strong> and is not
            intended for commercial use or to provide actual professional
            advice. Its purpose is purely educational.
          </p>
        </div>
      </div>

      <div className="text-center mt-10 border-t border-gray-200 pt-8">
        <p className="text-gray-600 mb-4 text-lg">Developed with ❤️ by <strong className="text-gray-800">Rohit Kale</strong></p>
        <a
          href="https://github.com/RohitKale1983/connectED"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 transition duration-300 ease-in-out transform hover:scale-105"
        >
          <svg
            className="w-5 h-5 mr-2"
            fill="currentColor"
            viewBox="0 0 20 20"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M10 0C4.477 0 0 4.484 0 10.017c0 4.417 2.865 8.18 6.839 9.504.499.09.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.909-.621.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.829.091-.645.356-1.088.654-1.337-2.22-.253-4.555-1.113-4.555-4.949 0-1.099.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.026 2.747-1.026.546 1.379.202 2.398.099 2.65.64.7 1.028 1.597 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.337-.012 2.417-.012 2.747 0 .268.18.576.687.483C17.146 18.179 20 14.417 20 10.017 20 4.484 15.522 0 10 0z"
              clipRule="evenodd"
            />
          </svg>
          View Project on GitHub
        </a>
      </div>
    </div>
  );
};

export default AboutPage;