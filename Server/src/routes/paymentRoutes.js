const router = require('express').Router();
const auth = require('../middleware/auth');
const rbac = require('../middleware/rbac');
const { createPayment, listPayments, updatePaymentStatus } = require('../controllers/paymentController');

router.use(auth, rbac('ADMIN', 'MANAGER', 'ACCOUNTS'));
router.post('/', createPayment);
router.get('/', listPayments);
router.patch('/:id', updatePaymentStatus);

module.exports = router;