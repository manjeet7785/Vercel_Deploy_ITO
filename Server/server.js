const express = require('express');
const app = express();
const connectDB = require('./Database');
const authRoutes = require('./routes/authRoutes');
const leadRoutes = require('./routes/aiLeadRoutes');
const adminRoutes = require('./routes/adminRoutes');
const dispatchRoutes = require('./routes/dispatchRoutes');
const documentRoutes = require('./routes/documentRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const reportRoutes = require('./routes/reportRoutes');
const securityRoutes = require('./routes/securityRoutes');
const quotationRoutes = require('./routes/quotationRoutes');

const aiLeadRoutes = require('./routes/aiLeadRoutes');
const cors = require('cors');

app.use(cors());
require('dotenv').config();

const PORT = process.env.PORT;

connectDB();

app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/leads', aiLeadRoutes);

app.use('/api/admin', adminRoutes);
// app.use('/api/ai-leads', aiLeadRoutes);
app.use('/api/dispatch', dispatchRoutes);
app.use('/api/documents', documentRoutes);

app.use('/api/payments', paymentRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/security', securityRoutes);
app.use('/api/quotations', quotationRoutes);
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
