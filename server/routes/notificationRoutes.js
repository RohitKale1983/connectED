const express = require("express");
const Notification = require("../models/notificationModel");
const requireSignIn = require("../middleware/authMiddleware");

const router = express.Router();

// ✅ Get all notifications for logged-in user
router.get("/", requireSignIn, async (req, res) => {
  try {
    const notifications = await Notification.find({ userId: req.user.id })
      .sort({ createdAt: -1 })
      .populate({
        path: "data.senderId", // This is the field we want to populate
        model: "User", // The model to use for population
        select: "name", // Only select the 'name' field from the User model
      });
    res.json(notifications);
  } catch (err) {
    console.error("Error fetching notifications:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ Mark all notifications as read
router.put("/mark-all-read", requireSignIn, async (req, res) => {
  try {
    await Notification.updateMany(
      { userId: req.user.id, isRead: false },
      { $set: { isRead: true } }
    );
    res.json({ message: "All notifications marked as read" });
  } catch (err) {
    console.error("Error marking notifications as read:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ Get unread notification count
router.get("/unread-count", requireSignIn, async (req, res) => {
  try {
    const count = await Notification.countDocuments({
      userId: req.user.id,
      isRead: false,
    });
    res.json({ count });
  } catch (err) {
    console.error("Error getting unread notification count:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ DELETE all read notifications for the user
router.delete("/clear-read", requireSignIn, async (req, res) => {
  try {
    await Notification.deleteMany({ userId: req.user.id, isRead: true });
    res.json({ message: "All read notifications cleared" });
  } catch (err) {
    console.error("Error clearing read notifications:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ Mark a single notification as read
router.patch("/:id/read", requireSignIn, async (req, res) => {
  try {
    const notification = await Notification.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id, isRead: false },
      { $set: { isRead: true } },
      { new: true } // Return the updated document
    );

    if (!notification) {
      // If notification not found or already read or not owned by user
      return res.status(404).json({ message: "Notification not found or already read." });
    }

    res.json({ message: "Notification marked as read", notification });
  } catch (err) {
    console.error("Error marking single notification as read:", err);
    res.status(500).json({ message: "Server error" });
  }
});


module.exports = router;
