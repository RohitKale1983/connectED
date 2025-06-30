// server/models/CareerRoadmapModel.js
const mongoose = require('mongoose');

const CareerRoadmapSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  careerName: {
    type: String,
    required: true,
    trim: true,
  },
  roadmapData: [
    {
      year: {
        type: String,
        required: true,
        trim: true,
      },
      description: {
        type: String,
        trim: true,
      },
      // ⭐ MODIFIED: Goals now an array of objects to track completion ⭐
      goals: [
        {
          text: { type: String, required: true },
          completed: { type: Boolean, default: false }, // ⭐ NEW FIELD
        },
      ],
      // ⭐ MODIFIED: Projects now an array of objects to track completion ⭐
      projects: [
        {
          text: { type: String, required: true },
          completed: { type: Boolean, default: false }, // ⭐ NEW FIELD
        },
      ],
      internships: {
        type: String,
        trim: true,
      },
      // ⭐ MODIFIED: Certifications now an array of objects to track completion ⭐
      certifications: [
        {
          text: { type: String, required: true },
          completed: { type: Boolean, default: false }, // ⭐ NEW FIELD
        },
      ],
      networking: {
        type: String,
        trim: true,
      },
      userNotes: { // ⭐ NEW FIELD: For user's personal notes on this year
        type: String,
        trim: true,
        default: '',
      },
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
}, { timestamps: true });

const CareerRoadmap = mongoose.model('CareerRoadmap', CareerRoadmapSchema);

module.exports = CareerRoadmap;