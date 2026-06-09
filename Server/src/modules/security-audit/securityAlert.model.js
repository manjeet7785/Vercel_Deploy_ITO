import mongoose from 'mongoose';

const securityAlertSchema = new mongoose.Schema({
  actorId: { type: String, required: true },
  alertType: { type: String, required: true },
  severity: { type: String, enum: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'], required: true },
  message: { type: String, required: true },
  status: { type: String, enum: ['OPEN', 'REVIEWED'], default: 'OPEN' }
}, { timestamps: true });

export const SecurityAlert = mongoose.model('SecurityAlert', securityAlertSchema);
