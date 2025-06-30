import React, { useEffect, useState } from "react";
import api from "../../api";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

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
  const [submitting, setSubmitting] = useState(false); // New state for submission loading
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
    setSubmitting(true); // Set submitting to true
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
      setSubmitting(false); // Reset submitting to false
    }
  };

  const handleEditProfile = () => {
    navigate("/mentor/edit-profile");
  };

  if (loading) return <p className="text-center p-6">Checking status...</p>;

  if (isMentor) {
    return (
      <div className="text-center p-6 bg-green-50 border border-green-300 rounded-md max-w-lg mx-auto mt-10 shadow-md">
        <p className="text-green-700 font-semibold text-lg mb-4 flex items-center justify-center">
          <span className="text-2xl mr-2">✅</span> You are already a mentor!
        </p>
        <button
          onClick={handleEditProfile}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-8 py-3 rounded-lg transition duration-300 ease-in-out transform hover:scale-105 shadow-md"
        >
          Edit Profile
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-xl mt-10 border border-gray-200">
      <h2 className="text-3xl font-extrabold mb-8 text-center text-gray-800">Become a Mentor</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-700">Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={form.name}
              onChange={handleChange}
              className="w-full border-gray-300 rounded-md shadow-sm px-4 py-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out"
              required
            />
          </div>
          <div>
            <label htmlFor="college" className="block mb-2 text-sm font-medium text-gray-700">College</label>
            <input
              type="text"
              id="college"
              name="college"
              value={form.college}
              onChange={handleChange}
              className="w-full border-gray-300 rounded-md shadow-sm px-4 py-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out"
            />
          </div>
          <div>
            <label htmlFor="branch" className="block mb-2 text-sm font-medium text-gray-700">Branch</label>
            <input
              type="text"
              id="branch"
              name="branch"
              value={form.branch}
              onChange={handleChange}
              className="w-full border-gray-300 rounded-md shadow-sm px-4 py-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out"
            />
          </div>
          <div>
            <label htmlFor="profilePic" className="block mb-2 text-sm font-medium text-gray-700">Profile Picture URL</label>
            <input
              type="url" // Use type="url" for better semantic meaning and browser validation
              id="profilePic"
              name="profilePic"
              value={form.profilePic}
              onChange={handleChange}
              className="w-full border-gray-300 rounded-md shadow-sm px-4 py-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out"
            />
          </div>
        </div>

        <div>
          <label htmlFor="skills" className="block mb-2 text-sm font-medium text-gray-700">Skills</label>
          <input
            type="text"
            id="skills"
            name="skills"
            value={form.skills}
            onChange={handleChange}
            placeholder="e.g., JavaScript, React, Node.js, Python"
            className="w-full border-gray-300 rounded-md shadow-sm px-4 py-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out"
            required
          />
          <p className="mt-2 text-xs text-gray-500">
            Separate multiple skills with commas.
          </p>
        </div>

        <div>
          <label htmlFor="bio" className="block mb-2 text-sm font-medium text-gray-700">Bio</label>
          <textarea
            id="bio"
            name="bio"
            value={form.bio}
            onChange={handleChange}
            placeholder="Tell us about yourself, your experience, and what you can offer as a mentor..."
            className="w-full border-gray-300 rounded-md shadow-sm px-4 py-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out"
            rows={5}
            required
          ></textarea>
        </div>

        <button
          type="submit"
          className="w-full bg-indigo-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-indigo-700 transition duration-300 ease-in-out transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={submitting} // Disable button while submitting
        >
          {submitting ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Submitting...
            </span>
          ) : (
            "Submit Application"
          )}
        </button>
      </form>
    </div>
  );
};

export default BecomeMentor;