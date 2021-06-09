const router = require('express').Router();
const contactsController = require('../controller/contacts');
const testMid = require('../middleware/test');
const logMid = require('../middleware/logs');
const auth = require('../middleware/auth');

//instead of running middleware in every single route we will put it in app.js in the /contacts route
router.post('/new', logMid.logger, contactsController.postContact); //inserting middleware
router.get('/all', logMid.logger, contactsController.getAll);
router.delete('/:contactId', logMid.logger, contactsController.deleteContact);
router.post('/update', logMid.logger, contactsController.updateContact);

module.exports = router;