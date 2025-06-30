// controllers/backlogController.js - FULL UPDATED
const BacklogPost = require("../models/BacklogPost");
const Reply = require("../models/replyModel"); // Import the Reply model
const Notification = require("../models/notificationModel"); // Assuming this is correct and updated

// Helper to get user details for notification data
// (This would typically come from req.user, but adding it for clarity if needed)
// function getUserDetails(userObject) {
//     return {
//         _id: userObject._id,
//         name: userObject.name || 'Anonymous' // Ensure 'name' exists on User model
//     };
// }

exports.createPost = async (req, res) => {
    try {
        const { title, description } = req.body;
        const post = new BacklogPost({
            title,
            description,
            createdBy: req.user.id,
        });
        await post.save();
        // Populate createdBy for the response, so frontend immediately has user name
        await post.populate("createdBy", "name");
        res.status(201).json(post);
    } catch (err) {
        console.error("Error creating post:", err);
        res.status(500).json({ error: err.message });
    }
};

// Modified: No longer populating embedded replies, as replies are now in a separate collection.
exports.getAllPosts = async (req, res) => {
    try {
        const posts = await BacklogPost.find()
            .populate("createdBy", "name") // Populate user name for the post creator
            .sort({ createdAt: -1 }); // Latest posts first
        res.json(posts);
    } catch (err) {
        console.error("Error getting all posts:", err);
        res.status(500).json({ error: err.message });
    }
};

// Modified: No longer populating embedded replies.
exports.getMyPosts = async (req, res) => {
    try {
        const posts = await BacklogPost.find({ createdBy: req.user.id })
            .populate("createdBy", "name")
            .sort({ createdAt: -1 });
        res.json(posts);
    } catch (err) {
        console.error("Error getting my posts:", err);
        res.status(500).json({ error: err.message });
    }
};

// NEW: Get all replies for a specific post (including nested replies, client-side will tree them)
exports.getRepliesForPost = async (req, res) => {
    try {
        const { postId } = req.params;
        const replies = await Reply.find({ postId: postId }) // Find all replies associated with this post
            .populate("repliedBy", "name") // Populate user name for who replied
            .sort({ createdAt: 1 }); // Sort by creation time to maintain consistent order for tree building

        res.json(replies);
    } catch (err) {
        console.error("Error getting replies for post:", err);
        res.status(500).json({ error: err.message });
    }
};

// NEW: Add a top-level reply directly to a BacklogPost
exports.addPostReply = async (req, res) => {
    try {
        const { postId } = req.params;
        const { text } = req.body;

        // Ensure the post exists
        const post = await BacklogPost.findById(postId);
        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        // Create the new reply document
        const newReply = new Reply({
            postId: postId,
            text,
            repliedBy: req.user.id,
            parentReply: null, // This signifies a top-level reply to a post
        });
        const savedReply = await newReply.save();
        // Populate the repliedBy field for the immediate response to the client
        await savedReply.populate('repliedBy', 'name');

        // Send notification to the post creator if it's not their own reply
        if (post.createdBy.toString() !== req.user.id.toString()) {
            await Notification.create({
                userId: post.createdBy,
                type: 'reply', // Use the 'reply' enum type
                link: `/backlogs`, // Link to the backlog page, or more specifically to the post if you have a detail page
                data: { // Pass data for the pre-save hook to generate message
                    replierId: req.user.id,
                    replierName: savedReply.repliedBy.name, // Use populated name
                    postTitle: post.title
                }
            });
        }

        res.status(201).json(savedReply); // Send back the newly created reply
    } catch (err) {
        console.error("Error adding post reply:", err);
        // Ensure error response matches frontend expectation
        res.status(500).json({ message: "Server error during post reply.", error: err.message });
    }
};

// NEW: Add a nested reply (reply to an existing reply)
exports.addNestedReply = async (req, res) => {
    try {
        const { parentReplyId } = req.params;
        const { text } = req.body;

        // Find the parent reply
        const parentReply = await Reply.findById(parentReplyId).populate('repliedBy', 'name'); // Populate parent's replier for notification
        if (!parentReply) {
            return res.status(404).json({ message: "Parent reply not found" });
        }

        // Find the original post associated with the parent reply
        const post = await BacklogPost.findById(parentReply.postId);
        if (!post) {
            return res.status(404).json({ message: "Original post for reply not found" });
        }

        // Create the new nested reply document
        const newReply = new Reply({
            postId: parentReply.postId, // Link to the original post ID
            parentReply: parentReplyId, // Link to the direct parent reply
            text,
            repliedBy: req.user.id,
        });
        const savedReply = await newReply.save();
        // Populate the repliedBy field for the immediate response to the client
        await savedReply.populate('repliedBy', 'name');

        // Notification for the original post creator (if not self and they didn't author the parent comment)
        if (post.createdBy.toString() !== req.user.id.toString() && post.createdBy.toString() !== parentReply.repliedBy._id.toString()) {
            await Notification.create({
                userId: post.createdBy,
                type: 'nested_reply_on_post', // Using the new enum type
                link: `/backlogs`, // Link to the backlog page, or more specifically to the post
                data: {
                    replierId: req.user.id,
                    replierName: savedReply.repliedBy.name,
                    postTitle: post.title,
                    parentCommentText: parentReply.text.substring(0, 50) + '...' // Truncate parent comment text for context
                }
            });
        }

        // Notification for the parent reply's author (if not self and not the original post creator)
        if (parentReply.repliedBy._id.toString() !== req.user.id.toString() && parentReply.repliedBy._id.toString() !== post.createdBy.toString()) {
            await Notification.create({
                userId: parentReply.repliedBy._id,
                type: 'nested_reply_on_comment', // Using the new enum type
                link: `/backlogs`, // Link to the backlog page, or more specifically to the post
                data: {
                    replierId: req.user.id,
                    replierName: savedReply.repliedBy.name,
                    commentText: parentReply.text.substring(0, 50) + '...', // Truncate comment text for context
                    postTitle: post.title
                }
            });
        }

        res.status(201).json(savedReply); // Send back the newly created reply
    } catch (err) {
        console.error("Error adding nested reply:", err);
        // Ensure error response matches frontend expectation
        res.status(500).json({ message: "Server error during nested reply.", error: err.message });
    }
};

// Existing upvotePost function
exports.upvotePost = async (req, res) => {
    try {
        const post = await BacklogPost.findById(req.params.id);
        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        const userId = req.user.id.toString(); // Ensure consistency by converting to string
        const index = post.upvotes.map(id => id.toString()).indexOf(userId); // Convert to string for comparison

        if (index === -1) {
            // User hasn't upvoted, add upvote
            post.upvotes.push(userId);
        } else {
            // User has upvoted, remove upvote
            post.upvotes.splice(index, 1);
        }

        await post.save();
        res.json(post.upvotes); // Return the updated upvotes array
    } catch (err) {
        console.error("Error upvoting post:", err);
        res.status(500).json({ error: err.message });
    }
};
