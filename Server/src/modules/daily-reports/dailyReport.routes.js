const router = require('express').Router();
const { authenticate } = require('../../middlewares/auth.middleware');
const rbac = require('../../middlewares/rbac.middleware');
const { submitDailyReport, getMyReports, getAdminReports } = require('./dailyReport.controller');

router.use(authenticate);

router.post('/', submitDailyReport);
router.get('/my', getMyReports);
router.get('/admin', rbac('ADMIN', 'MANAGER'), getAdminReports);

module.exports = router;
