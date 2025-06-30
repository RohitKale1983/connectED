import React, { useEffect, useState } from "react";
import api from "../../api";
import { toast } from "react-toastify";

const ProfilePage = () => {
  const [form, setForm] = useState({
    name: "",
    profilePic: "",
    bio: "",
    linkedin: "",
    github: "",
  });

  const [loading, setLoading] = useState(true);

  // Fetch profile on mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        const { data } = await api.get("/api/users/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setForm({
          name: data.name || "",
          profilePic: data.profilePic || "",
          bio: data.bio || "",
          linkedin: data.linkedin || "",
          github: data.github || "",
        });
        setLoading(false);
      } catch (err) {
        toast.error("Failed to load profile");
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const { data } = await api.put("/api/users/profile", form, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success(data.message || "Profile updated!");

      // 🔄 Save updated user in localStorage
      localStorage.setItem("user", JSON.stringify(data.user));
    } catch (err) {
      toast.error("Failed to update profile");
    }
  };

  if (loading) return <p className="p-4">Loading profile...</p>;

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">My Profile</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={form.name}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />
        <input
          type="text"
          name="profilePic"
          placeholder="Profile Picture URL"
          value={form.profilePic}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />
        <textarea
          name="bio"
          placeholder="Your Bio"
          value={form.bio}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />
        <input
          type="text"
          name="linkedin"
          placeholder="LinkedIn Profile URL"
          value={form.linkedin}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />
        <input
          type="text"
          name="github"
          placeholder="GitHub Profile URL"
          value={form.github}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Update Profile
        </button>
      </form>
    </div>
  );
};

export default ProfilePage;
