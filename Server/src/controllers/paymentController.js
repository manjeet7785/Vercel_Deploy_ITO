const Payment = require('../models/Payment');
const Lead = require('../models/Lead');
const { ok, fail } = require('../utils/response');

async function createPayment(req, res) {
  try {
    const { leadId, dispatchId, totalAmount, advanceAmount = 0, dueDate } = req.body;
    const lead = await Lead.findById(leadId);
    if (!lead) return fail(res, 404, 'VALIDATION_FAILED', 'Lead not found');

    const balanceAmount = Number(totalAmount || 0) - Number(advanceAmount || 0);
    const payment = await Payment.create({ leadId, dispatchId, totalAmount, advanceAmount, balanceAmount, dueDate });
    await Lead.findByIdAndUpdate(leadId, { stage: 'PAYMENT_PENDING' });
    return ok(res, { payment }, 201);
  } catch (error) {
    return fail(res, 500, 'SERVER_ERROR', error.message);
  }
}

async function listPayments(req, res) {
  try {
    const payments = await Payment.find().populate('leadId').sort({ createdAt: -1 });
    return ok(res, { payments });
  } catch (error) {
    return fail(res, 500, 'SERVER_ERROR', error.message);
  }
}

async function updatePaymentStatus(req, res) {
  try {
    const payment = await Payment.findByIdAndUpdate(req.params.id, { paymentStatus: req.body.paymentStatus }, { new: true });
    if (!payment) return fail(res, 404, 'VALIDATION_FAILED', 'Payment not found');
    return ok(res, { payment });
  } catch (error) {
    return fail(res, 500, 'SERVER_ERROR', error.message);
  }
}

module.exports = {
  createPayment,
  listPayments,
  updatePaymentStatus
};