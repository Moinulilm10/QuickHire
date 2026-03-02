const prisma = require("../config/prisma");

exports.getHealth = async (req, res) => {
  try {
    // Attempt a simple database query
    await prisma.job.count();

    res.status(200).json({
      success: true,
      message: "Server is healthy and connected to database",
      database: "connected",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server is running but database connection failed",
      database: "disconnected",
      error: error.message,
      timestamp: new Date().toISOString(),
    });
  }
};
