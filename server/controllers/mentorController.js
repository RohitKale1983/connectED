const Mentor = require("../models/mentorModel");

const applyMentor = async (req, res) => {
  try {
    const existing = await Mentor.findOne({ user: req.user._id });
    if (existing) {
      return res.status(400).json({ message: "You have already applied to be a mentor." });
    }

    const newMentor = new Mentor({
      user: req.user._id,
      expertise: req.body.expertise,
      experience: req.body.experience,
      availability: req.body.availability,
      bio: req.body.bio,
    });

    await newMentor.save();

    res.status(201).json({ message: "Mentor application submitted successfully!", user: req.user });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

module.exports = { applyMentor };
