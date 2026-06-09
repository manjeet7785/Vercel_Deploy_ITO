const router = require('express').Router();
const auth = require('../middleware/auth');
const { register, login, me } = require('../controllers/authController');



// Example route
router.post('/register', (req, res) => {
  res.json({ message: 'Register route' });
});

router.post('/login', (req, res) => {
  res.json({ message: 'Login route' });
});


router.get('/me', auth, me);

module.exports = router;




