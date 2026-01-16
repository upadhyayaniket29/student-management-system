import Activity from '../models/Activity.js';
import User from '../models/User.js';

// @desc    Get all activities
// @route   GET /api/activities
// @access  Private/Admin
export const getAllActivities = async (req, res) => {
  try {
    const { userId, action, limit = 50 } = req.query;
    const query = {};

    if (userId) query.userId = userId;
    if (action) query.action = action;

    const activities = await Activity.find(query)
      .populate('userId', 'name email role')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit));

    res.json(activities);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get student activities
// @route   GET /api/activities/student/:id
// @access  Private/Admin
export const getStudentActivities = async (req, res) => {
  try {
    const activities = await Activity.find({ userId: req.params.id })
      .populate('userId', 'name email role')
      .sort({ createdAt: -1 })
      .limit(100);

    res.json(activities);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get recent activities
// @route   GET /api/activities/recent
// @access  Private/Admin
export const getRecentActivities = async (req, res) => {
  try {
    const { hours = 24 } = req.query;
    const since = new Date();
    since.setHours(since.getHours() - parseInt(hours));

    const activities = await Activity.find({ createdAt: { $gte: since } })
      .populate('userId', 'name email role')
      .sort({ createdAt: -1 })
      .limit(50);

    res.json(activities);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get activity statistics
// @route   GET /api/activities/stats
// @access  Private/Admin
export const getActivityStats = async (req, res) => {
  try {
    const stats = await Activity.aggregate([
      {
        $group: {
          _id: '$action',
          count: { $sum: 1 },
        },
      },
      {
        $sort: { count: -1 },
      },
    ]);

    const totalActivities = await Activity.countDocuments();
    const todayActivities = await Activity.countDocuments({
      createdAt: {
        $gte: new Date(new Date().setHours(0, 0, 0, 0)),
      },
    });

    res.json({
      totalActivities,
      todayActivities,
      byAction: stats,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
