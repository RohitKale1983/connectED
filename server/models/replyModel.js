const mongoose = require("mongoose");

const replySchema = new mongoose.Schema({
    postId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "BacklogPost",
        required: true,
    },
    parentReply: { // This field enables nesting!
        type: mongoose.Schema.Types.ObjectId,
        ref: "Reply", // References another Reply document
        default: null, // Null for top-level replies to a post
    },
    text: {
        type: String,
        required: true,
    },
    repliedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
}, { timestamps: true });

module.exports = mongoose.model("Reply", replySchema);