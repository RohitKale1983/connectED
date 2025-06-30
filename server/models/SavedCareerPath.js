const mongoose = require("mongoose");

const savedCareerPathSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    careerPath: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CareerPath",
      required: true,
    },
    savedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("SavedCareerPath", savedCareerPathSchema);
