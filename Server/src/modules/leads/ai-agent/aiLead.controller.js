const aiLeadService = require('./aiLead.service');
const { ok, fail } = require('../../../utils/response');

async function createFromChat(req, res, next) {
  try {
    const result = await aiLeadService.processAiLead(req.body, req.user ? req.user._id : null);
    return ok(res, result, 'AI Lead qualified and created successfully', 201, req);
  } catch (error) {
    if (error.message.includes('VALIDATION_FAILED')) {
      return fail(res, 400, 'VALIDATION_FAILED', error.message);
    }
    next(error);
  }
}

module.exports = { createFromChat };
