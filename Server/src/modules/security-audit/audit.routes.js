const router = require('express').Router();
const { authenticate } = require('../../middlewares/auth.middleware');
const rbac = require('../../middlewares/rbac.middleware');
const { getLogs, getAlerts, revealSensitiveData, interceptBulkExportAttempt } = require('./audit.controller');

router.use(authenticate);

router.get('/alerts', rbac('ADMIN', 'MANAGER'), getAlerts);
router.get('/logs', rbac('ADMIN'), getLogs);
router.post('/reveal', revealSensitiveData);
router.post('/export-attempt', interceptBulkExportAttempt);

module.exports = router;
