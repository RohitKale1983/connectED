const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const http = require("http");
const { Server } = require("socket.io");
const Message = require("./models/messageModel");
const Notification = require("./models/notificationModel");

dotenv.config();

const app = express();
const server = http.createServer(app);

// Define allowed origins dynamically
const allowedOrigins = [
  process.env.CORS_ORIGIN_PRODUCTION, // e.g., https://connect-ed-liard.vercel.app
  process.env.CORS_ORIGIN_DEVELOPMENT // e.g., http://localhost:3000
];

// ⭐ DELETE THE OLD corsOptionsDelegate FUNCTION FROM HERE ⭐
// const corsOptionsDelegate = (req, callback) => {
//   let corsOptions;
//   if (allowedOrigins.indexOf(req.header('Origin')) !== -1 || !req.header('Origin')) {
//     // Allow requests with allowed origins or no origin (like Postman/curl)
//     corsOptions = { origin: true, credentials: true };
//   } else {
//     corsOptions = { origin: false }; // Deny other origins
//   }
//   callback(null, corsOptions);
// };


// ⭐ UPDATED Socket.IO CORS Configuration ⭐
const io = new Server(server, {
  cors: {
    origin: allowedOrigins, // ⭐ CHANGE: Directly pass the array of allowed origins
    methods: ["GET", "POST", "PUT", "DELETE"], // Add other methods your API uses
    credentials: true,
  },
});

// ⭐ UPDATED Middleware for HTTP requests (Axios) CORS Configuration ⭐
app.use(cors({
  origin: (origin, callback) => {
    // This function for Express's CORS takes 'origin' directly as a string
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

app.use(express.json());

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error(err));

// Serve static PDF files from uploads folder
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/notes", require("./routes/noteRoutes"));
app.use("/api/backlog", require("./routes/backlogRoutes"));
app.use("/api/notifications", require("./routes/notificationRoutes"));
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/mentors", require("./routes/mentorRoutes"));
app.use("/api/messages", require("./routes/messageRoutes"));
app.use("/api/reviews", require("./routes/reviewRoutes"));
app.use("/api/questionnaire", require("./routes/questionnaireRoutes"));
app.use("/api/career-finder", require("./routes/careerFinderRoutes"));

// --------------------------Deployment------------------------------
// ⭐ DELETE OR COMMENT OUT THIS LINE - NO LONGER NEEDED AS IS ⭐
// const __dirname1 = path.resolve();

if (process.env.NODE_ENV === "production") {
  // ⭐ ADD THIS LINE to correctly get to the project root from the server directory
  const rootPath = path.join(__dirname, '..'); // This navigates from 'server/' up to the 'src/' directory

  // ⭐ UPDATE THESE PATHS to use rootPath ⭐
  app.use(express.static(path.join(rootPath, "/client/build")));

  app.get("*", (req, res) =>
    res.sendFile(path.resolve(rootPath, "client", "build", "index.html"))
  );
} else {
  app.get("/", (req, res) => {
    res.send("API is running..");
  });
}
// --------------------------Deployment------------------------------

// === Socket.IO Logic ===
const onlineUsers = new Map();

io.on("connection", (socket) => {
  console.log("🔌 New client connected:", socket.id);

  socket.on("register", (userId) => {
    onlineUsers.set(userId, socket.id);
  });

  socket.on("sendMessage", async ({ senderId, receiverId, message }) => {
    try {
      // 1. Save message to DB
      const savedMessage = await Message.create({
        sender: senderId,
        receiver: receiverId,
        content: message,
      });

      // 2. Create a notification for the receiver
      await Notification.create({
        userId: receiverId,
        message: "You received a new message",
        type: "message",
        data: { senderId },
      });

      // 3. Emit message to receiver if online
      const receiverSocket = onlineUsers.get(receiverId);
      if (receiverSocket) {
        io.to(receiverSocket).emit("receiveMessage", savedMessage);
      }

      // 4. Emit message back to sender (for their UI)
      socket.emit("receiveMessage", savedMessage);
    } catch (err) {
      console.error("❌ Failed to send message:", err);
    }
  });

  socket.on("disconnect", () => {
    console.log("❌ Client disconnected:", socket.id);
    for (let [userId, sockId] of onlineUsers.entries()) {
      if (sockId === socket.id) {
        onlineUsers.delete(userId);
        break;
      }
    }
  });
  socket.on("typing", ({ senderId, receiverId }) => {
    const receiverSocket = onlineUsers.get(receiverId);
    if (receiverSocket) {
      io.to(receiverSocket).emit("typing", { senderId });
    }
  });

  socket.on("stopTyping", ({ senderId, receiverId }) => {
    const receiverSocket = onlineUsers.get(receiverId);
    if (receiverSocket) {
      io.to(receiverSocket).emit("stopTyping", { senderId });
    }
  });
});

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));