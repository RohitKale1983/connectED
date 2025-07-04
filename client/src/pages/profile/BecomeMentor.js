import React, { useEffect, useState } from "react";
import api from "../../api";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { CheckCircle, User, GraduationCap, Code, Image, FileText, Sparkles, Loader2 } from "lucide-react";

const BecomeMentor = () => {
  const [form, setForm] = useState({
    name: "",
    college: "",
    branch: "",
    profilePic: "",
    skills: "",
    bio: "",
  });

  const [isMentor, setIsMentor] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    const loadData = async () => {
      try {
        const checkRes = await api.get("/api/mentors/check", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setIsMentor(checkRes.data.isMentor);

        const user = JSON.parse(localStorage.getItem("user"));
        if (user) {
          setForm((prev) => ({
            ...prev,
            name: user.name || "",
            college: user.college || "",
            branch: user.branch || "",
            profilePic: user.profilePic || "",
          }));
        }
      } catch (err) {
        toast.error("Error checking mentor status.");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload = {
        ...form,
        skills: form.skills.split(",").map((s) => s.trim()).filter(Boolean),
      };

      const { data } = await api.post("/api/mentors/apply", payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success(data.message || "Mentor application submitted!");
      setIsMentor(true);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to apply");
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditProfile = () => {
    navigate("/mentor/edit-profile");
  };

  // Enhanced Loading Component
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-4"></div>
            <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-indigo-400 rounded-full animate-spin mx-auto" style={{ animationDuration: '0.8s', animationDirection: 'reverse' }}></div>
          </div>
          <p className="text-gray-600 font-medium">Checking your mentor status...</p>
          <p className="text-sm text-gray-400 mt-1">This won't take long</p>
        </div>
      </div>
    );
  }

  // Enhanced Success State
  if (isMentor) {
    return (
      <div className="min-h-[400px] flex items-center justify-center p-6">
        <div className="text-center max-w-md mx-auto">
          <div className="relative mb-6">
            <div className="w-24 h-24 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto shadow-lg">
              <CheckCircle className="w-12 h-12 text-white" />
            </div>
          </div>
          
          <h2 className="text-2xl font-bold text-gray-800 mb-2">You're Already a Mentor!</h2>
          <p className="text-gray-600 mb-6">Ready to inspire and guide the next generation of learners.</p>
          
          <button
            onClick={handleEditProfile}
            className="group relative bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold px-8 py-3 rounded-xl transition-all duration-300 ease-in-out transform hover:scale-105 shadow-lg hover:shadow-xl"
          >
            <span className="relative z-10">Edit Profile</span>
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-700 to-purple-700 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl mb-4 shadow-lg">
            <GraduationCap className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-extrabold text-gray-900 mb-2">Become a Mentor</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Share your knowledge and experience to help guide the next generation of learners on their journey.
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white/70 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 p-8 md:p-10">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Personal Information Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Name Field */}
              <div className="space-y-2">
                <label htmlFor="name" className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                  <User className="w-4 h-4 mr-2 text-indigo-500" />
                  Full Name
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    onFocus={() => setFocusedField('name')}
                    onBlur={() => setFocusedField(null)}
                    className={`w-full border-2 rounded-xl shadow-sm px-4 py-3 transition-all duration-200 ease-in-out ${
                      focusedField === 'name' 
                        ? 'border-indigo-500 ring-4 ring-indigo-500/20 bg-white' 
                        : 'border-gray-200 hover:border-gray-300 bg-gray-50/50'
                    } focus:outline-none`}
                    placeholder="Enter your full name"
                    required
                  />
                </div>
              </div>

              {/* College Field */}
              <div className="space-y-2">
                <label htmlFor="college" className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                  <GraduationCap className="w-4 h-4 mr-2 text-indigo-500" />
                  College/University
                </label>
                <div className="relative">
                  <input
                    type="text"
                    id="college"
                    name="college"
                    value={form.college}
                    onChange={handleChange}
                    onFocus={() => setFocusedField('college')}
                    onBlur={() => setFocusedField(null)}
                    className={`w-full border-2 rounded-xl shadow-sm px-4 py-3 transition-all duration-200 ease-in-out ${
                      focusedField === 'college' 
                        ? 'border-indigo-500 ring-4 ring-indigo-500/20 bg-white' 
                        : 'border-gray-200 hover:border-gray-300 bg-gray-50/50'
                    } focus:outline-none`}
                    placeholder="e.g., MIT, Stanford University"
                  />
                </div>
              </div>

              {/* Branch Field */}
              <div className="space-y-2">
                <label htmlFor="branch" className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                  <Code className="w-4 h-4 mr-2 text-indigo-500" />
                  Field of Study
                </label>
                <div className="relative">
                  <input
                    type="text"
                    id="branch"
                    name="branch"
                    value={form.branch}
                    onChange={handleChange}
                    onFocus={() => setFocusedField('branch')}
                    onBlur={() => setFocusedField(null)}
                    className={`w-full border-2 rounded-xl shadow-sm px-4 py-3 transition-all duration-200 ease-in-out ${
                      focusedField === 'branch' 
                        ? 'border-indigo-500 ring-4 ring-indigo-500/20 bg-white' 
                        : 'border-gray-200 hover:border-gray-300 bg-gray-50/50'
                    } focus:outline-none`}
                    placeholder="e.g., Computer Science, Data Science"
                  />
                </div>
              </div>

              {/* Profile Picture Field */}
              <div className="space-y-2">
                <label htmlFor="profilePic" className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                  <Image className="w-4 h-4 mr-2 text-indigo-500" />
                  Profile Picture URL
                </label>
                <div className="relative">
                  <input
                    type="url"
                    id="profilePic"
                    name="profilePic"
                    value={form.profilePic}
                    onChange={handleChange}
                    onFocus={() => setFocusedField('profilePic')}
                    onBlur={() => setFocusedField(null)}
                    className={`w-full border-2 rounded-xl shadow-sm px-4 py-3 transition-all duration-200 ease-in-out ${
                      focusedField === 'profilePic' 
                        ? 'border-indigo-500 ring-4 ring-indigo-500/20 bg-white' 
                        : 'border-gray-200 hover:border-gray-300 bg-gray-50/50'
                    } focus:outline-none`}
                    placeholder="https://example.com/your-photo.jpg"
                  />
                </div>
              </div>
            </div>

            {/* Skills Field */}
            <div className="space-y-2">
              <label htmlFor="skills" className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                <Sparkles className="w-4 h-4 mr-2 text-indigo-500" />
                Skills & Expertise
                <span className="text-red-500 ml-1">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="skills"
                  name="skills"
                  value={form.skills}
                  onChange={handleChange}
                  onFocus={() => setFocusedField('skills')}
                  onBlur={() => setFocusedField(null)}
                  className={`w-full border-2 rounded-xl shadow-sm px-4 py-3 transition-all duration-200 ease-in-out ${
                    focusedField === 'skills' 
                      ? 'border-indigo-500 ring-4 ring-indigo-500/20 bg-white' 
                      : 'border-gray-200 hover:border-gray-300 bg-gray-50/50'
                  } focus:outline-none`}
                  placeholder="JavaScript, React, Node.js, Python, Machine Learning"
                  required
                />
              </div>
              <p className="text-xs text-gray-500 mt-2 bg-blue-50 p-2 rounded-lg border border-blue-200">
                💡 <strong>Tip:</strong> Separate multiple skills with commas. Be specific about your expertise areas.
              </p>
            </div>

            {/* Bio Field */}
            <div className="space-y-2">
              <label htmlFor="bio" className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                <FileText className="w-4 h-4 mr-2 text-indigo-500" />
                About You
                <span className="text-red-500 ml-1">*</span>
              </label>
              <div className="relative">
                <textarea
                  id="bio"
                  name="bio"
                  value={form.bio}
                  onChange={handleChange}
                  onFocus={() => setFocusedField('bio')}
                  onBlur={() => setFocusedField(null)}
                  className={`w-full border-2 rounded-xl shadow-sm px-4 py-3 transition-all duration-200 ease-in-out resize-none ${
                    focusedField === 'bio' 
                      ? 'border-indigo-500 ring-4 ring-indigo-500/20 bg-white' 
                      : 'border-gray-200 hover:border-gray-300 bg-gray-50/50'
                  } focus:outline-none`}
                  rows={5}
                  placeholder="Tell us about your journey, experience, and what you're passionate about teaching. What unique perspective can you bring to mentoring?"
                  required
                />
              </div>
              <div className="flex justify-between items-center">
                <p className="text-xs text-gray-500">
                  Share your story and what motivates you to mentor others.
                </p>
                <span className="text-xs text-gray-400">
                  {form.bio.length} characters
                </span>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-6">
              <button
                type="submit"
                disabled={submitting}
                className="group relative w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 ease-in-out transform hover:scale-[1.02] disabled:hover:scale-100 shadow-lg hover:shadow-xl disabled:shadow-md disabled:cursor-not-allowed overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-700 to-purple-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                {submitting ? (
                  <span className="relative z-10 flex items-center justify-center">
                    <Loader2 className="w-5 h-5 animate-spin mr-3" />
                    <span className="animate-pulse">Submitting...</span>
                  </span>
                ) : (
                  <span className="relative z-10 flex items-center justify-center">
                    <Sparkles className="w-5 h-5 mr-2 group-hover:animate-pulse" />
                    Submit Application
                  </span>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Footer Note */}
        <div className="text-center mt-8">
          <p className="text-sm text-gray-500">
            By submitting this application, you agree to our mentorship guidelines and community standards.
          </p>
        </div>
      </div>
    </div>
  );
};

export default BecomeMentor;