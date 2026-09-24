const express = require('express');
const router = express.Router();
const passport = require('../config/passport');

const { register, login, logout, sendForgotPasswordOTP, verifyForgotPassOTP, resetForgotPass } = require('../controllers/authcontroller');

router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);
router.post('/sendotp', sendForgotPasswordOTP);
router.post('/verifyotp', verifyForgotPassOTP);
router.post('/resetpass', resetForgotPass);

// Đăng nhập bằng Google
router.get('/auth/google',
    passport.authenticate('google', {
        scope: ['profile', 'email']
    })
);

router.get('/auth/google/callback',
    passport.authenticate('google', {
        failureRedirect: '/register.html',
        session: false
    }),
    (req, res) => {
        const user = req.user;

        req.session.user = {
            id: user.id,
            username: user.username,
            email: user.email,
            phone: user.phone,
            role: user.role,
            membership_rank: user.membership_rank
        };

        req.session.save(() => {
            res.redirect('/register.html?googleLogin=success');
        });
    }
);

module.exports = router;

