require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./server/config/mongodb");

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", require("./server/routes/auth"));
app.use("/api/products", require("./server/routes/products"));
app.use("/api/recommendations", require("./server/routes/recommendations"));
app.use("/api/reviews", require("./server/routes/reviews"));
app.use("/api/search", require("./server/routes/search"));
app.use("/api/chatbot", require("./server/routes/chatbot"));
app.use("/api/marketing", require("./server/routes/marketing"));
app.use("/api/player", require("./server/routes/player"));

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "Server is running" });
});

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong!" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✓ Server running on port ${PORT}`);
});
