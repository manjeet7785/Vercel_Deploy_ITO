const router = require('express').Router();
const auth = require('../middleware/auth');
const { requestQuotation, pendingQuotations, approveQuotation, rejectQuotation } = require('../controllers/quotationController');

router.use(auth);
router.post('/request', requestQuotation);
router.get('/pending', pendingQuotations);
router.patch('/:id/approve', approveQuotation);
router.patch('/:id/reject', rejectQuotation);

module.exports = router;