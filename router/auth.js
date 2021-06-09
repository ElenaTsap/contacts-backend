const router = require('express').Router();
const authController = require('../controller/auth');

router.post('/register', authController.registerPost);
router.post('/login', authController.loginPost);

module.exports = router;