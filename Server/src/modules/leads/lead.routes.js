import { Router } from 'express';
import { createLead, getLeads, updateLeadStage } from './lead.controller.js';
import { protect } from '../../middlewares/auth.middleware.js';
import { authorizeRoles } from '../../middlewares/rbac.middleware.js';
import { enforceDataMasking } from '../../middlewares/mask.middleware.js';

const router = Router();
router.post('/', protect, authorizeRoles('ADMIN', 'SALES'), createLead);
router.post('/from-chat', protect, authorizeRoles('ADMIN', 'SALES'), createLead);
router.get('/', protect, authorizeRoles('ADMIN', 'SALES'), enforceDataMasking, getLeads);
router.patch('/:id/stage', protect, authorizeRoles('ADMIN', 'SALES'), updateLeadStage);

export default router;
