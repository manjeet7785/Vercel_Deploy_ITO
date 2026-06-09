const router = require('express').Router();
const auth = require('../middleware/auth');
const rbac = require('../middleware/rbac');
const { createDispatch, listDispatches, updateDispatchStatus } = require('../controllers/dispatchController');

router.use(auth, rbac('ADMIN', 'MANAGER', 'PROCUREMENT', 'SALES'));
router.post('/', createDispatch);
router.get('/', listDispatches);
router.patch('/:id', updateDispatchStatus);

module.exports = router;