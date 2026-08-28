const express = require('express');
const router = express.Router();

const { addtoCart, getCart, increase, decrease, removeItem, removeAll } = require('../controllers/cartcontroller');
router.post('/add-cart', addtoCart);
router.get('/get-cart', getCart);
router.put('/increase', increase);
router.put('/decrease', decrease);
router.delete('/remove-item', removeItem);
router.delete('/remove-all', removeAll);

module.exports = router;