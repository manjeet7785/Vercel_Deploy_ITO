const router = require('express').Router();
const { authenticate } = require('../../middlewares/auth.middleware');
const { getProducts, createProduct } = require('./product.controller');
const { fail } = require('../../utils/response');

router.get('/', getProducts);
router.post(
  '/',
  authenticate,
  (req, res, next) => {
    if (
      ['ADMIN', 'MANAGER', 'IT', 'SOFTWARE_ENGINEER'].includes(req.user.role) ||
      req.user.productUploadPermission
    ) {
      return next();
    }
    return fail(
      res,
      403,
      'RBAC_FORBIDDEN',
      'Forbidden: Access restricted to Admin, Manager, IT, Software Engineer or users with product upload permission',
      [],
      req
    );
  },
  createProduct
);

module.exports = router;
