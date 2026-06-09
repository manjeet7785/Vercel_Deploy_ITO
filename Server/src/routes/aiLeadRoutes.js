const router = require('express').Router();
const auth = require('../middleware/auth');
const { createLeadFromChat } = require('../controllers/leadController');

router.use(auth);
router.post('/from-chat', createLeadFromChat);

module.exports = router;
