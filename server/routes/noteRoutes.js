const express = require("express");
const multer = require("multer");
const path = require("path");
const Note = require("../models/noteModel");
const requireSignIn = require("../middleware/authMiddleware");

const router = express.Router();

// Store files in /uploads
const fs = require("fs");

const uploadDir = "uploads";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  },
});

const upload = multer({ storage });

router.post(
  "/upload",
  requireSignIn,
  upload.single("file"),
  async (req, res) => {
    try {
      const { title, description, branch, semester, subject } = req.body;

      const newNote = new Note({
        title,
        description,
        branch,
        semester,
        subject,
        fileUrl: `/uploads/${req.file.filename}`,
        uploadedBy: req.user.id,
      });

      await newNote.save();

      res.status(201).json({ message: "Note uploaded successfully" });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

router.get("/", async (req, res) => {
  try {
    const { search, branch, semester, sort } = req.query;
    const query = {};

    if (search) {
      query.$or = [
        { title: new RegExp(search, "i") },
        { description: new RegExp(search, "i") },
      ];
    }
    if (branch) query.branch = branch;
    if (semester) query.semester = semester;

    const sortOption = sort === "oldest" ? 1 : -1;

    const notes = await Note.find(query).sort({ createdAt: sortOption });
    res.json(notes);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

router.get("/download/:noteId", async (req, res) => {
  try {
    const note = await Note.findById(req.params.noteId);
    if (!note) return res.status(404).send("Note not found");

    // Full path
    const filePath = path.join(__dirname, "..", note.fileUrl);

    // Increment download count
    note.downloadCount++;
    await note.save();

    // Stream file
    res.download(filePath); // or use res.sendFile(filePath)
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

module.exports = router;
