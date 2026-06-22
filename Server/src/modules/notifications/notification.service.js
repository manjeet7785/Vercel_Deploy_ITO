const NotificationEvent = require('./notificationEvent.model');
const logger = require('../../utils/logger');

async function sendWhatsApp(phone, message, templateName = '', variables = {}) {
  const event = await NotificationEvent.create({
    recipient: phone,
    channel: 'WHATSAPP',
    templateName,
    variables,
    messageBody: message,
    status: 'pending'
  });

  try {
    logger.info(`[MOCK WHATSAPP] Sending message to ${phone}: ${message}`);
    event.status = 'sent';
    event.sentAt = new Date();
    await event.save();
    return event;
  } catch (error) {
    logger.error(`[MOCK WHATSAPP ERROR] Failed to send to ${phone}`, error);
    event.status = 'failed';
    event.errorMessage = error.message;
    await event.save();
    throw error;
  }
}

async function sendEmail(email, subject, body, templateName = '', variables = {}) {
  const event = await NotificationEvent.create({
    recipient: email,
    channel: 'EMAIL',
    templateName,
    variables,
    messageBody: `Subject: ${subject}\n\n${body}`,
    status: 'pending'
  });

  try {
    logger.info(`[MOCK EMAIL] Sending email to ${email} | Subject: ${subject}`);
    event.status = 'sent';
    event.sentAt = new Date();
    await event.save();
    return event;
  } catch (error) {
    logger.error(`[MOCK EMAIL ERROR] Failed to send to ${email}`, error);
    event.status = 'failed';
    event.errorMessage = error.message;
    await event.save();
    throw error;
  }
}

module.exports = {
  sendWhatsApp,
  sendEmail
};
