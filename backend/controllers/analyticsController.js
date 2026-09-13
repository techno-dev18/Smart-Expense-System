const { getUserAnalytics } = require("../services/analyticsService");

const getAnalytics = async (req, res) => {
  try {
    const analytics = await getUserAnalytics(req.user);

    res.status(200).json({
      success: true,
      analytics,
    });
  } catch (error) {
    console.error("Analytics Controller Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to generate analytics",
      error: error.message,
    });
  }
};

module.exports = {
  getAnalytics,
};