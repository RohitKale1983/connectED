const mongoose = require("mongoose");

const mentorSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    college: {
      type: String,
      required: true,
    },
    branch: {
      type: String,
      required: true,
    },
    bio: {
      type: String,
      required: true,
    },
    profilePic: {
      type: String,
      default: "",
    },
    skills: [
      {
        type: String,
      },
    ],
    // REMOVE or RENAME this 'rating' field if it's not used for something else.
    // rating: {
    //   type: Number,
    //   default: 0,
    // },
    // ADD these two new fields for storing aggregate rating data
    averageRating: {
      type: Number,
      default: 0,
    },
    numberOfReviews: {
      type: Number,
      default: 0,
    },
    connections: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Mentor", mentorSchema);