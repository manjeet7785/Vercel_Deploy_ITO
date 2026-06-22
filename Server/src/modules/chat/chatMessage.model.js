const mongoose = require('mongoose');

const chatMessageSchema = new mongoose.Schema(
  {
    sessionId: { type: String, required: true, index: true },
    sender: { type: String, enum: ['CLIENT', 'AI_AGENT', 'ADMIN', 'SYSTEM'], required: true },
    senderName: { type: String, required: true },
    message: { type: String, required: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model('ChatMessage', chatMessageSchema);
