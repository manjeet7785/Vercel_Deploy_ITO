const Dispatch = require('./dispatch.model');
const Truck = require('./truck.model');
const Driver = require('./driver.model');
const Lead = require('../leads/lead.model');
const Payment = require('../payments/payment.model');
const { encryptText, hashText, maskPhone } = require('../../utils/crypto');
const { recordAudit } = require('../security-audit/auditLog.service');

async function createTruck({ truckNo, transporter, capacity }) {
  return Truck.create({ truckNo, transporter, capacity });
}

async function listTrucks() {
  return Truck.find().sort({ createdAt: -1 });
}

async function createDriver({ fullName, phone, licenseNo }) {
  const phoneHash = hashText(phone);
  return Driver.create({
    fullName,
    phoneEncrypted: encryptText(phone),
    phoneMasked: maskPhone(phone),
    phoneHash,
    licenseNo
  });
}

async function listDrivers() {
  return Driver.find().sort({ createdAt: -1 });
}

async function createDispatch({ leadId, quotationId, loadingPoint, destination, truckNo, driverName, driverPhone, material, quantity, actorId }) {
  const mongoose = require('mongoose');
  let lead;
  if (leadId && mongoose.Types.ObjectId.isValid(leadId)) {
    lead = await Lead.findById(leadId);
  } else if (leadId) {
    lead = await Lead.findOne({ leadCode: leadId });
  }
  if (!lead) throw new Error('LEAD_NOT_FOUND');

  const dispatch = await Dispatch.create({
    leadId: lead._id,
    quotationId: (quotationId && mongoose.Types.ObjectId.isValid(quotationId)) ? quotationId : null,
    loadingPoint,
    destination,
    truckNo,
    driverName,
    driverPhoneEncrypted: driverPhone ? encryptText(driverPhone) : '',
    driverPhoneMasked: driverPhone ? maskPhone(driverPhone) : '',
    material,
    quantity,
    dispatchStatus: 'Pending'
  });

  
  lead.stage = 'DISPATCH_PENDING';
  await lead.save();

  await recordAudit({
    actorId,
    actionType: 'LEAD_STAGE_CHANGED',
    entityType: 'DISPATCH',
    entityId: dispatch._id.toString(),
    severity: 'LOW',
    metadata: { leadId, truckNo }
  });

  return dispatch;
}

async function listDispatches(user) {
  const filter = {};
  if (user.role !== 'ADMIN' && user.role !== 'MANAGER' && user.role !== 'PROCUREMENT') {
    const myLeads = await Lead.find({ assignedTo: user._id }).select('_id');
    const myLeadIds = myLeads.map(l => l._id);
    filter.leadId = { $in: myLeadIds };
  }
  return Dispatch.find(filter).populate('leadId').sort({ createdAt: -1 });
}

async function updateDispatchStatus({ id, status, remarks = '', actorId }) {
  const dispatch = await Dispatch.findById(id);
  if (!dispatch) throw new Error('DISPATCH_NOT_FOUND');

  dispatch.dispatchStatus = status;
  if (remarks) dispatch.issueRemarks = remarks;
  
  if (status === 'Delivered') {
    dispatch.deliveryDate = new Date();
    
    const lead = await Lead.findById(dispatch.leadId);
    if (lead) {
      lead.stage = 'PAYMENT_PENDING';
      await lead.save();
    }
  }
  
  await dispatch.save();

  await recordAudit({
    actorId,
    actionType: 'LEAD_STAGE_CHANGED',
    entityType: 'DISPATCH',
    entityId: dispatch._id.toString(),
    severity: 'LOW',
    metadata: { status, remarks }
  });

  return dispatch;
}

async function uploadDispatchProof({ id, proofDocumentId, actorId }) {
  const dispatch = await Dispatch.findById(id);
  if (!dispatch) throw new Error('DISPATCH_NOT_FOUND');

  dispatch.proofDocumentId = proofDocumentId;
  await dispatch.save();

  await recordAudit({
    actorId,
    actionType: 'LEAD_STAGE_CHANGED',
    entityType: 'DISPATCH',
    entityId: dispatch._id.toString(),
    severity: 'LOW',
    metadata: { proofDocumentId }
  });

  return dispatch;
}

module.exports = {
  createTruck,
  listTrucks,
  createDriver,
  listDrivers,
  createDispatch,
  listDispatches,
  updateDispatchStatus,
  uploadDispatchProof
};
