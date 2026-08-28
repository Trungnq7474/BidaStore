const express = require('express');
const router = express.Router();

const { sendMess, getMess, getUsermess, upload, getRead, readMess, readMessadmin, getAdminread } = require('../controllers/messcontroller');

router.post('/sendmess', upload.array('files'), sendMess);
router.get('/getmess/:user_id', getMess);
router.get('/getusermess', getUsermess);
router.get('/getread/:user_id', getRead);
router.put('/readmess/:user_id', readMess);
router.put('/readmessadmin/:user_id', readMessadmin);
router.get('/getadminread', getAdminread);

module.exports = router;