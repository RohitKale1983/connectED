import { useState, useContext } from "react";
import api from "../api";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ClipLoader } from 'react-spinners'; 

const LoginRegister = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: ""
  });
  const [isLoading, setIsLoading] = useState(false); // ⭐ NEW STATE for loading

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic form validation
    if (!formData.email || !formData.password || (!isLogin && !formData.name)) {
      toast.error("Please fill in all required fields.");
      return;
    }

    setIsLoading(true); // ⭐ Set loading to true before API call

    const url = isLogin ? "/api/auth/login" : "/api/auth/register";

    try {
      const res = await api.post(url, formData);

      if (isLogin) {
        login(res.data.token, res.data.user);
        toast.success("Login successful! Redirecting...", {
          position: "top-right",
          autoClose: 1200,
          onClose: () => navigate("/dashboard")
        });
      } else {
        toast.success("Registration successful! Please log in.", {
          position: "top-center",
          autoClose: 2000,
          onClose: () => setIsLogin(true)
        });
        setFormData({ name: "", email: "", password: "" }); // Clear form on successful registration
      }
    } catch (err) {
      const msg = err.response?.data?.message || "Something went wrong. Please try again.";
      toast.error(msg, {
        position: "top-center",
        autoClose: 3000,
      });
    } finally {
      setIsLoading(false); // ⭐ Set loading to false after API call (success or error)
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
            disabled={isLoading} // ⭐ Disable button while loading
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-700 text-white font-bold py-3 rounded-lg shadow-lg hover:from-blue-700 hover:to-indigo-800 transition duration-300 transform hover:-translate-y-1 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 text-lg relative" // ⭐ Added relative for spinner positioning
          >
            {isLoading ? (
              <ClipLoader
                color={"#ffffff"} // White spinner color
                size={20} // Size of the spinner
                aria-label="Loading Spinner"
                data-testid="loader"
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" // Center the spinner
              />
            ) : (
              isLogin ? "Log In" : "Register Now" // ⭐ Show button text when not loading
            )}
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