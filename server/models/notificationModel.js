// models/notificationModel.js - UPDATED
const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        message: {
            type: String,
            required: false, // Make message optional as 'data' can convey enough info
        },
        isRead: {
            type: Boolean,
            default: false,
        },
        type: {
            type: String,
            // 💡 IMPORTANT CHANGE: Add the new notification types to the enum
            enum: [
                "general",
                "message",
                "connectionRequest",      // For when a user sends a request to a mentor
                "connectionAccepted",     // For when a mentor accepts a user's request
                "connectionRejected",     // For when a mentor rejects a user's request
                "postReply",              // Existing or planned type for top-level post replies
                "reply",                  // NEW: Alias or replacement for postReply (if you prefer 'reply')
                "nested_reply_on_post",   // NEW: For replies on comments on a user's post
                "nested_reply_on_comment" // NEW: For replies directly to a user's comment
            ],
            default: "general",
        },
        data: {
            // Make 'data' a more flexible Mixed type to store varying information
            // based on the 'type' of notification.
            type: mongoose.Schema.Types.Mixed,
            required: false, // Data might not be needed for all 'general' notifications
        },
    },
    { timestamps: true }
);

// Pre-save hook to ensure 'message' is generated if missing for specific types
// This is optional but can help ensure a message is always present if preferred.
notificationSchema.pre('save', function(next) {
    if (this.isNew && !this.message) {
        switch (this.type) {
            case 'connectionRequest':
                if (this.data && this.data.senderId && this.data.senderId.name) {
                    this.message = `${this.data.senderId.name} sent you a connection request.`;
                } else {
                    this.message = 'You received a new connection request.';
                }
                break;
            case 'connectionAccepted':
                if (this.data && this.data.acceptorId && this.data.acceptorId.name) {
                    this.message = `${this.data.acceptorId.name} accepted your connection request.`;
                } else {
                    this.message = 'Your connection request has been accepted.';
                }
                break;
            case 'connectionRejected':
                if (this.data && this.data.rejectorId && this.data.rejectorId.name) {
                    this.message = `${this.data.rejectorId.name} rejected your connection request.`;
                } else {
                    this.message = 'Your connection request has been rejected.';
                }
                break;
            case 'message':
                if (this.data && this.data.senderId && this.data.senderId.name) {
                    this.message = `${this.data.senderId.name} sent you a message.`;
                } else {
                    this.message = 'You received a new message.';
                }
                break;
            // NEW cases for replies - ensure messages are generated if not provided
            case 'reply': // For top-level replies to posts
                if (this.data && this.data.replierName && this.data.postTitle) {
                    this.message = `📬 ${this.data.replierName} replied to your request: "${this.data.postTitle}"`;
                } else {
                    this.message = '📬 New reply on your backlog post.';
                }
                break;
            case 'nested_reply_on_post': // For replies on comments on a user's post
                if (this.data && this.data.postTitle) {
                    this.message = `💬 Someone replied to a comment on your post: "${this.data.postTitle}"`;
                } else {
                    this.message = '💬 New nested reply on your post.';
                }
                break;
            case 'nested_reply_on_comment': // For replies directly to a user's comment
                if (this.data && this.data.commentText) {
                    this.message = `➡️ New reply to your comment: "${this.data.commentText.substring(0, 30)}..."`;
                } else {
                    this.message = '➡️ Someone replied to your comment.';
                }
                break;
            // You might want to remove 'postReply' if 'reply' is its direct replacement
            // Or keep both if they signify different things for other parts of your app.
            case 'postReply': // Keeping it as it was in your original enum
                if (this.data && this.data.replierId && this.data.replierId.name) {
                    this.message = `${this.data.replierId.name} replied to your post.`;
                } else {
                    this.message = 'Someone replied to your post.';
                }
                break;
            default:
                // No default message generation for 'general' or other types if not explicitly handled
                break;
        }
    }
    next();
});

module.exports = mongoose.model("Notification", notificationSchema);