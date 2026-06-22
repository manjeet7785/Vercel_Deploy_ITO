const router = require('express').Router();
const { authenticate } = require('../../middlewares/auth.middleware');
const rbac = require('../../middlewares/rbac.middleware');
const { createEmployee, listUsers, deactivateUser } = require('./user.controller');

router.use(authenticate);

router.post('/', rbac('ADMIN', 'HR'), createEmployee);
router.get('/', rbac('ADMIN', 'MANAGER', 'HR'), listUsers);
router.patch('/:id/deactivate', rbac('ADMIN'), deactivateUser);

module.exports = router;
