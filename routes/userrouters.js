const express = require('express');
const router = express.Router();

const { getUsersess, getAdmin, getUser, deleteUser, deleteAllUser } = require('../controllers/usercontroller');

router.get('/get-user', getUsersess);
router.get('/get-admin', getAdmin);
router.get('/users', getUser);
router.delete('/deleteuser', deleteUser);
router.delete('/deletealluser', deleteAllUser);

module.exports = router;