import { useState, useContext } from "react";
import api from "../api";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ClipLoader } from 'react-spinners';
import { Eye, EyeOff, Mail, User, Lock, Sparkles } from "lucide-react";

const LoginRegister = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: ""
  });
  const [isLoading, setIsLoading] = useState(false);
  const [focusedField, setFocusedField] = useState(null);

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password || (!isLogin && !formData.name)) {
      toast.error("Please fill in all required fields.");
      return;
    }

    setIsLoading(true);

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
        setFormData({ name: "", email: "", password: "" });
      }
    } catch (err) {
      const msg = err.response?.data?.message || "Something went wrong. Please try again.";
      toast.error(msg, {
        position: "top-center",
        autoClose: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setFormData({ name: "", email: "", password: "" });
    setFocusedField(null);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-4 relative overflow-hidden">
      <ToastContainer />
      
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-4 -left-4 w-72 h-72 bg-gradient-to-br from-blue-400/10 to-indigo-600/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-8 -right-8 w-96 h-96 bg-gradient-to-br from-purple-400/10 to-pink-600/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-br from-cyan-400/5 to-blue-600/5 rounded-full blur-2xl animate-pulse delay-500"></div>
      </div>

      <div className="max-w-md w-full relative">
        {/* Main card */}
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8 space-y-8 transform transition-all duration-500 ease-out hover:shadow-3xl hover:scale-[1.02] hover:bg-white/90">
          {/* Header */}
          <div className="text-center space-y-4">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl shadow-lg transform rotate-3 hover:rotate-6 transition-transform duration-300">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
            </div>
            <h2 className="text-4xl font-black bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-800 bg-clip-text text-transparent leading-tight tracking-tight">
              {isLogin ? "Welcome Back!" : "Join the Magic!"}
            </h2>
            <p className="text-gray-600 text-lg leading-relaxed max-w-sm mx-auto">
              {isLogin 
                ? "Sign in to continue your amazing journey" 
                : "Create your account and unlock endless possibilities"}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name field for registration */}
            {!isLogin && (
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <User className={`w-5 h-5 transition-colors duration-200 ${
                    focusedField === 'name' ? 'text-indigo-600' : 'text-gray-400'
                  }`} />
                </div>
                <input
                  type="text"
                  name="name"
                  id="name"
                  placeholder="Full Name"
                  className="w-full pl-12 pr-4 py-4 bg-gray-50/50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 focus:bg-white transition-all duration-300 placeholder-gray-400 text-gray-800 text-lg hover:bg-gray-50 hover:border-gray-300"
                  value={formData.name}
                  onChange={handleChange}
                  onFocus={() => setFocusedField('name')}
                  onBlur={() => setFocusedField(null)}
                  required
                  aria-label="Full Name"
                />
                <div className={`absolute inset-0 rounded-2xl transition-all duration-300 pointer-events-none ${
                  focusedField === 'name' 
                    ? 'ring-2 ring-indigo-500/20 ring-offset-2' 
                    : ''
                }`}></div>
              </div>
            )}

            {/* Email field */}
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Mail className={`w-5 h-5 transition-colors duration-200 ${
                  focusedField === 'email' ? 'text-indigo-600' : 'text-gray-400'
                }`} />
              </div>
              <input
                type="email"
                name="email"
                id="email"
                placeholder="Email Address"
                className="w-full pl-12 pr-4 py-4 bg-gray-50/50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 focus:bg-white transition-all duration-300 placeholder-gray-400 text-gray-800 text-lg hover:bg-gray-50 hover:border-gray-300"
                value={formData.email}
                onChange={handleChange}
                onFocus={() => setFocusedField('email')}
                onBlur={() => setFocusedField(null)}
                required
                aria-label="Email Address"
              />
              <div className={`absolute inset-0 rounded-2xl transition-all duration-300 pointer-events-none ${
                focusedField === 'email' 
                  ? 'ring-2 ring-indigo-500/20 ring-offset-2' 
                  : ''
              }`}></div>
            </div>

            {/* Password field */}
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Lock className={`w-5 h-5 transition-colors duration-200 ${
                  focusedField === 'password' ? 'text-indigo-600' : 'text-gray-400'
                }`} />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                id="password"
                placeholder="Password"
                className="w-full pl-12 pr-12 py-4 bg-gray-50/50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 focus:bg-white transition-all duration-300 placeholder-gray-400 text-gray-800 text-lg hover:bg-gray-50 hover:border-gray-300"
                value={formData.password}
                onChange={handleChange}
                onFocus={() => setFocusedField('password')}
                onBlur={() => setFocusedField(null)}
                required
                aria-label="Password"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-indigo-600 transition-colors duration-200 focus:outline-none focus:text-indigo-600"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
              <div className={`absolute inset-0 rounded-2xl transition-all duration-300 pointer-events-none ${
                focusedField === 'password' 
                  ? 'ring-2 ring-indigo-500/20 ring-offset-2' 
                  : ''
              }`}></div>
            </div>

            {/* Submit button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 text-white font-bold py-4 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 hover:scale-[1.02] focus:outline-none focus:ring-4 focus:ring-indigo-500/50 focus:ring-offset-2 text-xl relative flex items-center justify-center h-16 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none group overflow-hidden"
            >
              {/* Button background animation */}
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-700 via-purple-700 to-indigo-800 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              
              {isLoading ? (
                <div className="relative z-10 flex items-center space-x-3">
                  <ClipLoader
                    color={"#ffffff"}
                    size={24}
                    aria-label="Loading Spinner"
                    data-testid="loader"
                  />
                  <span>Processing...</span>
                </div>
              ) : (
                <span className="relative z-10 flex items-center space-x-2">
                  <span>{isLogin ? "Sign In" : "Create Account"}</span>
                  <div className="w-5 h-5 bg-white/20 rounded-full flex items-center justify-center group-hover:translate-x-1 transition-transform duration-300">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  </div>
                </span>
              )}
            </button>
          </form>

          {/* Toggle between login/register */}
          <div className="text-center pt-4 border-t border-gray-100">
            <p className="text-gray-600 text-base mb-4">
              {isLogin ? "New to our platform?" : "Already have an account?"}
            </p>
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="group relative inline-flex items-center space-x-2 text-indigo-600 hover:text-indigo-800 font-semibold transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:ring-offset-2 rounded-lg px-4 py-2"
            >
              <span className="relative">
                {isLogin ? "Create Account" : "Sign In Instead"}
                <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-indigo-600 group-hover:w-full transition-all duration-300"></div>
              </span>
              <div className="w-4 h-4 bg-indigo-100 rounded-full flex items-center justify-center group-hover:bg-indigo-200 transition-colors duration-300">
                <div className="w-1.5 h-1.5 bg-indigo-600 rounded-full"></div>
              </div>
            </button>
          </div>
        </div>

        {/* Floating elements */}
        <div className="absolute -top-6 -right-6 w-12 h-12 bg-gradient-to-br from-pink-400 to-purple-500 rounded-full opacity-60 animate-bounce delay-1000"></div>
        <div className="absolute -bottom-4 -left-4 w-8 h-8 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full opacity-40 animate-pulse delay-700"></div>
      </div>
    </div>
  );
};

export default LoginRegister;