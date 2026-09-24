const express = require('express');
const router = express.Router();

const { createOrder, getOrder, getAllOrders, getOrderItems, deleteOrder, deleteOrderAll, updateStatus, getMyorder, getOrdercount, getRecentOrder } = require('../controllers/ordercontroller');

router.post('/createorder', createOrder);
router.get('/getorder/:id', getOrder);
router.get('/getallorders', getAllOrders);
router.get('/getorderitems/:id', getOrderItems);
router.delete('/deleteorder', deleteOrder);
router.delete('/deleteorderall', deleteOrderAll);
router.put('/updatestatus', updateStatus);
router.get('/getmyorder', getMyorder);
router.get('/getordercount', getOrdercount);
router.get('/getrecentorder', getRecentOrder);

module.exports = router;