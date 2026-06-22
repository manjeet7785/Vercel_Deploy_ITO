const router = require('express').Router();
const { authenticate } = require('../../middlewares/auth.middleware');
const rbac = require('../../middlewares/rbac.middleware');
const checkPermission = require('../../middlewares/permission.middleware');
const { getLeadsList, getLeadDetails, changeLeadStage } = require('./lead.controller');
const { createFromChat } = require('./ai-agent/aiLead.controller');
const { scoreLead } = require('./ai-agent/leadScoring.service');

router.use(authenticate);


router.post('/from-chat', createFromChat);
router.post('/score', async (req, res, next) => {
  try {
    const { score, priority } = require('./ai-agent/leadScoring.service').scoreAndClassifyLead(req.body);
    return require('../../utils/response').ok(res, { score, priority }, 'Lead scored successfully', 200, req);
  } catch (error) {
    next(error);
  }
});


router.get('/', checkPermission('leadPermission', 'taskPermission'), getLeadsList);
router.get('/unassigned', rbac('ADMIN', 'MANAGER', 'HR'), checkPermission('leadPermission', 'taskPermission'), async (req, res, next) => {
  try {
    const Lead = require('./lead.model');
    const { getLeadDisplay } = require('./lead.service');
    const leads = await Lead.find({ assignedTo: null }).sort({ createdAt: -1 });
    return require('../../utils/response').ok(res, { leads: leads.map(l => getLeadDisplay(l, req.user)) }, 'Unassigned leads list', 200, req);
  } catch (error) {
    next(error);
  }
});

router.get('/:id', checkPermission('leadPermission', 'taskPermission'), getLeadDetails);
router.patch('/:id/stage', checkPermission('leadPermission', 'taskPermission'), changeLeadStage);
router.patch('/:id', checkPermission('leadPermission', 'taskPermission'), changeLeadStage); 

module.exports = router;
