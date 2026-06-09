const Lead = require('../models/Lead');
const User = require('../models/User');
const Quotation = require('../models/Quotation');
const SecurityAlert = require('../models/SecurityAlert');
const { ok, fail } = require('../utils/response');
const { getLeadDisplay } = require('../utils/workflow');
const { recordAudit } = require('../utils/tracking');

// Dashboard Summary
async function dashboardSummary(req, res) {
  try {
    const stageCounts = await Lead.aggregate([
      { $group: { _id: '$stage', count: { $sum: 1 } } }
    ]);
    const users = await User.countDocuments();
    const activeUsers = await User.countDocuments({ isActive: true });
    const openAlerts = await SecurityAlert.countDocuments({ status: 'OPEN' });
    const pendingQuotations = await Quotation.countDocuments({ status: 'PENDING' });

    return ok(res, {
      summary: {
        users,
        activeUsers,
        openAlerts,
        pendingQuotations,
        stageCounts: stageCounts.reduce((acc, item) => {
          acc[item._id] = item.count;
          return acc;
        }, {})
      }
    });
  } catch (error) {
    return fail(res, 500, 'SERVER_ERROR', error.message);
  }
}

// Pipeline data
async function pipeline(req, res) {
  try {
    const data = await Lead.aggregate([
      { $group: { _id: '$stage', total: { $sum: 1 } } },
      { $sort: { _id: 1 } }
    ]);
    return ok(res, { pipeline: data });
  } catch (error) {
    return fail(res, 500, 'SERVER_ERROR', error.message);
  }
}

// Employee Performance
async function employeePerformance(req, res) {
  try {
    const data = await Lead.aggregate([
      { $match: { assignedTo: { $ne: null } } },
      {
        $group: {
          _id: '$assignedTo',
          leads: { $sum: 1 },
          won: { $sum: { $cond: [{ $eq: ['$stage', 'CLOSED_WON'] }, 1, 0] } },
          lost: { $sum: { $cond: [{ $eq: ['$stage', 'CLOSED_LOST'] }, 1, 0] } }
        }
      },
      { $lookup: { from: 'users', localField: '_id', foreignField: '_id', as: 'userInfo' } },
      { $unwind: { path: '$userInfo', preserveNullAndEmptyArrays: true } },
      {
        $project: {
          _id: { $ifNull: ['$userInfo.fullName', '$_id'] },
          leads: 1,
          won: 1,
          lost: 1
        }
      }
    ]);
    return ok(res, { performance: data });
  } catch (error) {
    return fail(res, 500, 'SERVER_ERROR', error.message);
  }
}

// Security Alerts
async function securityAlerts(req, res) {
  try {
    const alerts = await SecurityAlert.find()
      .populate('actorId', 'fullName email')
      .sort({ createdAt: -1 })
      .limit(100);
    return ok(res, { alerts });
  } catch (error) {
    return fail(res, 500, 'SERVER_ERROR', error.message);
  }
}

// Quotation Queue
async function quotationQueue(req, res) {
  try {
    const quotations = await Quotation.find({ status: 'PENDING' })
      .populate('leadId')
      .populate('requestedBy', 'fullName')
      .sort({ createdAt: -1 });
    return ok(res, { quotations });
  } catch (error) {
    return fail(res, 500, 'SERVER_ERROR', error.message);
  }
}

// Assign Lead (Admin)
async function assignLead(req, res) {
  try {
    const lead = await Lead.findByIdAndUpdate(
      req.params.leadId,
      {
        assignedTo: req.body.assignedTo || null,
        assignedDepartment: req.body.assignedDepartment || null,
        stage: req.body.stage || undefined
      },
      { new: true }
    );

    if (!lead) return fail(res, 404, 'VALIDATION_FAILED', 'Lead not found');

    await recordAudit({
      actorId: req.user ? req.user._id : null,
      actionType: 'ADMIN_LEAD_ASSIGN',
      entityType: 'LEAD',
      entityId: lead._id.toString(),
      severity: 'LOW',
      metadata: req.body
    });

    return ok(res, { lead: getLeadDisplay(lead) });
  } catch (error) {
    return fail(res, 500, 'SERVER_ERROR', error.message);
  }
}

// Deactivate User
async function deactivateUser(req, res) {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.userId,
      { isActive: false },
      { new: true }
    ).select('-passwordHash');

    if (!user) return fail(res, 404, 'VALIDATION_FAILED', 'User not found');

    await recordAudit({
      actorId: req.user ? req.user._id : null,
      actionType: 'USER_DEACTIVATED',
      entityType: 'USER',
      entityId: user._id.toString(),
      severity: 'MEDIUM',
      metadata: { deactivatedBy: req.user?.fullName }
    });

    return ok(res, { user });
  } catch (error) {
    return fail(res, 500, 'SERVER_ERROR', error.message);
  }
}

// Update Export Permission
async function exportPermission(req, res) {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.userId,
      { exportPermission: Boolean(req.body.exportPermission) },
      { new: true }
    ).select('-passwordHash');

    if (!user) return fail(res, 404, 'VALIDATION_FAILED', 'User not found');
    return ok(res, { user });
  } catch (error) {
    return fail(res, 500, 'SERVER_ERROR', error.message);
  }
}

module.exports = {
  dashboardSummary,
  pipeline,
  employeePerformance,
  securityAlerts,
  quotationQueue,
  assignLead,
  deactivateUser,
  exportPermission
};