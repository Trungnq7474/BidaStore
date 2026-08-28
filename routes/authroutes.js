const express = require('express');
const router = express.Router();

const { register, login, logout, getUsersess, getAdmin, getUser, deleteUser, updateUser, updatePassword } = require('../controllers/authcontroller');

router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);
router.get('/get-user', getUsersess);
router.get('/get-admin', getAdmin);
router.get('/users', getUser);
router.put('/updateuser', updateUser);
router.put('/updatepass', updatePassword);
router.delete('/deleteuser', deleteUser);

module.exports = router;

