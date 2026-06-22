const Notification = require('./notification.model');
const Lead = require('../leads/lead.model');
const Quotation = require('../quotations/quotation.model');
const LeadActivity = require('../leads/leadActivity.model');
const { ok, fail } = require('../../utils/response');

async function getNotifications(req, res, next) {
  try {
    const filters = {
      $or: [
        { targetUserId: req.user._id },
        { targetRole: req.user.role },
        { targetDepartment: req.user.department }
      ]
    };

    const notifications = await Notification.find(filters).sort({ createdAt: -1 });
    return ok(res, { notifications }, 'Notifications retrieved successfully', 200, req);
  } catch (error) {
    next(error);
  }
}

async function markNotificationRead(req, res, next) {
  try {
    const notification = await Notification.findOneAndUpdate(
      {
        _id: req.params.notificationId,
        $or: [
          { targetUserId: req.user._id },
          { targetRole: req.user.role },
          { targetDepartment: req.user.department }
        ]
      },
      { isRead: true },
      { new: true }
    );

    if (!notification) {
      return fail(res, 404, 'NOT_FOUND', 'Notification not found or access denied', [], req);
    }

    return ok(res, { notification }, 'Notification marked as read', 200, req);
  } catch (error) {
    next(error);
  }
}

async function getDashboardSummary(req, res, next) {
  try {
    const userId = req.user._id;

    const [totalLeads, activeLeads, pendingQuotations, completedTasks] = await Promise.all([
      Lead.countDocuments({ assignedTo: userId }),
      Lead.countDocuments({ assignedTo: userId, stage: { $nin: ['CLOSED_WON', 'CLOSED_LOST'] } }),
      Quotation.countDocuments({ requestedBy: userId, status: 'PENDING' }),
      Lead.countDocuments({ assignedTo: userId, stage: 'CLOSED_WON' })
    ]);

    return ok(res, {
      summary: {
        totalLeads,
        activeLeads,
        pendingQuotations,
        completedTasks
      }
    }, 'Dashboard summary metrics retrieved successfully', 200, req);
  } catch (error) {
    next(error);
  }
}

async function getDashboardHistory(req, res, next) {
  try {
    const userId = req.user._id;

    const activities = await LeadActivity.find({ actorId: userId })
      .sort({ createdAt: -1 })
      .limit(20)
      .populate('leadId', 'customerName leadCode');

    return ok(res, { activities }, 'Dashboard activity history retrieved successfully', 200, req);
  } catch (error) {
    next(error);
  }
}

async function markAllNotificationsRead(req, res, next) {
  try {
    const filters = {
      $or: [
        { targetUserId: req.user._id },
        { targetRole: req.user.role },
        { targetDepartment: req.user.department }
      ],
      isRead: false
    };

    await Notification.updateMany(filters, { isRead: true });

    return ok(res, {}, 'All notifications marked as read', 200, req);
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getNotifications,
  markNotificationRead,
  markAllNotificationsRead,
  getDashboardSummary,
  getDashboardHistory
};
