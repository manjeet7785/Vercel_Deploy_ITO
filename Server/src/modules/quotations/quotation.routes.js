const router = require('express').Router();
const { authenticate } = require('../../middlewares/auth.middleware');
const rbac = require('../../middlewares/rbac.middleware');
const { requestQuotation, pendingQuotations, approveQuotation, rejectQuotation, markSentToCustomer, getSummaryReport } = require('./quotation.controller');

router.use(authenticate);

router.post('/request', requestQuotation);
router.get('/pending', pendingQuotations);

const checkQuotationApprovalAccess = (req, res, next) => {
  if (req.user.role === 'ADMIN' || req.user.quotationPermission === true) {
    return next();
  }
  return require('../../utils/response').fail(
    res,
    403,
    'RBAC_FORBIDDEN',
    'Forbidden: Access restricted to Admin or users with quotation approval permission',
    [],
    req
  );
};

router.patch('/:id/approve', checkQuotationApprovalAccess, approveQuotation);
router.patch('/:id/reject', checkQuotationApprovalAccess, rejectQuotation);
router.patch('/:id/sent-to-customer', markSentToCustomer);
router.get('/summary', rbac('ADMIN', 'MANAGER'), getSummaryReport);

module.exports = router;
