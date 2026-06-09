import mongoose from 'mongoose';

const auditLogSchema = new mongoose.Schema({
  actorId: { type: String, required: true },
  actionType: { type: String, required: true },
  entityType: { type: String, required: true },
  entityId: { type: String, required: true },
  ipAddress: { type: String },
  deviceHash: { type: String },
  severity: { type: String, enum: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'], default: 'LOW' },
  metadata: { type: mongoose.Schema.Types.Mixed }
}, { timestamps: true });

export const AuditLog = mongoose.model('AuditLog', auditLogSchema);
