const mongoose = require('mongoose');

const auditLogSchema = new mongoose.Schema(
  {
    actorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    actionType: { type: String, required: true },
    entityType: { type: String, required: true },
    entityId: { type: String, required: true },
    ipAddress: { type: String, default: '' },
    deviceHash: { type: String, default: '' },
    severity: { type: String, enum: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'], default: 'LOW' },
    metadata: { type: Object, default: {} },
    createdAt: { type: Date, default: Date.now }
  },
  { versionKey: false }
);

module.exports = mongoose.model('AuditLog', auditLogSchema);
