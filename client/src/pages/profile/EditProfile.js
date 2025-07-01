import React, { useEffect, useState } from "react";
import api from "../../api";
import { toast } from "react-toastify"; // Keep Toastify for general errors/fallback
import { ClipLoader } from 'react-spinners';

const EditProfile = () => {
  const [form, setForm] = useState({
    name: "",
    profilePic: "",
    bio: "",
    linkedin: "",
    github: "",
  });

  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null); // ⭐ NEW STATE for in-component success message

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
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

      } catch (err) {
        console.error("Error fetching profile:", err);
        toast.error("Failed to load profile"); // Use toast for errors
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSuccessMessage(null); // Clear any previous success message

    try {
      const token = localStorage.getItem("token");
      const { data } = await api.put("/api/users/profile", form, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Update localStorage
      localStorage.setItem("user", JSON.stringify(data.user));

      // ⭐ Set the in-component success message
      setSuccessMessage("Profile updated successfully!");
      // ⭐ Clear the message after 3 seconds
      setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);

      toast.success("Profile updated!"); // Keep Toastify for consistency if it starts working

    } catch (err) {
      console.error("Error updating profile:", err);
      toast.error("Failed to update profile"); // Use toast for errors
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full min-h-[300px]">
        <ClipLoader color={"#4F46E5"} size={50} aria-label="Loading Profile" />
        <p className="ml-4 text-gray-600">Loading profile data...</p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-xl mx-auto bg-white p-6 rounded-lg shadow-md space-y-4"
    >
      <h2 className="text-xl font-semibold text-center">Edit Your Profile</h2>

      {/* ⭐ In-component success message display */}
      {successMessage && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative text-center" role="alert">
          <span className="block sm:inline">{successMessage}</span>
        </div>
      )}

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
        disabled={isSubmitting}
        className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 relative w-full flex items-center justify-center"
      >
        {isSubmitting ? (
          <ClipLoader
            color={"#ffffff"}
            size={20}
            aria-label="Saving Changes"
          />
        ) : (
          "Save Changes"
        )}
      </button>
    </form>
  );
};

export default EditProfile;
