const express = require('express');
const router = express.Router();

const { addVoucher, getVouchers, deleteVouchers, updateVouchers, updateVouchersstatus } = require('../controllers/vouchercontroller');

router.post('/add-voucher', addVoucher);
router.get('/getvouchers', getVouchers);
router.delete('/deletevouchers', deleteVouchers);
router.put('/updatevouchers', updateVouchers);
router.put('/updatevouchersstatus', updateVouchersstatus);

module.exports = router;