const Lead = require('../models/Lead');

// @desc  Get analytics overview
// @route GET /api/analytics
// @access Private
const getAnalytics = async (req, res) => {
  try {
    const total = await Lead.countDocuments();
    const newLeads = await Lead.countDocuments({ status: 'New' });
    const contacted = await Lead.countDocuments({ status: 'Contacted' });
    const interested = await Lead.countDocuments({ status: 'Interested' });
    const converted = await Lead.countDocuments({ status: 'Converted' });
    const closed = await Lead.countDocuments({ status: 'Closed' });

    const pendingFollowUps = await Lead.countDocuments({
      followUpDate: { $lte: new Date() },
      followUpCompleted: false,
    });

    // Leads by source
    const leadsBySource = await Lead.aggregate([
      { $group: { _id: '$source', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    // Leads by inquiry type
    const leadsByInquiry = await Lead.aggregate([
      { $group: { _id: '$inquiryType', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    // Leads per day (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const dailyLeads = await Lead.aggregate([
      { $match: { createdAt: { $gte: sevenDaysAgo } } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    res.json({
      success: true,
      analytics: {
        total,
        newLeads,
        contacted,
        interested,
        converted,
        closed,
        pendingFollowUps,
        conversionRate: total > 0 ? ((converted / total) * 100).toFixed(1) : 0,
        leadsBySource,
        leadsByInquiry,
        dailyLeads,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { getAnalytics };
