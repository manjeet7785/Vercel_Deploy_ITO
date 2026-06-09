const router = require('express').Router();
const auth = require('../middleware/auth');
const rbac = require('../middleware/rbac');
const { adminSummary } = require('../controllers/reportController');

router.use(auth, rbac('ADMIN', 'MANAGER'));
router.get('/admin-summary', adminSummary);

module.exports = router;
