import { AuditLog } from './auditLog.model.js';
import { SecurityAlert } from './securityAlert.model.js';
import { Lead } from '../leads/lead.model.js';
import { decrypt } from '../../utils/crypto.js';

export const getLogsAndAlerts = async (req, res, next) => {
  try {
    const logs = await AuditLog.find().sort({ createdAt: -1 }).limit(100);
    const alerts = await SecurityAlert.find().sort({ createdAt: -1 });
    res.json({ success: true, data: { logs, alerts } });
  } catch (error) {
    next(error);
  }
};

export const revealSensitiveData = async (req, res, next) => {
  try {
    const { entityId, reason, fieldName } = req.body;
    const lead = await Lead.findById(entityId);
    if (!lead) return res.status(404).json({ success: false, message: 'Context data matching target reference invalid' });

    let unmaskedValue = '';
    if (fieldName === 'mobile') {
      unmaskedValue = decrypt(lead.phoneEncrypted);
    } else if (fieldName === 'email') {
      unmaskedValue = lead.emailEncrypted ? decrypt(lead.emailEncrypted) : 'No Email Present';
    }

    await AuditLog.create({
      actorId: req.user.employeeId,
      actionType: `${fieldName.toUpperCase()}_REVEAL`,
      entityType: 'LEAD',
      entityId: lead._id,
      severity: 'HIGH',
      metadata: { reason }
    });

    if (reason.length < 5) {
      await SecurityAlert.create({
        actorId: req.user.employeeId,
        alertType: 'SUSPICIOUS_REVEAL_REASON',
        severity: 'MEDIUM',
        message: 'Employee verified raw information retrieval parameter mapping without a valid structural reason.'
      });
    }

    res.json({ success: true, data: { value: unmaskedValue } });
  } catch (error) {
    next(error);
  }
};

export const interceptBulkExportAttempt = async (req, res, next) => {
  try {
    await SecurityAlert.create({
      actorId: req.user.employeeId,
      alertType: 'BULK_EXPORT_DENIED',
      severity: 'CRITICAL',
      message: 'System baseline triggered execution interruption engine following unauthorized client bulk pipeline export execution trigger.'
    });

    await AuditLog.create({ actorId: req.user.employeeId, actionType: 'EXPORT_ATTEMPT', entityType: 'SYSTEM', entityId: 'BULK_DATA', severity: 'CRITICAL' });
    res.status(403).json({ success: false, message: 'Security Interdiction Target: Bulk records processing export sequence structurally blocked.', errorCode: 'EXPORT_DENIED' });
  } catch (error) {
    next(error);
  }
};
