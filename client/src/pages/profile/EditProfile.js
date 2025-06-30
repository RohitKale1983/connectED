import React, { useEffect, useState } from "react";
import api from "../../api";
import { toast } from "react-toastify";

const EditProfile = () => {
  const [form, setForm] = useState({
    name: "",
    profilePic: "",
    bio: "",
    linkedin: "",
    github: "",
  });

  const [loading, setLoading] = useState(true);

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

      // Update localStorage
      localStorage.setItem("user", JSON.stringify(data.user));

      toast.success("Profile updated!");
    } catch (err) {
      toast.error("Failed to update profile");
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-xl mx-auto bg-white p-6 rounded-lg shadow-md space-y-4"
    >
      <h2 className="text-xl font-semibold text-center">Edit Your Profile</h2>

      <input
        type="text"
        name="name"
        placeholder="Name"
        value={form.name}
        onChange={handleChange}
        className="w-full border px-3 py-2 rounded"
      />

      <input
        type="text"
        name="profilePic"
        placeholder="Profile Picture URL"
        value={form.profilePic}
        onChange={handleChange}
        className="w-full border px-3 py-2 rounded"
      />

      <textarea
        name="bio"
        placeholder="Bio"
        value={form.bio}
        onChange={handleChange}
        className="w-full border px-3 py-2 rounded"
      />

      <input
        type="text"
        name="linkedin"
        placeholder="LinkedIn URL"
        value={form.linkedin}
        onChange={handleChange}
        className="w-full border px-3 py-2 rounded"
      />

      <input
        type="text"
        name="github"
        placeholder="GitHub URL"
        value={form.github}
        onChange={handleChange}
        className="w-full border px-3 py-2 rounded"
      />

      <button
        type="submit"
        className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
      >
        Save Changes
      </button>
    </form>
  );
};

export default EditProfile;
