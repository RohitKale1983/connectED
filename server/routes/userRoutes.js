const express = require("express");
const { getProfile, updateProfile } = require("../controllers/userController");
const requireSignIn = require("../middleware/authMiddleware");

const router = express.Router();

// GET logged-in user's profile
router.get("/profile", requireSignIn, getProfile);

// PUT update logged-in user's profile
router.put("/profile", requireSignIn, updateProfile);

module.exports = router;
