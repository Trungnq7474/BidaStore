const express = require('express');
const router = express.Router();
const { sendContact, getContact, readContact, deleteContact, getContactcount, replyContact } = require('../controllers/contactcontroller');

router.post('/sendcontact', sendContact);
router.get('/getcontact', getContact);
router.post('/readcontact', readContact);
router.delete('/deletecontact', deleteContact);
router.get('/getcontactcount', getContactcount);
router.post('/replycontact', replyContact);

module.exports = router;