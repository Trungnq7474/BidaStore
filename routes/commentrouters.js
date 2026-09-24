const express = require('express');
const router = express.Router();

const { addComment, getComment, getAllComment, replyComment, updateComment, deleteComment, deleteAllComment, getCommentcount, checkBuy } = require('../controllers/commentcontroller');

router.post('/addcomment', addComment);
router.get('/getcomment/:product_id', getComment);
router.get('/getallcomment', getAllComment);
router.post('/replycomment', replyComment);
router.put('/updatecomment', updateComment);
router.delete('/deletecomment', deleteComment);
router.delete('/deleteallcomment', deleteAllComment);
router.get('/getcommentcount', getCommentcount);
router.get('/checkbuy', checkBuy);

module.exports = router;