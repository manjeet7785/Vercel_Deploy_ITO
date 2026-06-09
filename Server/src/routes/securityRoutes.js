const router = require('express').Router();
const auth = require('../middleware/auth');
const rbac = require('../middleware/rbac');
const { reveal, logs, alerts } = require('../controllers/securityController');

router.use(auth, rbac('ADMIN', 'MANAGER', 'SALES', 'PROCUREMENT', 'ACCOUNTS', 'HR', 'IT'));
router.post('/reveal', reveal);
router.get('/logs', logs);
router.get('/alerts', alerts);

module.exports = router;