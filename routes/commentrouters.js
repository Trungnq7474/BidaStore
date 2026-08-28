const express = require('express');
const router = express.Router();

const { addComment, getComment, getAllComment, replyComment, deleteComment, getCommentcount } = require('../controllers/commentcontroller');

router.post('/addcomment', addComment);
router.get('/getcomment/:product_id', getComment);
router.get('/getallcomment', getAllComment);
router.post('/replycomment', replyComment);
router.delete('/deletecomment', deleteComment);
router.get('/getcommentcount', getCommentcount);
module.exports = router;