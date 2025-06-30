const express = require("express");
const requireSignIn = require("../middleware/authMiddleware");
const Mentor = require("../models/mentorModel");
const User = require("../models/userModel");
const ConnectionRequest = require("../models/connectionRequestModel");
const Notification = require("../models/notificationModel");

const router = express.Router();

// ✅ Check if user is a mentor
router.get("/check", requireSignIn, async (req, res) => {
  try {
    const mentor = await Mentor.findOne({ user: req.user._id });
    res.json({ isMentor: !!mentor });
  } catch (err) {
    console.error("Mentor check error:", err);
    res.status(500).json({ message: "Error checking mentor status" });
  }
});

// ✅ Get all mentors
router.get("/all", async (req, res) => {
  try {
    const mentors = await Mentor.find()
      .populate("user", "name email profilePic")
      .sort({ createdAt: -1 });
    res.json(mentors);
  } catch (err) {
    console.error("Error fetching mentors:", err);
    res.status(500).json({ message: "Failed to fetch mentors" });
  }
});

// ✅ Send connection request
router.post("/request", requireSignIn, async (req, res) => {
  try {
    const { mentorId } = req.body;

    // Get sender and receiver details for notification data
    const senderUser = await User.findById(req.user._id).select("name"); // Get sender's name
    const receiverUser = await User.findById(mentorId).select("name"); // Get receiver's name

    if (!senderUser || !receiverUser) {
      return res.status(404).json({ message: "Sender or Receiver not found." });
    }

    // 💡 IMPORTANT CHANGE HERE: Check for existing PENDING or ACCEPTED requests
    const existing = await ConnectionRequest.findOne({
      sender: req.user._id,
      receiver: mentorId,
      status: { $in: ["pending", "accepted"] }, // Only block if a pending or accepted request exists
    });

    if (existing) {
      // If an active (pending or accepted) request already exists
      if (existing.status === "pending") {
        return res.status(400).json({ message: "Connection request already pending." });
      } else if (existing.status === "accepted") {
        return res.status(400).json({ message: "You are already connected with this mentor." });
      }
    }

    // If no pending/accepted request exists, create a new one
    const request = new ConnectionRequest({
      sender: req.user._id,
      receiver: mentorId,
      status: "pending", // Ensure new requests are always pending
    });

    await request.save();

    // Create Notification for the mentor (receiver)
    await Notification.create({
      userId: mentorId,
      type: "connectionRequest",
      message: `${senderUser.name} sent you a connection request.`,
      data: {
        senderId: senderUser._id,
      },
    });

    res.status(201).json({ message: "Connection request sent." });
  } catch (err) {
    console.error("Connection request error:", err);
    res.status(500).json({ message: "Failed to send request" });
  }
});

// ✅ View requests for mentors
router.get("/requests", requireSignIn, async (req, res) => {
  try {
    const mentor = await Mentor.findOne({ user: req.user._id });
    if (!mentor) {
      return res.status(403).json({ message: "Only mentors can view requests" });
    }

    const requests = await ConnectionRequest.find({ receiver: req.user._id })
      .populate("sender", "name profilePic email")
      .sort({ createdAt: -1 });

    res.json(requests);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch requests" });
  }
});

// ✅ Accept request
router.patch("/request/:id/accept", requireSignIn, async (req, res) => {
  try {
    const request = await ConnectionRequest.findById(req.params.id);
    if (!request || String(request.receiver) !== String(req.user._id)) {
      return res.status(403).json({ message: "Unauthorized or request not found" });
    }

    // Ensure the request is not already accepted/rejected
    if (request.status !== "pending") {
      return res.status(400).json({ message: "Request already handled." });
    }

    request.status = "accepted";
    await request.save();

    // Get acceptor and sender details for notification data
    const acceptorUser = await User.findById(req.user._id).select("name");
    const senderUser = await User.findById(request.sender).select("name");

    if (!acceptorUser || !senderUser) {
      console.error("Error fetching user data for accepted notification.");
    }

    // Create Notification for the sender (user who sent the request)
    await Notification.create({
      userId: request.sender,
      type: "connectionAccepted",
      message: `${acceptorUser ? acceptorUser.name : 'A mentor'} accepted your connection request.`,
      data: {
        acceptorId: acceptorUser._id,
      },
    });

    res.json({ message: "Connection accepted" });
  } catch (err) {
    console.error("Failed to accept request:", err);
    res.status(500).json({ message: "Failed to accept request" });
  }
});

// ✅ Reject request
router.patch("/request/:id/reject", requireSignIn, async (req, res) => {
  try {
    const request = await ConnectionRequest.findById(req.params.id);
    if (!request || String(request.receiver) !== String(req.user._id)) {
      return res.status(403).json({ message: "Unauthorized or request not found" });
    }

    // Ensure the request is not already accepted/rejected
    if (request.status !== "pending") {
      return res.status(400).json({ message: "Request already handled." });
    }

    request.status = "rejected";
    await request.save();

    // Get rejector and sender details for notification data
    const rejectorUser = await User.findById(req.user._id).select("name");
    const senderUser = await User.findById(request.sender).select("name");

    if (!rejectorUser || !senderUser) {
      console.error("Error fetching user data for rejected notification.");
    }

    // Create Notification for the sender (user who sent the request)
    await Notification.create({
      userId: request.sender,
      type: "connectionRejected",
      message: `${rejectorUser ? rejectorUser.name : 'A mentor'} rejected your connection request.`,
      data: {
        rejectorId: rejectorUser._id,
      },
    });

    res.json({ message: "Connection rejected" });
  } catch (err) {
    console.error("Failed to reject request:", err);
    res.status(500).json({ message: "Failed to reject request" });
  }
});

// ✅ Get connected users
router.get("/connected", requireSignIn, async (req, res) => {
  try {
    const connections = await ConnectionRequest.find({
      $or: [{ sender: req.user._id }, { receiver: req.user._id }],
      status: "accepted",
    }).populate("sender receiver", "name profilePic");

    const connectedUsers = connections.map((conn) =>
      String(conn.sender._id) === String(req.user._id) ? conn.receiver : conn.sender
    );

    res.json(connectedUsers);
  } catch (err) {
    res.status(500).json({ message: "Failed to load connections" });
  }
});

// ✅ Update mentor profile
router.put("/update", requireSignIn, async (req, res) => {
  try {
    const { name, profilePic, college, branch, bio, skills } = req.body;

    // Update User basic profile
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { name, profilePic },
      { new: true }
    );

    // Update Mentor profile
    const updatedMentor = await Mentor.findOneAndUpdate(
      { user: req.user._id },
      { bio, skills, college, branch },
      { new: true }
    ).populate("user");

    res.json({
      message: "Mentor profile updated successfully!",
      user: updatedUser,
      mentor: updatedMentor,
    });
  } catch (err) {
    console.error("❌ Profile update failed:", err);
    res.status(500).json({ message: "Failed to update profile" });
  }
});

// ✅ Become a mentor
router.post("/apply", requireSignIn, async (req, res) => {
  try {
    // Check if already a mentor
    const exists = await Mentor.findOne({ user: req.user._id });
    if (exists) {
      return res.status(400).json({ message: "You are already a mentor." });
    }

    const { bio, skills, college, branch } = req.body;

    const mentor = new Mentor({
      user: req.user._id,
      bio,
      skills,
      college,
      branch,
    });

    await mentor.save();

    res.status(201).json({ message: "You are now a mentor!", mentor });
  } catch (err) {
    console.error("Become mentor error:", err);
    res.status(500).json({ message: "Failed to become mentor" });
  }
});

// ✅ Get connection status for a specific mentor
router.get("/request/status/:mentorId", requireSignIn, async (req, res) => {
  try {
    const { mentorId } = req.params;
    const userId = req.user._id; // The logged-in user

    const request = await ConnectionRequest.findOne({
      $or: [
        { sender: userId, receiver: mentorId },
        { sender: mentorId, receiver: userId }, // In case the mentor sent a request to the user (less common for "send request" but good for full connection status)
      ],
    });

    if (request) {
      return res.json({ status: request.status });
    } else {
      return res.json({ status: "none" }); // No request found
    }
  } catch (err) {
    console.error("Error fetching connection status:", err);
    res.status(500).json({ message: "Server error fetching connection status" });
  }
});

module.exports = router;