const mongoose = require('mongoose');

const quotationSchema = new mongoose.Schema(
  {
    leadId: { type: mongoose.Schema.Types.ObjectId, ref: 'Lead', required: true },
    requestedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    employeeRequestedPrice: { type: Number, default: null },
    approvedPrice: { type: Number, default: null },
    marginNote: { type: String, default: '' },
    status: { type: String, enum: ['PENDING', 'APPROVED', 'REJECTED', 'SHARED'], default: 'PENDING' },
    approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    approvedAt: { type: Date, default: null },
    validityDays: { type: Number, default: 7 },
    paymentTerms: { type: String, default: '' }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Quotation', quotationSchema);
