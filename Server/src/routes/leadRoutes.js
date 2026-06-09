const router = require('express').Router();
const auth = require('../middleware/auth');
const rbac = require('../middleware/rbac');
const { createFromChat, listLeads, getLeadById, addActivity, updateStage, assignLead } = require('../controllers/leadController');

router.use(auth);

// Lead routes
router.post('/from-chat', createFromChat);
router.post('/', createFromChat);
router.get('/', listLeads);
router.get('/:leadId', getLeadById);
router.post('/:leadId/activity', addActivity);
router.patch('/:leadId/stage', updateStage);
router.patch('/:leadId/assign', rbac('ADMIN', 'MANAGER'), assignLead);

module.exports = router;