const { sql } = require('../config/db');
const crypto = require('crypto');
const transporter = require('../config/mailer');
const { error } = require('console');

// Đăng Ký 
const register = async (req, res) => {
    const {
        username, password, email, phone 
    } = req.body;

    try {
        const check = await sql.query 
        `
            SELECT * FROM users WHERE email = ${email}
        `;

        if(check.recordset.length > 0){
            return res.send ("sai");
        }

        const result = await sql.query
        `
            INSERT INTO users (username, password, email, phone, membership_rank)
            OUTPUT INSERTED.id
            VALUES (${username}, ${password}, ${email}, ${phone}, N'HẠNG ĐỒNG')
        `;

        const user_id = result.recordset[0].id;

        await sql.query`
            INSERT INTO notifications (message, type)
            VALUES (
                ${`Có Người Dùng USR-00${user_id} Mới ${username}`},'user'
            )
        `;

        res.send("ok");
    } 

    catch (err) {
        res.status(500).send(err.message);
    }
};

// Đăng Nhập

const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const result = await sql.query`
            SELECT * FROM users 
            WHERE email = ${email} 
            AND password = ${password}
        `;

        if (result.recordset.length > 0) {
            const user = result.recordset[0];

            req.session.user = {
                id: user.id,
                username: user.username,
                email: user.email,
                phone: user.phone,
                role: user.role
            }

            res.send(user.role);

        } else {
            res.send("sai");
        }

    } catch (err) {
        res.status(500).send(err.message);
    }
};

// Đăng Xuất
const logout = (req, res) => {
    req.session.destroy(() =>{
        res.json({success: true});
    });
};

const otpStore = new Map();

const sendForgotPasswordOTP = async (req, res) => {
    const { email } = req.body;

    try {
        const result = await sql.query`
            SELECT id FROM users
            WHERE email = ${email}
        `;

        if(result.recordset.length === 0) {
            return res.send("sai");
        }

        const otp = crypto.randomInt(100000, 1000000).toString();

        otpStore.set(email, {
            otp: otp,
            expires: Date.now() + 2 * 60 * 1000
        });

        await transporter.sendMail ({
            from: process.env.RESEND_API_KEY
                ? process.env.RESEND_FROM_EMAIL
                : process.env.EMAIL_USER,
            to: email,
            subject: "MÃ OTP BIDASTORE",
            text: `Mã OTP Của Bạn Là ${otp}. \nMã Có Hiệu Lực Trong 2 Phút.`
        });

        res.send("ok");
    }

    catch (err) {
        res.status(500).send(err.message);
    }
};

const verifyForgotPassOTP = (req, res) => {
    const { email, otp } = req.body;

    const data = otpStore.get(email);

    if(!data) {
        return res.send("not");
    }

    if(Date.now() > data.expires) {
        otpStore.delete(email);
        return res.send("expired");
    }

    if(data.otp !== otp) {
        return res.send("fault")
    }

    data.verified = true;
    otpStore.set(email, data);

    res.send("ok");
};

const resetForgotPass = async (req, res) => {
    const { email, newPass } = req.body;

    const data = otpStore.get(email);

    if (!data || !data.verified) {
        return res.send("not_verified");
    }

    if (Date.now() > data.expires) {
        otpStore.delete(email);
        return res.send("expired");
    }

    try {
        await sql.query`
            UPDATE users
            SET password = ${newPass}
            WHERE email = ${email}
        `;

        otpStore.delete(email);
        res.send("ok");
    }
    
    catch (err) {
        res.status(500).send(err.message);
    }
};

module.exports = { register, login, logout, sendForgotPasswordOTP, verifyForgotPassOTP, resetForgotPass }; 
