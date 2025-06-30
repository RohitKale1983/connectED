import React, { useEffect, useState } from "react";
import api from "../../api";
import { toast } from "react-toastify";

const Mentorship = () => {
  const [mentors, setMentors] = useState([]);
  const [connectionStatuses, setConnectionStatuses] = useState({});
  const [loading, setLoading] = useState(true);
  const [openReviewMentorId, setOpenReviewMentorId] = useState(null);
  const [ratingValue, setRatingValue] = useState(5);
  const [ratingComment, setRatingComment] = useState("");
  const [userReviews, setUserReviews] = useState(new Map());

  const token = localStorage.getItem("token");

  const fetchAllMentors = async () => {
    try {
      const res = await api.get("/mentors/all");
      const fetchedMentors = res.data.map((mentor) => ({
        ...mentor,
        skills: mentor.skills || [],
        user: {
          ...mentor.user,
          name: mentor.user?.name || "Mentor Name",
          profilePic: mentor.user?.profilePic || null,
        },
      }));
      setMentors(fetchedMentors);
      return fetchedMentors;
    } catch (err) {
      console.error("Failed to fetch mentors:", err);
      toast.error("Failed to load mentors. Please try again.");
      return [];
    }
  };

  const fetchAllConnectionStatuses = async (mentorList) => {
    if (!token) {
      setConnectionStatuses({});
      return;
    }

    const statuses = {};
    const requests = mentorList.map(async (mentor) => {
      try {
        const res = await api.get(
          `/mentors/request/status/${mentor.user._id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        statuses[mentor.user._id] = res.data.status;
      } catch (err) {
        console.error(
          `Error fetching status for mentor ${mentor.user._id}:`,
          err
        );
        statuses[mentor.user._id] = "none";
      }
    });

    await Promise.all(requests);
    setConnectionStatuses(statuses);
  };

  const fetchUserReviews = async () => {
    try {
      if (!token) {
        setUserReviews(new Map());
        return;
      }
      const res = await api.get("/reviews/myreviews", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const reviewsMap = new Map();
      res.data.forEach((review) => {
        reviewsMap.set(String(review.mentor), {
          rating: review.rating,
          comment: review.comment,
          reviewId: review._id,
        });
      });
      setUserReviews(reviewsMap);
    } catch (err) {
      console.error("Error fetching user's reviews:", err);
      toast.error("Failed to load your review history.");
      setUserReviews(new Map());
    }
  };

  // --- Effects ---

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const mentorsData = await fetchAllMentors();
      if (mentorsData.length > 0) {
        await fetchAllConnectionStatuses(mentorsData);
      }
      await fetchUserReviews();
      setLoading(false);
    };
    loadData();
  }, [token]);

  // --- Helper Functions ---

  const getMentorConnectionStatus = (mentorUserId) => {
    return connectionStatuses[mentorUserId] || "none";
  };

  // --- Handlers ---

  const handleRequest = async (mentorId) => {
    setConnectionStatuses((prev) => ({ ...prev, [mentorId]: "pending" }));
    try {
      if (!token) {
        toast.error("Please log in to send a connection request.");
        setConnectionStatuses((prev) => ({ ...prev, [mentorId]: "none" }));
        return;
      }
      const res = await api.post(
        "/mentors/request",
        { mentorId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success(
        res.data.message || "Connection request sent successfully!"
      );
      setConnectionStatuses((prev) => ({ ...prev, [mentorId]: "accepted" }));
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        "Failed to send request. Please try again.";
      toast.error(errorMessage);
      if (errorMessage.includes("already pending")) {
        setConnectionStatuses((prev) => ({ ...prev, [mentorId]: "pending" }));
      } else if (errorMessage.includes("already connected")) {
        setConnectionStatuses((prev) => ({ ...prev, [mentorId]: "accepted" }));
      } else {
        setConnectionStatuses((prev) => ({ ...prev, [mentorId]: "none" }));
      }
    }
  };

  const handleSubmitReview = async (mentorId) => {
    try {
      if (!token) {
        toast.error("Please log in to submit a review.");
        return;
      }

      const existingReview = userReviews.get(String(mentorId));
      let apiCall;
      let successMessage;

      if (existingReview && existingReview.reviewId) {
        apiCall = api.put(
          `/reviews/${existingReview.reviewId}`,
          {
            rating: ratingValue,
            comment: ratingComment,
          },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        successMessage = "Review updated successfully!";
      } else {
        apiCall = api.post(
          "/reviews",
          {
            mentorId,
            rating: ratingValue,
            comment: ratingComment,
          },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        successMessage = "Review submitted!";
      }

      const res = await apiCall;
      toast.success(successMessage);
      setOpenReviewMentorId(null);

      const updatedReviewData = {
        rating: ratingValue,
        comment: ratingComment,
        reviewId: existingReview ? existingReview.reviewId : res.data._id,
      };
      setUserReviews((prev) =>
        new Map(prev).set(String(mentorId), updatedReviewData)
      );

      // Optionally re-fetch all mentors to update their average ratings displayed
      // fetchAllMentors();
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Failed to submit or update review."
      );
    } finally {
      setRatingValue(5);
      setRatingComment("");
    }
  };

  // --- Loading State ---

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 flex items-center justify-center p-6">
        <div className="flex flex-col items-center text-gray-600">
          <svg
            className="animate-spin h-16 w-16 text-indigo-600 mb-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          <p className="text-2xl font-semibold text-indigo-700">
            Fetching amazing mentors...
          </p>
        </div>
      </div>
    );
  }

  // --- Render ---

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 p-6 sm:p-8 md:p-10 font-sans antialiased">
      <div className="max-w-7xl mx-auto bg-white rounded-3xl shadow-2xl p-6 sm:p-8 md:p-12 border border-gray-200">
        <h2 className="text-5xl font-extrabold text-gray-900 mb-12 text-center tracking-tight leading-tight">
          Discover Your <span className="text-indigo-600">Next Mentor</span>
        </h2>

        {mentors.length === 0 ? (
          <div className="text-center py-20 bg-gray-50 rounded-xl shadow-inner border border-dashed border-gray-300">
            <p className="text-2xl text-gray-500 font-medium">
              No mentors are available at the moment. Please check back later!
            </p>
            <p className="text-md text-gray-400 mt-2">
              We're constantly expanding our network.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8 xl:gap-10">
            {mentors.map((mentor) => {
              const currentStatus = getMentorConnectionStatus(mentor.user._id);
              const isConnected = currentStatus === "accepted";
              const isPending = currentStatus === "pending";
              const existingReview = userReviews.get(String(mentor._id));
              const hasReviewed = !!existingReview;

              return (
                <div
                  key={mentor._id}
                  className="bg-white rounded-2xl shadow-lg p-6 flex flex-col items-center text-center transition-all duration-300 ease-in-out hover:shadow-xl hover:scale-[1.01] hover:bg-gradient-to-br from-white to-blue-50 border border-gray-100"
                >
                  <div className="flex items-start w-full mb-4">
                    <div className="relative mr-4 group flex-shrink-0">
                      <img
                        src={
                          mentor.user.profilePic ||
                          `https://ui-avatars.com/?name=${encodeURIComponent(
                            mentor.user.name
                          )}&background=818cf8&color=fff&size=96&bold=true`
                        }
                        alt={`Profile picture of ${mentor.user.name}`}
                        className="w-24 h-24 rounded-full object-cover border-4 border-indigo-500 group-hover:border-purple-600 transition-colors duration-300 shadow-md"
                      />
                      <div className="absolute inset-0 rounded-full ring-2 ring-transparent group-hover:ring-indigo-300 group-hover:ring-offset-2 transition-all duration-300"></div>
                    </div>

                    <div className="flex flex-col items-start text-left flex-grow">
                      <h3 className="text-2xl font-bold text-gray-900 mb-1">
                        {mentor.user.name}
                      </h3>

                      {mentor.averageRating !== undefined &&
                      mentor.numberOfReviews > 0 ? (
                        <div className="flex items-center text-yellow-500 text-sm">
                          <svg
                            className="w-5 h-5 mr-1"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.538 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.783.57-1.838-.197-1.538-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.92 8.729c-.783-.57-.38-1.81.588-1.81h3.462a1 1 0 00.95-.69l1.07-3.292z"></path>
                          </svg>
                          <span className="text-gray-700 font-semibold mr-1">
                            {mentor.averageRating.toFixed(1)}
                          </span>
                          <span className="text-gray-500 text-xs">
                            ({mentor.numberOfReviews} review
                            {mentor.numberOfReviews !== 1 && "s"})
                          </span>
                        </div>
                      ) : (
                        <p className="text-sm text-gray-400 italic">
                          No ratings yet
                        </p>
                      )}
                      <p className="text-base text-gray-600 mb-1 font-medium">
                        {mentor.branch} student at{" "}
                        <span className="text-indigo-600 font-semibold">
                          {mentor.college}
                        </span>
                      </p>
                    </div>
                  </div>

                  <p className="text-gray-700 text-sm mb-4 w-full text-left flex-grow line-clamp-3 leading-relaxed">
                    {mentor.bio || (
                      <span className="italic text-gray-400">
                        This mentor hasn't provided a bio yet.
                      </span>
                    )}
                  </p>

                  {mentor.skills && mentor.skills.length > 0 && (
                    <div className="mb-6 flex flex-wrap justify-start gap-2 w-full">
                      {mentor.skills.map((skill, index) => (
                        <span
                          key={index}
                          className="bg-indigo-50 text-indigo-700 text-xs font-semibold px-3 py-1 rounded-full border border-indigo-200 shadow-sm"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="w-full mt-auto flex flex-col items-center">
                    {isConnected ? (
                      <>
                        <div className="flex gap-4 w-full">
                          <span className="flex-1 bg-green-100 text-green-800 text-sm font-medium px-4 py-1.5 rounded-full shadow-md flex items-center justify-center">
                            <i className="fas fa-check-circle mr-2"></i>
                            Connected
                          </span>

                          {hasReviewed ? (
                            <button
                              onClick={() => {
                                setOpenReviewMentorId(mentor._id);
                                setRatingValue(existingReview.rating);
                                setRatingComment(existingReview.comment);
                              }}
                              className="flex-1 bg-yellow-500 text-white py-2.5 px-4 rounded-full font-semibold text-lg shadow-md hover:bg-yellow-600 transition-colors duration-200 focus:outline-none focus:ring-4 focus:ring-yellow-300 focus:ring-opacity-75 flex items-center justify-center"
                            >
                              <i className="fas fa-edit mr-2"></i> Edit Rating
                            </button>
                          ) : (
                            <button
                              onClick={() => {
                                setOpenReviewMentorId(mentor._id);
                                setRatingValue(5);
                                setRatingComment("");
                              }}
                              className="flex-1 bg-yellow-500 text-white py-2.5 px-4 rounded-full font-semibold text-lg shadow-md hover:bg-yellow-600 transition-colors duration-200 focus:outline-none focus:ring-4 focus:ring-yellow-300 focus:ring-opacity-75 flex items-center justify-center"
                            >
                              <i className="fas fa-star mr-2"></i> Give Rating
                            </button>
                          )}
                        </div>

                        {/* Review form remains unchanged */}
                        {openReviewMentorId === mentor._id && (
                          <div className="w-full bg-indigo-50 p-4 rounded-xl shadow-inner mt-3">
                            <div className="mb-3">
                              <label className="block text-sm font-medium mb-1 text-gray-700 text-left">
                                Rating:
                              </label>
                              <div className="flex items-center justify-center space-x-1 mb-2">
                                {[1, 2, 3, 4, 5].map((star) => (
                                  <i
                                    key={star}
                                    className={`fas fa-star text-3xl cursor-pointer transition-colors duration-150 ${
                                      star <= ratingValue
                                        ? "text-yellow-500"
                                        : "text-gray-300 hover:text-yellow-400"
                                    }`}
                                    onClick={() => setRatingValue(star)}
                                    title={`${star} Star${star > 1 ? "s" : ""}`}
                                  ></i>
                                ))}
                              </div>
                              <p className="text-center text-sm text-gray-600">
                                Current Rating:{" "}
                                <span className="font-semibold text-indigo-700">
                                  {ratingValue}
                                </span>{" "}
                                Stars
                              </p>
                            </div>
                            <textarea
                              placeholder="Share your feedback (optional)..."
                              value={ratingComment}
                              onChange={(e) => setRatingComment(e.target.value)}
                              rows={3}
                              className="w-full border border-gray-300 rounded-md px-3 py-2 text-gray-800 mb-3 focus:ring-indigo-500 focus:border-indigo-500 outline-none resize-y"
                            />
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleSubmitReview(mentor._id)}
                                className="flex-1 bg-indigo-600 text-white py-2.5 px-4 rounded-lg font-semibold hover:bg-indigo-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 text-sm"
                              >
                                {hasReviewed
                                  ? "Update Review"
                                  : "Submit Review"}
                              </button>
                              <button
                                onClick={() => {
                                  setOpenReviewMentorId(null);
                                  setRatingValue(5);
                                  setRatingComment("");
                                }}
                                className="flex-1 bg-gray-200 text-gray-800 py-2.5 px-4 rounded-lg font-semibold hover:bg-gray-300 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400 text-sm"
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        )}
                      </>
                    ) : (
                      <button
                        onClick={() => handleRequest(mentor.user._id)}
                        disabled={isPending || !token}
                        className={`w-full px-4 py-2.5 rounded-full font-semibold text-lg shadow-md transition-all duration-200 ease-in-out flex items-center justify-center
                ${
                  !token
                    ? "bg-gray-400 text-gray-700 cursor-not-allowed" // Login required state
                    : isPending // ⭐ ENHANCED STYLES FOR PENDING STATE ⭐
                    ? "bg-sky-50 text-sky-700 cursor-not-allowed border border-sky-300" // Light blue background, darker text, and a border
                    : "bg-indigo-600 text-white hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-300 focus:ring-opacity-75" // Default send request
                }`}
                      >
                        {!token ? (
                          <>
                            <i className="fas fa-sign-in-alt mr-2"></i> Login to
                            Connect
                          </>
                        ) : isPending ? (
                          <span className="flex items-center justify-center">
                            <i className="fas fa-hourglass-half mr-2 animate-pulse"></i>{" "}
                            Request Sent{" "}
                            {/* Changed icon and added animate-pulse */}
                          </span>
                        ) : (
                          <>
                            <i className="fas fa-user-plus mr-2"></i> Send
                            Connection Request
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Mentorship;
