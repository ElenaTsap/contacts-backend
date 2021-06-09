const router = require('express').Router();
const path = require('path');
const controller = require('../controller/public')
/* 
before using hbs

router.get('/test', (req, res) => res.sendFile(path.join(__dirname, '../view/test.html'))); */ //using the static path in order to send the file

router.get('/about', controller.about);

module.exports = router;