const mongoose = require('mongoose');

const roleSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      unique: true,
      required: true
    },
    description: {
      type: String,
      default: ''
    },
    level: {
      type: Number,
      default: 0
    },
    permissions: [{
      type: String
    }]
  },
  { timestamps: true }
);

module.exports = mongoose.model('Role', roleSchema);
