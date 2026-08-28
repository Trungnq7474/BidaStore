const express = require('express');
const router = express.Router();

const {getproducts, getproducts2, searchProducts, addPro, upload, deletePro, getProcate, updatePro, getProductcount, getTopproduct, getTopten } = require('../controllers/productcontroller');

router.get('/product/:product_id', getproducts);
router.get('/products', getproducts2);
router.get('/search', searchProducts);
router.delete('/deletepro', deletePro);
router.post('/addpro', upload.single('image'), addPro);
router.get('/getprocate/:category', getProcate);
router.put('/updatepro', upload.single('image'), updatePro);
router.get('/getproductcount', getProductcount);
router.get('/gettopproduct', getTopproduct);
router.get('/gettopten', getTopten);

module.exports = router;
