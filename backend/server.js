const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const protect = require("./middleware/authMiddleware");
const connectDB = require("./config/db");

dotenv.config();

const app = express();

// Connect MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
const authRoutes = require("./routes/authRoutes");

app.use("/api/auth", authRoutes);

// Test route
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Smart Expense API is running",
  });
});

// Server
const PORT = process.env.PORT || 5000;
app.get("/api/protected", protect, (req, res) => {
  res.json({
    success: true,
    message: "You accessed a protected route!",
    userId: req.user,
  });
});
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});