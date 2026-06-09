const mongoose = require('mongoose');

const leadSchema = new mongoose.Schema(
  {
    leadCode: { type: String, unique: true, required: true, index: true },
    source: { type: String, enum: ['WEBSITE', 'AI_AGENT', 'WHATSAPP', 'INDIAMART', 'MANUAL', 'IMPORT'], required: true },
    customerName: { type: String, required: true },
    companyName: { type: String, default: '' },
    phoneEncrypted: { type: String, required: true },
    phoneMasked: { type: String, required: true },
    phoneHash: { type: String, required: true, index: true },
    emailEncrypted: { type: String, default: '' },
    emailMasked: { type: String, default: '' },
    emailHash: { type: String, default: '', index: true },
    productCategory: { type: String, required: true },
    quantity: { type: String, default: '' },
    destination: { type: String, default: '' },
    priority: { type: String, enum: ['HOT', 'WARM', 'COLD', 'FAKE', 'INCOMPLETE'], default: 'WARM' },
    stage: {
      type: String,
      enum: ['NEW_LEAD', 'ASSIGNED', 'CONTACTED', 'QUOTATION_REQUIRED', 'QUOTATION_REQUESTED', 'QUOTATION_SHARED', 'DISPATCH_PLANNED', 'PAYMENT_PENDING', 'DOCUMENT_PENDING', 'CLOSED_WON', 'CLOSED_LOST'],
      default: 'NEW_LEAD'
    },
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    assignedDepartment: { type: String, enum: ['STONE', 'COAL', 'TEA', 'RICE', 'TRANSPORT', 'ADMIN', 'IT', 'PROCUREMENT', 'ACCOUNTS', 'HR', 'SALES'], default: null },
    duplicateOf: { type: mongoose.Schema.Types.ObjectId, ref: 'Lead', default: null },
    chatSummary: { type: String, default: '' },
    nextFollowupAt: { type: Date, default: null },
    remarks: { type: String, default: '' }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Lead', leadSchema);
