import { Lead } from './lead.model.js';
import { encrypt, decrypt, generateHash } from '../../utils/crypto.js';
import { AuditLog } from '../security-audit/auditLog.model.js';

export const createLead = async (req, res, next) => {
  try {
    const { source, customerName, companyName, mobile, email, productCategory, quantity, destination, chatSummary } = req.body;
    const phoneHash = generateHash(mobile);
    const existing = await Lead.findOne({ phoneHash, productCategory });

    if (existing) {
      return res.status(409).json({ success: false, message: 'Duplicate lead identification rule matched structural criteria', errorCode: 'DUPLICATE_LEAD_FOUND' });
    }

    const count = await Lead.countDocuments();
    const leadCode = `ITO-${productCategory.substring(0, 3)}-${1000 + count + 1}`;

    const lead = await Lead.create({
      leadCode,
      source,
      customerName,
      companyName,
      phoneEncrypted: encrypt(mobile),
      phoneHash,
      emailEncrypted: email ? encrypt(email) : null,
      emailHash: email ? generateHash(email) : null,
      productCategory,
      quantity,
      destination,
      chatSummary
    });

    await AuditLog.create({ actorId: req.user?.employeeId || 'SYSTEM', actionType: 'LEAD_CREATED', entityType: 'LEAD', entityId: lead._id, severity: 'LOW' });
    res.status(201).json({ success: true, message: 'Lead added cleanly into corporate perimeter registry', data: lead });
  } catch (error) {
    next(error);
  }
};

export const getLeads = async (req, res, next) => {
  try {
    const query = {};
    if (req.user.role === 'SALES') {
      query.productCategory = req.user.department;
    }

    const rawLeads = await Lead.find(query);
    const data = rawLeads.map((l) => {
      const obj = l.toObject();
      obj.phoneRaw = decrypt(obj.phoneEncrypted);
      obj.emailRaw = obj.emailEncrypted ? decrypt(obj.emailEncrypted) : '';
      return obj;
    });

    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

export const updateLeadStage = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { newStage } = req.body;
    const lead = await Lead.findById(id);
    if (!lead) return res.status(404).json({ success: false, message: 'Target profile tracking match entity missing' });

    lead.stage = newStage;
    await lead.save();

    await AuditLog.create({ actorId: req.user.employeeId, actionType: 'LEAD_STAGE_CHANGED', entityType: 'LEAD', entityId: lead._id, metadata: { newStage }, severity: 'LOW' });
    res.json({ success: true, message: 'Stage updated dynamically', data: lead });
  } catch (error) {
    next(error);
  }
};
