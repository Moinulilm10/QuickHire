exports.getHealth = (req, res) => {
  res.status(200).json({
    success: true,
    message: "Server is healthy and running",
    timestamp: new Date().toISOString(),
  });
};
