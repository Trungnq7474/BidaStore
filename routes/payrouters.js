const express = require('express');
const router = express.Router();

const { getReve, getOrdermonth, getNoti, readNoti, getUsernoti, readUsernoti, deleteUsernoti, deleteAminnoti, checkPayment, sePay } = require('../controllers/paycontroller');

router.get('/getreve', getReve);
router.get('/getordermonth', getOrdermonth);
router.get('/getnoti', getNoti);
router.put('/readnoti', readNoti);
router.get('/getusernoti', getUsernoti);
router.put('/readusernoti', readUsernoti);
router.delete('/deleteusernoti', deleteUsernoti);
router.delete('/deleteadminnoti', deleteAminnoti);
router.get('/checkpayment/:id', checkPayment);
router.post('/webhook/sepay', sePay);

module.exports = router;