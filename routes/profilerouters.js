const express = require('express');
const router = express.Router();

const { updateUser, updatePassword, addAddress, getAddress, getOneAddress, updateAddress, deleteAddress, getMyproductCount,getMyOrderCount, getMyMoney, getMyComplete } = require('../controllers/profilecontroller');

router.put('/updateuser', updateUser);
router.put('/updatepass', updatePassword);
router.post('/addaddress', addAddress);
router.get('/getaddress', getAddress);
router.get('/getoneaddress/:id', getOneAddress);
router.put('/updateaddress/:id', updateAddress);
router.delete('/deleteaddress/:id', deleteAddress);
router.get('/getmyproductcount', getMyproductCount);
router.get('/getmyordercount', getMyOrderCount);
router.get('/getmymoney', getMyMoney);
router.get('/getmycomplete', getMyComplete);

module.exports = router;