const express = require("express");
const router = express.Router();
const Review = require("../models/reviewModel");
const Mentor = require("../models/mentorModel");
const requireSignIn = require("../middleware/authMiddleware");

// ✅ Create a review (initial submission)
router.post("/", requireSignIn, async (req, res) => {
  try {
    const { mentorId, rating, comment } = req.body;

    if (!mentorId || !rating) {
      return res.status(400).json({ message: "Mentor ID and rating are required." });
    }

    // 💡 REMOVED: The check for existingReview here, as the frontend now decides
    // whether to POST (new) or PUT (update). This POST route is now solely for new submissions.
    // If a user tries to POST when a review already exists, it will be a duplicate
    // which the frontend is designed to prevent by sending a PUT instead.

    const review = new Review({
      mentor: mentorId,
      mentee: req.user._id, // Assuming req.user._id is set by your requireSignIn middleware
      rating,
      comment,
    });

    await review.save();

    // Recalculate averages for the mentor
    await updateMentorReviewAverages(mentorId);

    // 💡 Return the newly created review including its _id, for frontend's userReviews Map
    res.status(201).json({ message: "Review added successfully.", _id: review._id });
  } catch (err) {
    console.error("Error creating review:", err);
    res.status(500).json({ message: "Server error.", error: err.message });
  }
});

// ✅ Get all reviews by the logged-in user
router.get("/myreviews", requireSignIn, async (req, res) => {
  try {
    const userId = req.user._id;

    // 💡 IMPORTANT CHANGE: Select 'mentor', 'rating', 'comment', and '_id' of the review
    const myReviews = await Review.find({ mentee: userId }).select("mentor rating comment");

    // The frontend expects an array of objects like { mentor: 'mentorId', rating: X, comment: 'Y', _id: 'reviewId' }
    // Mongoose by default includes _id when you don't explicitly exclude it.
    res.json(myReviews);
  } catch (err) {
    console.error("Error fetching user's reviews:", err);
    res.status(500).json({ message: "Server error.", error: err.message });
  }
});

// ✅ Update an existing review
// 💡 NEW ROUTE: PATCH for partial updates, or PUT if you strictly replace the resource
router.put("/:id", requireSignIn, async (req, res) => { // Using PUT as per frontend's expectation
  try {
    const reviewId = req.params.id;
    const { rating, comment } = req.body;

    if (!rating) {
      return res.status(400).json({ message: "Rating is required for update." });
    }

    // Find the review and ensure it belongs to the logged-in user
    const reviewToUpdate = await Review.findOne({
      _id: reviewId,
      mentee: req.user._id,
    });

    if (!reviewToUpdate) {
      return res.status(404).json({ message: "Review not found or unauthorized." });
    }

    reviewToUpdate.rating = rating;
    reviewToUpdate.comment = comment || ""; // Allow comment to be empty or null
    await reviewToUpdate.save();

    // Recalculate averages for the mentor
    await updateMentorReviewAverages(reviewToUpdate.mentor);

    res.json({ message: "Review updated successfully.", review: reviewToUpdate });
  } catch (err) {
    console.error("Error updating review:", err);
    res.status(500).json({ message: "Server error.", error: err.message });
  }
});


// Helper function to recalculate and update mentor's average rating and count
async function updateMentorReviewAverages(mentorId) {
  const reviews = await Review.find({ mentor: mentorId });
  const avgRating =
    reviews.length > 0 ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length : 0;

  await Mentor.findByIdAndUpdate(
    mentorId,
    {
      averageRating: parseFloat(avgRating.toFixed(1)),
      numberOfReviews: reviews.length,
    },
    { new: true }
  );
}


module.exports = router;