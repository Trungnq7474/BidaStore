const express = require('express');
const router = express.Router();

const { createOrder, getOrder, getAllOrders, getOrderItems, deleteOrder, updateStatus, getMyorder, getOrdercount, getReve, getOrdermonth, getNoti, readNoti, getUsernoti, readUsernoti, deleteUsernoti, deleteAminnoti, getMyproductCount, getMyOrderCount, getMyMoney, getMyComplete, checkPayment, sePay } = require('../controllers/paycontroller');

router.post('/createorder', createOrder);
router.get('/getorder/:id', getOrder);
router.get('/getallorders', getAllOrders);
router.get('/getorderitems/:id', getOrderItems);
router.delete('/deleteorder', deleteOrder);
router.put('/updatestatus', updateStatus);
router.get('/getmyorder', getMyorder);
router.get('/getordercount', getOrdercount);
router.get('/getreve', getReve);
router.get('/getordermonth', getOrdermonth);
router.get('/getnoti', getNoti);
router.put('/readnoti', readNoti);
router.get('/getusernoti', getUsernoti);
router.put('/readusernoti', readUsernoti);
router.delete('/deleteusernoti', deleteUsernoti);
router.delete('/deleteadminnoti', deleteAminnoti);
router.get('/getmyproductcount', getMyproductCount);
router.get('/getmyordercount', getMyOrderCount);
router.get('/getmymoney', getMyMoney);
router.get('/getmycomplete', getMyComplete);
router.get('/checkpayment/:id', checkPayment);
router.post('/webhook/sepay', sePay);



module.exports = router;