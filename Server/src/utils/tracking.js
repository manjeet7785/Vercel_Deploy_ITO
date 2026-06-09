const AuditLog = require('../models/AuditLog');
const SecurityAlert = require('../models/SecurityAlert');

async function recordAudit({ actorId, actionType, entityType, entityId, severity = 'LOW', deviceHash = '', metadata = {} }) {
  try {
    await AuditLog.create({
      actorId,
      actionType,
      entityType,
      entityId,
      severity,
      deviceHash,
      metadata,
      createdAt: new Date()
    });
  } catch (error) {
    console.error('Audit log failed:', error);
  }
}

async function raiseAlert({ actorId, alertType, severity, message, metadata = {} }) {
  try {
    await SecurityAlert.create({
      actorId,
      alertType,
      severity,
      message,
      metadata,
      status: 'OPEN',
      createdAt: new Date()
    });
  } catch (error) {
    console.error('Alert creation failed:', error);
  }
}

module.exports = { recordAudit, raiseAlert };