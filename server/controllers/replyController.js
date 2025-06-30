const Reply = require("../models/replyModel");

exports.createReply = async (req, res) => {
  try {
    const { text } = req.body;
    const { postId } = req.params;

    const reply = new Reply({
      postId,
      text,
      repliedBy: req.user.id,
    });

    await reply.save();
    res.status(201).json(reply);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getReplies = async (req, res) => {
  try {
    const replies = await Reply.find({ postId: req.params.postId }).sort({ createdAt: 1 });
    res.json(replies);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
