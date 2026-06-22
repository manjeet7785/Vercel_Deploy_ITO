const SecurityAlert = require('./securityAlert.model');
const Notification = require('../notifications/notification.model');
const logger = require('../../utils/logger');

async function raiseAlert({ actorId = null, alertType, severity = 'MEDIUM', message, metadata = {} }) {
  try {
    const alert = await SecurityAlert.create({
      actorId,
      alertType,
      severity,
      message,
      metadata
    });

    logger.warn(`[SECURITY ALERT] Type: ${alertType}, Severity: ${severity}, Msg: ${message}`, metadata);

    
    
    await Notification.create({
      targetRole: 'ADMIN',
      message: `[SECURITY ALERT] [${severity}] ${message}`,
      type: 'SECURITY_ALERT',
      metadata: { alertId: alert._id, alertType }
    });

    
    if (severity === 'HIGH' || severity === 'CRITICAL') {
      logger.info(`[MOCK EMAIL SENT TO ADMIN] Subject: Critical Security Alert - ${alertType}, Body: ${message}`);
    }

    return alert;
  } catch (error) {
    logger.error('Failed to raise security alert:', error);
  }
}

module.exports = { raiseAlert };
