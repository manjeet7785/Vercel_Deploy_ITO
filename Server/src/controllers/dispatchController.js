const Dispatch = require('../models/Dispatch');
const Lead = require('../models/Lead');
const { ok, fail } = require('../utils/response');
const { recordAudit } = require('../utils/tracking');

async function createDispatch(req, res) {
  try {
    const { leadId, quotationId, loadingPoint, destination, truckNo, driverName, driverPhone, material, quantity, loadingDate } = req.body;
    const lead = await Lead.findById(leadId);
    if (!lead) return fail(res, 404, 'VALIDATION_FAILED', 'Lead not found');

    const dispatch = await Dispatch.create({
      leadId,
      quotationId,
      loadingPoint,
      destination,
      truckNo,
      driverName,
      material,
      quantity,
      loadingDate,
      driverPhoneEncrypted: driverPhone || '',
      driverPhoneMasked: driverPhone ? `${String(driverPhone).slice(0, 2)}xxxx${String(driverPhone).slice(-2)}` : ''
    });

    await Lead.findByIdAndUpdate(leadId, { stage: 'DISPATCH_PLANNED' });

    await recordAudit({
      actorId: req.user ? req.user._id : null,
      actionType: 'DISPATCH_CREATED',
      entityType: 'DISPATCH',
      entityId: dispatch._id.toString(),
      metadata: { leadId }
    });

    return ok(res, { dispatch }, 201);
  } catch (error) {
    return fail(res, 500, 'SERVER_ERROR', error.message);
  }
}

async function listDispatches(req, res) {
  try {
    const dispatches = await Dispatch.find().populate('leadId').sort({ createdAt: -1 });
    return ok(res, { dispatches });
  } catch (error) {
    return fail(res, 500, 'SERVER_ERROR', error.message);
  }
}

async function updateDispatchStatus(req, res) {
  try {
    const dispatch = await Dispatch.findByIdAndUpdate(req.params.id, { dispatchStatus: req.body.dispatchStatus }, { new: true });
    if (!dispatch) return fail(res, 404, 'VALIDATION_FAILED', 'Dispatch not found');
    return ok(res, { dispatch });
  } catch (error) {
    return fail(res, 500, 'SERVER_ERROR', error.message);
  }
}

module.exports = {
  createDispatch,
  listDispatches,
  updateDispatchStatus
};