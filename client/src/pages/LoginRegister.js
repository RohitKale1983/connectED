import { useState, useContext } from "react";
import api from "../api";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify'; // Import Toastify
import 'react-toastify/dist/ReactToastify.css'; // Import Toastify CSS

const LoginRegister = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: ""
  });
  // Removed message and isError states, will use Toastify instead
  // const [message, setMessage] = useState(null);
  // const [isError, setIsError] = useState(false);

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // No need to clear internal messages, Toastify handles its own lifecycle

    const url = isLogin ? "/auth/login" : "/auth/register";

    try {
      const res = await api.post(url, formData);

      if (isLogin) {
        login(res.data.token, res.data.user);
        toast.success("Login successful! Redirecting...", {
          position: "top-right", // Specific position for this toast
          autoClose: 1200, // Shorter autoClose for quick redirect feedback
          onClose: () => navigate("/dashboard") // Navigate after toast closes
        });
      } else {
        toast.success("Registration successful! Please log in.", {
          position: "top-center",
          autoClose: 2000,
          onClose: () => setIsLogin(true) // Switch to login form after toast
        });
        setFormData({ name: "", email: "", password: "" }); // Clear form on successful registration
      }
    } catch (err) {
      const msg = err.response?.data?.message || "Something went wrong. Please try again.";
      toast.error(msg, {
        position: "top-center", // Consistent position for errors
        autoClose: 3000,
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4 font-sans">
      <ToastContainer /> {/* Toastify container */}
      <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl border border-gray-200 p-8 space-y-8 animate-fade-in-down">
        <h2 className="text-4xl font-extrabold mb-6 text-center text-gray-800 tracking-tight">
          {isLogin ? "Welcome Back!" : "Join Our Community!"}
        </h2>
        <p className="text-center text-gray-600 mb-8 text-lg">
          {isLogin ? "Sign in to continue" : "Create your account in seconds"}
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          {!isLogin && (
            <div className="relative">
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                className="w-full px-5 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200 placeholder-gray-400 text-gray-800 text-lg"
                value={formData.name}
                onChange={handleChange}
                required
              />
              <label htmlFor="name" className="sr-only">Full Name</label>
            </div>
          )}
          <div className="relative">
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              className="w-full px-5 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200 placeholder-gray-400 text-gray-800 text-lg"
              value={formData.email}
              onChange={handleChange}
              required
            />
            <label htmlFor="email" className="sr-only">Email Address</label>
          </div>
          <div className="relative">
            <input
              type="password"
              name="password"
              placeholder="Password"
              className="w-full px-5 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200 placeholder-gray-400 text-gray-800 text-lg"
              value={formData.password}
              onChange={handleChange}
              required
            />
            <label htmlFor="password" className="sr-only">Password</label>
          </div>
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-700 text-white font-bold py-3 rounded-lg shadow-lg hover:from-blue-700 hover:to-indigo-800 transition duration-300 transform hover:-translate-y-1 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 text-lg"
          >
            {isLogin ? "Log In" : "Register Now"}
          </button>
        </form>

        <div className="text-center mt-6">
          <p className="text-gray-600 text-md">
            {isLogin ? "New here?" : "Already have an account?"}{' '}
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-indigo-600 hover:text-indigo-800 font-semibold transition duration-200 hover:underline focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              {isLogin
                ? "Create an Account"
                : "Log In"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginRegister;