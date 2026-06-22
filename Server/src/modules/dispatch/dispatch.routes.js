const router = require('express').Router();
const { authenticate } = require('../../middlewares/auth.middleware');
const rbac = require('../../middlewares/rbac.middleware');
const { createTruck, getTrucks, createDriver, getDrivers, createDispatch, getDispatches, updateStatus, uploadProof } = require('./dispatch.controller');

router.use(authenticate);

const checkDispatchAccess = (req, res, next) => {
  if (
    ['ADMIN', 'MANAGER', 'PROCUREMENT'].includes(req.user.role) ||
    req.user.dispatchPermission === true
  ) {
    return next();
  }
  return require('../../utils/response').fail(
    res,
    403,
    'RBAC_FORBIDDEN',
    'Forbidden: Access restricted to Admin, Manager, Procurement or users with dispatch permission',
    [],
    req
  );
};


router.post('/', checkDispatchAccess, createDispatch);
router.get('/', getDispatches);
router.patch('/:id/status', updateStatus);
router.patch('/:id', updateStatus); 
router.post('/:id/proof', uploadProof);


router.post('/trucks', checkDispatchAccess, createTruck);
router.get('/trucks', getTrucks);


router.post('/drivers', checkDispatchAccess, createDriver);
router.get('/drivers', getDrivers);

module.exports = router;
