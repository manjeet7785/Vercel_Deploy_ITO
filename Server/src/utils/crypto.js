const crypto = require('crypto');

const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || '01234567890123456789012345678901'; // 32 bytes
const IV_LENGTH = 16;

function encryptText(text) {
  if (!text) return '';
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY), iv);
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return iv.toString('hex') + ':' + encrypted;
}

function decryptText(encryptedText) {
  if (!encryptedText) return '';
  const parts = encryptedText.split(':');
  const iv = Buffer.from(parts[0], 'hex');
  const encrypted = parts[1];
  const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY), iv);
  let decrypted = decipher.update(encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}

function hashText(text) {
  return crypto.createHash('sha256').update(text).digest('hex');
}

function maskPhone(phone) {
  if (!phone) return '';
  const str = String(phone);
  if (str.length <= 4) return 'xxxx';
  return str.slice(0, 2) + 'xxxx' + str.slice(-2);
}

function maskEmail(email) {
  if (!email) return '';
  const [local, domain] = email.split('@');
  if (local.length <= 2) return '***@' + domain;
  return local.slice(0, 2) + '***@' + domain;
}

module.exports = { encryptText, decryptText, hashText, maskPhone, maskEmail };