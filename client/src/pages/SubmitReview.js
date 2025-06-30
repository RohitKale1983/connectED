import React, { useState } from "react";
import api from "../api";
import { toast } from "react-toastify";

const SubmitReview = ({ mentorId }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await api.post(`/api/reviews/${mentorId}`, { rating, comment }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Review submitted!");
      setRating(0);
      setComment("");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to submit review.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block mb-1 font-semibold">Rating</label>
        <select
          value={rating}
          onChange={(e) => setRating(Number(e.target.value))}
          className="border px-3 py-2 rounded w-full"
          required
        >
          <option value="">Select rating</option>
          {[1, 2, 3, 4, 5].map((n) => (
            <option key={n} value={n}>{n} Star{n > 1 ? "s" : ""}</option>
          ))}
        </select>
      </div>
      <div>
        <label className="block mb-1 font-semibold">Comment</label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={3}
          className="border px-3 py-2 rounded w-full"
        ></textarea>
      </div>
      <button
        type="submit"
        className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition"
      >
        Submit Review
      </button>
    </form>
  );
};

export default SubmitReview;
