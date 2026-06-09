const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema(
  {
    ownerType: { type: String, enum: ['LEAD', 'USER', 'QUOTATION', 'DISPATCH', 'PAYMENT'], required: true },
    ownerId: { type: mongoose.Schema.Types.ObjectId, required: true },
    fileName: { type: String, required: true },
    mimeType: { type: String, default: '' },
    storagePath: { type: String, required: true },
    uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    accessLevel: { type: String, enum: ['PUBLIC', 'INTERNAL', 'RESTRICTED', 'ADMIN'], default: 'RESTRICTED' },
    checksum: { type: String, default: '' },
    virusScanStatus: { type: String, enum: ['PENDING', 'CLEAN', 'FLAGGED'], default: 'PENDING' },
    isDeleted: { type: Boolean, default: false },
    lastReminderAt: { type: Date, default: null }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Document', documentSchema);
