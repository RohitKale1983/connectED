// src/routes/questionnaireRoutes.js
const express = require('express');
const router = express.Router();
const QuestionnaireOption = require('../models/questionnaireOptionModel');
const requireSignIn = require('../middleware/authMiddleware'); // Assuming you have this middleware

// Route to get all questionnaire options (branches, skills, etc.)
router.get('/options', async (req, res) => {
  try {
    const options = await QuestionnaireOption.find({});
    const formattedOptions = options.reduce((acc, item) => {
      acc[item.type] = item.options;
      return acc;
    }, {});
    res.json(formattedOptions);
  } catch (err) {
    console.error("Error fetching questionnaire options:", err);
    res.status(500).json({ message: "Server error fetching options.", error: err.message });
  }
});

// ⭐ NEW: Route to submit full questionnaire data ⭐
router.post('/submit', requireSignIn, async (req, res) => {
  try {
    const { branch, year, skills, workType, workSetting, salaryRange } = req.body;
    const userId = req.user._id; // Get user ID from middleware

    // Log the data for now. In future steps, we'll store it and call the AI.
    console.log(`Received questionnaire submission from user ${userId}:`);
    console.log({ branch, year, skills, workType, workSetting, salaryRange });

    // You would typically save this data to a user-specific document or a dedicated
    // questionnaire response model here. For this step, logging is enough.

    res.status(200).json({
      message: "Questionnaire data received successfully!",
      data: { branch, year, skills, workType, workSetting, salaryRange }
    });

  } catch (err) {
    console.error("Error submitting questionnaire:", err);
    res.status(500).json({ message: "Server error submitting questionnaire.", error: err.message });
  }
});

module.exports = router;