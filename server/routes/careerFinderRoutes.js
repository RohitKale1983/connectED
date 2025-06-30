// server/routes/careerFinderRoutes.js
const express = require('express');
const router = express.Router();
const requireSignIn = require('../middleware/authMiddleware');
const { generateCareerSuggestions, generateCareerRoadmap } = require('../utils/geminiAI');
const CareerRoadmap = require('../models/CareerRoadmapModel'); // Import your model

// ⭐ 1. Route for generating career suggestions (POST /api/career-finder/suggest) ⭐
router.post('/suggest', requireSignIn, async (req, res) => {
  try {
    const userData = req.body;
    const suggestions = await generateCareerSuggestions(userData);
    res.status(200).json({
      message: "Career suggestions generated successfully!",
      suggestions: suggestions
    });
  } catch (err) {
    console.error("Error generating career suggestions:", err);
    res.status(500).json({ message: "Failed to generate career suggestions.", error: err.message });
  }
});

// ⭐ 2. Route for generating a specific career roadmap (POST /api/career-finder/roadmap) ⭐
router.post('/roadmap', requireSignIn, async (req, res) => {
  try {
    const { selectedCareerName, userData } = req.body;
    if (!selectedCareerName || !userData) {
      return res.status(400).json({ message: "Missing selected career name or user data for roadmap generation." });
    }
    const roadmap = await generateCareerRoadmap(selectedCareerName, userData);
    res.status(200).json({
      message: `Roadmap for ${selectedCareerName} generated successfully!`,
      roadmap: roadmap
    });
  } catch (err) {
    console.error("Error generating career roadmap:", err);
    res.status(500).json({ message: "Failed to generate career roadmap.", error: err.message });
  }
});

// ⭐ 3. Route to save a generated career roadmap (POST /api/career-finder/save-roadmap) ⭐
router.post('/save-roadmap', requireSignIn, async (req, res) => {
  try {
    const userId = req.user._id;
    const { careerName, roadmapData } = req.body;

    if (!careerName || !roadmapData || !Array.isArray(roadmapData) || roadmapData.length === 0) {
      return res.status(400).json({ message: "Missing or invalid roadmap data." });
    }

    const newRoadmap = new CareerRoadmap({
      userId: userId,
      careerName: careerName,
      roadmapData: roadmapData,
    });

    await newRoadmap.save();

    res.status(201).json({
      success: true,
      message: "Roadmap saved successfully!",
      roadmap: newRoadmap,
    });

  } catch (err) {
    console.error("Error saving career roadmap:", err);
    if (err.code === 11000) {
        return res.status(409).json({ message: "This roadmap has already been saved for this user." });
    }
    res.status(500).json({ message: "Failed to save career roadmap.", error: err.message });
  }
});

// ⭐ 4. Route to get all saved roadmaps for the authenticated user (GET /api/career-finder/my-roadmaps) ⭐
router.get('/my-roadmaps', requireSignIn, async (req, res) => {
  try {
    const userId = req.user._id;
    // Find all roadmaps belonging to the authenticated user, sort by latest saved
    const roadmaps = await CareerRoadmap.find({ userId: userId }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      message: "User roadmaps retrieved successfully!",
      roadmaps: roadmaps,
    });

  } catch (err) {
    console.error("Error retrieving user roadmaps:", err);
    res.status(500).json({ message: "Failed to retrieve user roadmaps.", error: err.message });
  }
});

// ⭐ 5. Route to delete a specific saved roadmap (DELETE /api/career-finder/delete-roadmap/:id) ⭐
router.delete('/delete-roadmap/:id', requireSignIn, async (req, res) => {
  try {
    const roadmapId = req.params.id; // Get the roadmap ID from the URL parameters
    const userId = req.user._id; // Get the ID of the authenticated user

    // Find the roadmap and ensure it belongs to the authenticated user before deleting
    const deletedRoadmap = await CareerRoadmap.findOneAndDelete({ _id: roadmapId, userId: userId });

    if (!deletedRoadmap) {
      // If no roadmap found or it doesn't belong to the user
      return res.status(404).json({ message: "Roadmap not found or you don't have permission to delete it." });
    }

    res.status(200).json({
      success: true,
      message: "Roadmap deleted successfully!",
      deletedRoadmapId: roadmapId,
    });

  } catch (err) {
    console.error("Error deleting career roadmap:", err);
    res.status(500).json({ message: "Failed to delete career roadmap.", error: err.message });
  }
});

// ⭐ 6. Route to update a specific item (goal/project/certification) completion status (PUT /api/career-finder/roadmap/update-item-status/:roadmapId) ⭐
router.put('/roadmap/update-item-status/:roadmapId', requireSignIn, async (req, res) => {
  try {
    const { roadmapId } = req.params;
    const userId = req.user._id;
    const { yearIndex, itemType, itemIndex, completed } = req.body;

    // Validate input
    if (yearIndex === undefined || itemType === undefined || itemIndex === undefined || completed === undefined) {
      return res.status(400).json({ message: "Missing required fields for item status update." });
    }
    if (!['goals', 'projects', 'certifications'].includes(itemType)) {
      return res.status(400).json({ message: "Invalid item type specified." });
    }

    const roadmap = await CareerRoadmap.findOne({ _id: roadmapId, userId: userId });

    if (!roadmap) {
      return res.status(404).json({ message: "Roadmap not found or you don't have permission to modify it." });
    }

    // Safely access the target item
    if (roadmap.roadmapData[yearIndex] && roadmap.roadmapData[yearIndex][itemType] && roadmap.roadmapData[yearIndex][itemType][itemIndex]) {
      roadmap.roadmapData[yearIndex][itemType][itemIndex].completed = completed;
      roadmap.updatedAt = Date.now(); // Manually update updatedAt as direct subdocument modification might not trigger it

      await roadmap.save();
      res.status(200).json({
        success: true,
        message: "Item completion status updated successfully!",
        updatedRoadmap: roadmap,
      });
    } else {
      return res.status(404).json({ message: "Item not found within the specified roadmap." });
    }

  } catch (err) {
    console.error("Error updating roadmap item status:", err);
    res.status(500).json({ message: "Failed to update item status.", error: err.message });
  }
});

// ⭐ 7. Route to update user notes for a specific year in a roadmap (PUT /api/career-finder/roadmap/update-notes/:roadmapId) ⭐
router.put('/roadmap/update-notes/:roadmapId', requireSignIn, async (req, res) => {
  try {
    const { roadmapId } = req.params;
    const userId = req.user._id;
    const { yearIndex, userNotes } = req.body;

    // Validate input
    if (yearIndex === undefined || userNotes === undefined) {
      return res.status(400).json({ message: "Missing required fields for notes update." });
    }

    const roadmap = await CareerRoadmap.findOne({ _id: roadmapId, userId: userId });

    if (!roadmap) {
      return res.status(404).json({ message: "Roadmap not found or you don't have permission to modify it." });
    }

    // Safely access the target year
    if (roadmap.roadmapData[yearIndex]) {
      roadmap.roadmapData[yearIndex].userNotes = userNotes;
      roadmap.updatedAt = Date.now(); // Manually update updatedAt

      await roadmap.save();
      res.status(200).json({
        success: true,
        message: "User notes updated successfully!",
        updatedRoadmap: roadmap,
      });
    } else {
      return res.status(404).json({ message: "Year not found within the specified roadmap." });
    }

  } catch (err) {
    console.error("Error updating roadmap user notes:", err);
    res.status(500).json({ message: "Failed to update user notes.", error: err.message });
  }
});


module.exports = router;