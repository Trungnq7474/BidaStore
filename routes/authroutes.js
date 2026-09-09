const express = require('express');
const router = express.Router();

const { register, login, logout, getUsersess, getAdmin, getUser, deleteUser, updateUser, updatePassword, addAddress, getAddress, getOneAddress, updateAddress, deleteAddress } = require('../controllers/authcontroller');

router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);
router.get('/get-user', getUsersess);
router.get('/get-admin', getAdmin);
router.get('/users', getUser);
router.put('/updateuser', updateUser);
router.put('/updatepass', updatePassword);
router.delete('/deleteuser', deleteUser);
router.post('/addaddress', addAddress);
router.get('/getaddress', getAddress);
router.get('/getoneaddress/:id', getOneAddress);
router.put('/updateaddress/:id', updateAddress);
router.delete('/deleteaddress/:id', deleteAddress);

module.exports = router;

