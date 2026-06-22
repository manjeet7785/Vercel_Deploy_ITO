const env = require('../config/env');

const logger = {
  info: (msg, meta = '') => {
    console.log(`[INFO] ${new Date().toISOString()} - ${msg}`, meta);
  },
  error: (msg, error = '') => {
    console.error(`[ERROR] ${new Date().toISOString()} - ${msg}`, error);
  },
  warn: (msg, meta = '') => {
    console.warn(`[WARN] ${new Date().toISOString()} - ${msg}`, meta);
  },
  debug: (msg, meta = '') => {
    if (env.NODE_ENV === 'development') {
      console.log(`[DEBUG] ${new Date().toISOString()} - ${msg}`, meta);
    }
  }
};

module.exports = logger;
