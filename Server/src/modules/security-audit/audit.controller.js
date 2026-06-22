const AuditLog = require('./auditLog.model');
const SecurityAlert = require('./securityAlert.model');
const Lead = require('../leads/lead.model');
const Dispatch = require('../dispatch/dispatch.model');
const { decryptText } = require('../../utils/crypto');
const { ok, fail } = require('../../utils/response');
const { canAccessLead } = require('../leads/lead.service');
const { raiseAlert } = require('./securityAlert.service');
const { recordAudit } = require('./auditLog.service');

const windowMap = new Map();

function isRateLimited(key) {
  const now = Date.now();
  const windowMs = 15 * 60 * 1000;
  const bucket = windowMap.get(key) || [];
  const recent = bucket.filter((timestamp) => now - timestamp < windowMs);
  recent.push(now);
  windowMap.set(key, recent);
  return recent.length > 5;
}

async function getLogs(req, res, next) {
  try {
    const logs = await AuditLog.find().sort({ createdAt: -1 }).limit(Number(req.query.limit || 100));
    return ok(res, { logs }, 'Audit logs list', 200, req);
  } catch (error) {
    next(error);
  }
}

async function getAlerts(req, res, next) {
  try {
    const alerts = await SecurityAlert.find().sort({ createdAt: -1 }).limit(Number(req.query.limit || 100));
    return ok(res, { alerts }, 'Security alerts list', 200, req);
  } catch (error) {
    next(error);
  }
}

async function resolveAlert(req, res, next) {
  try {
    const { alertId } = req.params;
    const alert = await SecurityAlert.findById(alertId);
    if (!alert) {
      return fail(res, 404, 'NOT_FOUND', 'Security alert not found', [], req);
    }
    alert.status = 'RESOLVED';
    alert.reviewedBy = req.user._id;
    alert.reviewedAt = new Date();
    await alert.save();
    return ok(res, { alert }, 'Security alert resolved successfully', 200, req);
  } catch (error) {
    next(error);
  }
}

async function revealSensitiveData(req, res, next) {
  try {
    const { entityType = 'LEAD', entityId, fieldName, reason } = req.body;
    const deviceHash = req.headers['x-device-hash'] || '';

    if (entityType !== 'LEAD' && entityType !== 'DISPATCH') {
      return fail(res, 400, 'VALIDATION_FAILED', 'Only LEAD and DISPATCH reveal is supported', [], req);
    }

    if (!reason || reason.trim().length === 0) {
      return fail(res, 400, 'VALIDATION_FAILED', 'Justification/Reason is required to reveal sensitive data', [], req);
    }

    const rateKey = `${req.user._id}:${deviceHash}:${entityId}:${fieldName}`;
    if (isRateLimited(rateKey)) {
      await raiseAlert({
        actorId: req.user._id,
        alertType: 'RATE_LIMITED',
        severity: 'HIGH',
        message: `Too many reveal attempts by user ${req.user.email}`,
        metadata: { entityType, entityId, fieldName, deviceHash }
      });
      return fail(res, 429, 'RATE_LIMITED', 'Too many requests. Operation rate-limited.', [], req);
    }

    if (entityType === 'DISPATCH') {
      const dispatch = await Dispatch.findById(entityId);
      if (!dispatch) {
        return fail(res, 404, 'NOT_FOUND', 'Dispatch record not found', [], req);
      }

      const lead = await Lead.findById(dispatch.leadId);
      if (!lead || !canAccessLead(req.user, lead)) {
        await raiseAlert({
          actorId: req.user._id,
          alertType: 'OWNERSHIP_FORBIDDEN',
          severity: 'HIGH',
          message: `Unauthorized attempt by ${req.user.email} to reveal dispatch ${entityId}`,
          metadata: { entityType, entityId, fieldName, deviceHash, reason }
        });
        await recordAudit({
          actorId: req.user._id,
          actionType: 'REVEAL_DENIED',
          entityType,
          entityId,
          severity: 'HIGH',
          deviceHash,
          metadata: { fieldName, reason }
        });
        return fail(res, 403, 'OWNERSHIP_FORBIDDEN', 'Access denied: Ownership check failed', [], req);
      }

      let value = null;
      if (['driverphone', 'driver_phone', 'driverphoneencrypted', 'phone', 'mobile'].includes(String(fieldName).toLowerCase())) {
        value = decryptText(dispatch.driverPhoneEncrypted);
      } else {
        return fail(res, 400, 'VALIDATION_FAILED', `Unsupported field: ${fieldName}`, [], req);
      }

      await recordAudit({
        actorId: req.user._id,
        actionType: 'MOBILE_REVEAL',
        entityType,
        entityId,
        severity: 'MEDIUM',
        deviceHash,
        metadata: { fieldName, reason }
      });

      if (reason.length < 5) {
        await raiseAlert({
          actorId: req.user._id,
          alertType: 'SUSPICIOUS_REVEAL_REASON',
          severity: 'MEDIUM',
          message: `User ${req.user.email} unmasked sensitive info with a short explanation: "${reason}"`,
          metadata: { entityType, entityId, fieldName, reason }
        });
      }

      return ok(res, { value }, 'Sensitive driver data revealed', 200, req);
    }

    
    const lead = await Lead.findById(entityId);
    if (!lead) {
      return fail(res, 404, 'NOT_FOUND', 'Lead record not found', [], req);
    }

    if (!canAccessLead(req.user, lead)) {
      await raiseAlert({
        actorId: req.user._id,
        alertType: 'OWNERSHIP_FORBIDDEN',
        severity: 'HIGH',
        message: `Unauthorized attempt by ${req.user.email} to reveal lead ${entityId}`,
        metadata: { entityType, entityId, fieldName, deviceHash, reason }
      });
      await recordAudit({
        actorId: req.user._id,
        actionType: 'REVEAL_DENIED',
        entityType,
        entityId,
        severity: 'HIGH',
        deviceHash,
        metadata: { fieldName, reason }
      });
      return fail(res, 403, 'OWNERSHIP_FORBIDDEN', 'Access denied: Ownership check failed', [], req);
    }

    let value = null;
    let actionType = '';
    if (['mobile', 'phone'].includes(String(fieldName).toLowerCase())) {
      value = decryptText(lead.phoneEncrypted);
      actionType = 'MOBILE_REVEAL';
    } else if (['email'].includes(String(fieldName).toLowerCase())) {
      value = decryptText(lead.emailEncrypted);
      actionType = 'EMAIL_REVEAL';
    } else {
      return fail(res, 400, 'VALIDATION_FAILED', `Unsupported field: ${fieldName}`, [], req);
    }

    await recordAudit({
      actorId: req.user._id,
      actionType,
      entityType,
      entityId,
      severity: 'MEDIUM',
      deviceHash,
      metadata: { fieldName, reason }
    });

    if (reason.length < 5) {
      await raiseAlert({
        actorId: req.user._id,
        alertType: 'SUSPICIOUS_REVEAL_REASON',
        severity: 'MEDIUM',
        message: `User ${req.user.email} unmasked sensitive info with a short explanation: "${reason}"`,
        metadata: { entityType, entityId, fieldName, reason }
      });
    }

    return ok(res, { value }, 'Sensitive lead data revealed', 200, req);
  } catch (error) {
    next(error);
  }
}

async function interceptBulkExportAttempt(req, res, next) {
  try {
    const { deviceHash = '', metadata = {} } = req.body;
    const hasPermission = req.user.exportPermission === true || req.user.role === 'ADMIN';

    await recordAudit({
      actorId: req.user._id,
      actionType: 'EXPORT_ATTEMPT',
      entityType: 'SYSTEM',
      entityId: 'BULK_DATA',
      severity: hasPermission ? 'LOW' : 'CRITICAL',
      deviceHash,
      metadata: { ...metadata, hasPermission }
    });

    if (!hasPermission) {
      await raiseAlert({
        actorId: req.user._id,
        alertType: 'BULK_EXPORT_DENIED',
        severity: 'CRITICAL',
        message: `${req.user.fullName} (${req.user.employeeId}) tried to export leads database without export permission.`,
        metadata: { deviceHash, ...metadata }
      });
      return fail(res, 403, 'EXPORT_DENIED', 'Security Interdiction Target: Bulk records processing export sequence structurally blocked.', [], req);
    }

    return ok(res, { allowed: true }, 'Export operation approved', 200, req);
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getLogs,
  getAlerts,
  resolveAlert,
  revealSensitiveData,
  interceptBulkExportAttempt
};
