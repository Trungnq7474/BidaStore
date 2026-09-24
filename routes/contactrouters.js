const express = require('express');
const router = express.Router();
const { sendContact, getContact, readContact, deleteContact, deleteAllContact, getContactcount} = require('../controllers/contactcontroller');

router.post('/sendcontact', sendContact);
router.get('/getcontact', getContact);
router.post('/readcontact', readContact);
router.delete('/deletecontact', deleteContact);
router.delete('/deletecontactall', deleteAllContact);
router.get('/getcontactcount', getContactcount);

module.exports = router;