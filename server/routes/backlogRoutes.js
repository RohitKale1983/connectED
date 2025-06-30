// routes/backlogRoutes.js - UPDATED
const express = require("express");
const {
    createPost,
    getAllPosts,
    getMyPosts,
    // replyToPost, // Removed: replaced by addPostReply and addNestedReply
    upvotePost,
    getRepliesForPost, // New
    addPostReply,      // New
    addNestedReply,    // New
} = require("../controllers/backlogController");
const requireSignIn = require("../middleware/authMiddleware");
const Notification = require("../models/notificationModel"); // No direct usage here, but good it's imported in controller
const BacklogPost = require("../models/BacklogPost"); // Not directly used in routes, but good for context

const router = express.Router();

router.post("/", requireSignIn, createPost);

router.get("/", requireSignIn, getAllPosts);

router.get("/me", requireSignIn, getMyPosts);

// NEW: Get replies for a specific post
router.get("/:postId/replies", requireSignIn, getRepliesForPost);

// NEW: Route to add a top-level reply to a post
router.post("/:postId/replies", requireSignIn, addPostReply);

// NEW: Route to add a nested reply (reply to an existing reply)
router.post("/reply/:parentReplyId/replies", requireSignIn, addNestedReply);

router.post("/upvote/:id", requireSignIn, upvotePost);

module.exports = router;