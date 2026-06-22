const Lead = require('../lead.model');
const LeadActivity = require('../leadActivity.model');
const { encryptText, hashText, hashCompanyName, maskPhone, maskEmail } = require('../../../utils/crypto');
const { scoreAndClassifyLead } = require('./leadScoring.service');
const { autoRouteLead } = require('../leadAssignment.service');
const { recordAudit } = require('../../security-audit/auditLog.service');

async function processAiLead(payload, actorId = null) {
  const contactPerson = payload.contactPerson || payload.customerName || '';
  const mobile = payload.mobile || payload.phone || payload.whatsapp || '';
  const email = payload.email || '';
  const productCategory = payload.productCategory || payload.productRequired || '';
  const quantity = String(payload.quantity || '');
  const destination = payload.destination || '';
  const companyName = payload.companyName || '';
  const chatSummary = payload.chatSummary || '';
  const paymentTerms = payload.paymentTerms || '';

  
  if (!contactPerson || !mobile || !productCategory) {
    throw new Error('VALIDATION_FAILED: customerName, mobile/phone, and productCategory are required');
  }

  
  const phoneHash = hashText(mobile);
  const emailHash = email ? hashText(email) : '';
  const companyNameHash = companyName ? hashCompanyName(companyName) : '';

  const duplicateQueries = [{ phoneHash }];
  if (emailHash) duplicateQueries.push({ emailHash });
  if (companyNameHash && productCategory) {
    duplicateQueries.push({ companyNameHash, productCategory });
  }

  const duplicate = await Lead.findOne({ $or: duplicateQueries });

  
  const { priority } = scoreAndClassifyLead({
    quantity,
    hasLOI: payload.hasLOI,
    paymentTerms,
    contactPerson,
    mobile,
    email,
    chatSummary
  });

  
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 10000);
  const leadCode = `LD-${timestamp}-${random}`;

  const lead = await Lead.create({
    leadCode,
    source: 'AI_AGENT',
    customerName: contactPerson,
    companyName,
    companyNameHash,
    phoneEncrypted: encryptText(mobile),
    phoneMasked: maskPhone(mobile),
    phoneHash,
    emailEncrypted: email ? encryptText(email) : '',
    emailMasked: email ? maskEmail(email) : '',
    emailHash,
    productCategory,
    quantity,
    destination,
    priority,
    stage: 'NEW_LEAD',
    duplicateOf: duplicate ? duplicate._id : null,
    chatSummary,
    originalPayload: payload, 
    createdBy: actorId
  });

  
  await LeadActivity.create({
    leadId: lead._id,
    actionType: 'LEAD_CREATED',
    note: 'Lead created via AI Agent chat integration',
    actorId
  });

  
  await recordAudit({
    actorId,
    actionType: 'AI_LEAD_CREATED',
    entityType: 'LEAD',
    entityId: lead._id.toString(),
    severity: duplicate ? 'MEDIUM' : 'LOW',
    metadata: { leadCode, duplicateDetected: !!duplicate }
  });

  
  const routing = await autoRouteLead(lead);

  return {
    leadId: lead._id.toString(),
    priority: lead.priority,
    assignedDepartment: routing.assignedDepartment,
    assignedEmployee: routing.assignedTo ? routing.assignedTo.toString() : null,
    adminReviewRequired: routing.adminReviewRequired
  };
}

module.exports = { processAiLead };
