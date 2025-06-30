const express = require("express");
const requireSignIn = require("../middleware/authMiddleware");
const Message = require("../models/messageModel");
const multer = require("multer");

const router = express.Router();

// ✅ Get all messages between logged-in user and receiver
router.get("/:receiverId", requireSignIn, async (req, res) => {
  try {
    const messages = await Message.find({
      $or: [
        { sender: req.user._id, receiver: req.params.receiverId },
        { sender: req.params.receiverId, receiver: req.user._id },
      ],
    }).sort("createdAt");

    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: "Failed to load messages" });
  }
});

router.put("/delete/:id", requireSignIn, async (req, res) => {
  try {
    const message = await Message.findById(req.params.id);
    if (!message) return res.status(404).json({ message: "Message not found" });

    if (message.sender.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    message.deleted = true;
    await message.save();

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});



module.exports = router;
