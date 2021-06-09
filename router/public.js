const router = require('express').Router();
const controller = require('../controller/public');

router.post('/get-contact', controller.getContact);

module.exports = router;