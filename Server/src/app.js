import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import authRoutes from './modules/auth/auth.routes.js';
import leadRoutes from './modules/leads/lead.routes.js';
import quoteRoutes from './modules/quotations/quotation.routes.js';
import auditRoutes from './modules/security-audit/audit.routes.js';
import { errorHandler } from './middlewares/error.middleware.js';

const app = express();

app.use(helmet());
app.use(cors({ origin: '*' }));
app.use(express.json());

app.get('/api/v1/health', (req, res) => {
  res.json({ success: true, service: 'ITO Operational Backend Control Module Active', status: 'ONLINE', timestamp: new Date() });
});

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/leads', leadRoutes);
app.use('/api/v1/ai/leads', leadRoutes);
app.use('/api/v1/quotations', quoteRoutes);
app.use('/api/v1/security', auditRoutes);

app.use(errorHandler);

export { app };
