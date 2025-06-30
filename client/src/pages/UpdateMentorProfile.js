import React, { useEffect, useState } from "react";
import api from "../api";
import { toast } from "react-toastify";

const UpdateMentorProfile = () => {
  const [formData, setFormData] = useState({
    name: "",
    college: "",
    branch: "",
    profilePic: "",
    bio: "",
    skills: "",
  });

  const [loading, setLoading] = useState(false);
  const [initialLoadComplete, setInitialLoadComplete] = useState(false); // To show loading state initially
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true); // Set loading true for initial data fetch
      try {
        const res = await api.get("/mentors/check", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.data.isMentor && res.data.mentor) {
          const { user, bio, skills } = res.data.mentor;

          setFormData({
            name: user.name || "",
            college: user.college || "",
            branch: user.branch || "",
            profilePic: user.profilePic || "",
            bio: bio || "",
            skills: skills?.join(", ") || "", // Join skills array back into a comma-separated string
          });
        } else {
          // If not a mentor, or mentor data isn't available,
          // you might want to redirect or show a different message
          toast.info("Mentor profile not found. Please apply to become a mentor first.");
          // You might want to navigate to the "Become Mentor" page here
          // import { useNavigate } from "react-router-dom";
          // const navigate = useNavigate();
          // navigate("/become-mentor");
        }
      } catch (err) {
        console.error("Error fetching mentor profile:", err);
        toast.error("Failed to load mentor profile. Please try again.");
      } finally {
        setLoading(false); // Set loading false after fetch
        setInitialLoadComplete(true); // Mark initial load as complete
      }
    };

    fetchData();
  }, [token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true); // Set loading true during update submission
    try {
      // Convert skills to array
      const payload = {
        ...formData,
        skills: formData.skills
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
      };

      await api.put("/mentors/update", payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success("Profile updated successfully!");
    } catch (err) {
      console.error("Update error:", err);
      toast.error(err.response?.data?.message || "Update failed. Please check your inputs.");
    } finally {
      setLoading(false); // Set loading false after update attempt
    }
  };

  // Show a loading indicator until the initial data is fetched
  if (!initialLoadComplete) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-xl font-semibold text-gray-700">Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow-xl mt-10 border border-gray-200">
      <h2 className="text-3xl font-extrabold mb-8 text-center text-gray-800">Edit Your Mentor Profile</h2>
      <form onSubmit={handleUpdate} className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-700">Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md shadow-sm px-4 py-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out"
              required
            />
          </div>
          <div>
            <label htmlFor="college" className="block mb-2 text-sm font-medium text-gray-700">College</label>
            <input
              type="text"
              id="college"
              name="college"
              value={formData.college}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md shadow-sm px-4 py-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out"
            />
          </div>
          <div>
            <label htmlFor="branch" className="block mb-2 text-sm font-medium text-gray-700">Branch</label>
            <input
              type="text"
              id="branch"
              name="branch"
              value={formData.branch}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md shadow-sm px-4 py-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out"
            />
          </div>
          <div>
            <label htmlFor="profilePic" className="block mb-2 text-sm font-medium text-gray-700">Profile Picture URL</label>
            <input
              type="url"
              id="profilePic"
              name="profilePic"
              value={formData.profilePic}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md shadow-sm px-4 py-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out"
            />
          </div>
        </div>

        <div>
          <label htmlFor="skills" className="block mb-2 text-sm font-medium text-gray-700">Skills</label>
          <input
            type="text"
            id="skills"
            name="skills"
            value={formData.skills}
            onChange={handleChange}
            placeholder="e.g., JavaScript, React, Node.js, Python"
            className="w-full border border-gray-300 rounded-md shadow-sm px-4 py-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out"
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
            rows={5}
            value={formData.bio}
            onChange={handleChange}
            placeholder="Write a brief bio about your experience and what you can offer as a mentor..."
            className="w-full border border-gray-300 rounded-md shadow-sm px-4 py-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out"
            required
          ></textarea>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-indigo-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-indigo-700 transition duration-300 ease-in-out transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
        >
          {loading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Updating...
            </>
          ) : (
            "Update Profile"
          )}
        </button>
      </form>
    </div>
  );
};

export default UpdateMentorProfile;