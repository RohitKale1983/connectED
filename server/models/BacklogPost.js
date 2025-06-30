const mongoose = require("mongoose");

const backlogPostSchema = new mongoose.Schema(
    {
        title: String,
        description: String,
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
        // IMPORTANT: REMOVE THIS LINE IF IT'S STILL THERE
        // replies: [replySchema], // <--- This line should be gone!
        upvotes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    },
    { timestamps: true }
);

module.exports = mongoose.model("BacklogPost", backlogPostSchema);