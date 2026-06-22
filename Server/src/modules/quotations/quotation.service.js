const Quotation = require('./quotation.model');
const Lead = require('../leads/lead.model');
const { recordAudit } = require('../security-audit/auditLog.service');

async function createQuotationRequest({ leadId, employeeRequestedPrice, marginNote, paymentTerms, validityDays, actorId }) {
  const lead = await Lead.findById(leadId);
  if (!lead) throw new Error('LEAD_NOT_FOUND');

  const quotation = await Quotation.create({
    leadId,
    requestedBy: actorId,
    employeeRequestedPrice,
    marginNote,
    paymentTerms,
    validityDays: validityDays || 7,
    status: 'PENDING'
  });

  await recordAudit({
    actorId,
    actionType: 'QUOTATION_REQUESTED',
    entityType: 'QUOTATION',
    entityId: quotation._id.toString(),
    severity: 'LOW',
    metadata: { leadId }
  });

  return quotation;
}

async function approveQuotation({ id, approvedPrice, actorId }) {
  const quotation = await Quotation.findById(id);
  if (!quotation) throw new Error('QUOTATION_NOT_FOUND');

  quotation.status = 'APPROVED';
  quotation.approvedPrice = approvedPrice || quotation.employeeRequestedPrice;
  quotation.approvedBy = actorId;
  quotation.approvedAt = new Date();
  await quotation.save();

  
  await Lead.findByIdAndUpdate(quotation.leadId, { stage: 'QUOTATION_APPROVED' });

  await recordAudit({
    actorId,
    actionType: 'QUOTATION_APPROVED',
    entityType: 'QUOTATION',
    entityId: quotation._id.toString(),
    severity: 'MEDIUM',
    metadata: { approvedPrice }
  });

  return quotation;
}

async function rejectQuotation({ id, marginNote, actorId }) {
  const quotation = await Quotation.findById(id);
  if (!quotation) throw new Error('QUOTATION_NOT_FOUND');

  quotation.status = 'REJECTED';
  if (marginNote) quotation.marginNote = marginNote;
  await quotation.save();

  await recordAudit({
    actorId,
    actionType: 'QUOTATION_REJECTED',
    entityType: 'QUOTATION',
    entityId: quotation._id.toString(),
    severity: 'LOW',
    metadata: { marginNote }
  });

  return quotation;
}

async function sendToCustomer(id, actorId) {
  const quotation = await Quotation.findById(id);
  if (!quotation) throw new Error('QUOTATION_NOT_FOUND');

  quotation.status = 'SENT_TO_CUSTOMER';
  await quotation.save();

  await Lead.findByIdAndUpdate(quotation.leadId, { stage: 'NEGOTIATION' });

  await recordAudit({
    actorId,
    actionType: 'LEAD_STAGE_CHANGED',
    entityType: 'QUOTATION',
    entityId: quotation._id.toString(),
    severity: 'LOW',
    metadata: { action: 'sent_to_customer' }
  });

  return quotation;
}

async function getQuotationSummary() {
  const stats = await Quotation.aggregate([
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 },
        totalValue: { $sum: '$employeeRequestedPrice' }
      }
    }
  ]);
  
  return {
    stats: stats.reduce((acc, curr) => {
      acc[curr._id] = {
        count: curr.count,
        value: curr.totalValue
      };
      return acc;
    }, {}),
    generatedAt: new Date().toISOString()
  };
}

module.exports = {
  createQuotationRequest,
  approveQuotation,
  rejectQuotation,
  sendToCustomer,
  getQuotationSummary
};
