const Lead = require('../models/Lead');
const User = require('../models/User');
const SecurityAlert = require('../models/SecurityAlert');
const Quotation = require('../models/Quotation');
const { ok, fail } = require('../utils/response');

async function adminSummary(req, res) {
  try {
    const [leads, users, alerts, quotations] = await Promise.all([
      Lead.countDocuments(),
      User.countDocuments(),
      SecurityAlert.countDocuments(),
      Quotation.countDocuments()
    ]);

    return ok(res, {
      report: {
        leads,
        users,
        alerts,
        quotations,
        generatedAt: new Date().toISOString()
      }
    });
  } catch (error) {
    return fail(res, 500, 'SERVER_ERROR', error.message);
  }
}

module.exports = { adminSummary };
