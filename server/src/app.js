const express = require("express");
const cors = require("cors");
require("dotenv").config();

const healthRoutes = require("./routes/health.routes");
const jobRoutes = require("./routes/job.routes");
const authRoutes = require("./routes/auth.routes");
const adminRoutes = require("./routes/admin.routes");
const categoryRoutes = require("./routes/category.routes");

const app = express();

// Middlewares
app.use(
  cors({
    origin: [
      process.env.CLIENT_URL || "http://localhost:3000",
      "http://127.0.0.1:3000",
      "http://localhost:3001",
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Accept"],
  }),
);

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

// Routes
app.use("/api/health", healthRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/categories", categoryRoutes);

// Global Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

module.exports = app;
