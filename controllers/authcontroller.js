const { sql } = require('../config/db');

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
            INSERT INTO users (username, password, email, phone)
            OUTPUT INSERTED.id
            VALUES (${username}, ${password}, ${email}, ${phone})
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
const getUsersess = (req, res) => {
    res.json({
        user: req.session.user || null //req.session.user → lấy user đã login || null → nếu không có thì trả null
    });
};

const getAdmin = async (req, res) => {
    try {
        const result = await sql.query`
            SELECT TOP 1 id, username FROM users WHERE role = 'admin'
        `;

        res.json(result.recordset[0]);
    }

    catch (err) {
        res.status(500).send(err.message);
    }
}

// Đăng Xuất
const logout = (req, res) => {
    req.session.destroy(() =>{
        res.json({success: true});
    });
};

const getUser = async (req, res) => {
    try {
        const kq = await sql.query
        `
            SELECT * FROM users  ORDER BY created_at DESC
        `;
        res.json(kq.recordset);
    }

    catch (err) {
        res.status(500).send(err.message);
    }
}

const deleteUser = async (req, res) => {
    const { id } = req.body;

    try{
        await sql.query`
            DELETE FROM users WHERE id = ${id}
        `;
        res.send("ok");
    }

    catch (err) {
        res.status(500).send(err.message);
    }
}

const updateUser = async (req, res) => {
    const { username, email, phone } = req.body;

    try {
        const user_id = req.session.user.id;
        await sql.query`
            UPDATE users SET username = ${username},
                             email = ${email},
                             phone = ${phone}
            WHERE id = ${user_id}
        `;

        req.session.user.username = username;
        req.session.user.email = email;
        req.session.user.phone = phone;
        
        res.send("ok");
    }

    catch (err) {
        res.status(500).send(err.message);
    }
}

const updatePassword = async (req, res) => {
    const {oldPass, newPass} = req.body;

    try{
        const user_id = req.session.user.id;

        const result = await sql.query`
            SELECT * FROM users WHERE id =${user_id} AND password = ${oldPass}
        `;

        if(result.recordset.length === 0) {
            return res.send("sai");
        }
        
        await sql.query`
            UPDATE users SET password = ${newPass} WHERE id = ${user_id}
        `;

        res.send("ok");
    }

    catch (err) {
        res.status(500).send(message);
    }
}

module.exports = { register, login, logout, getUser, deleteUser, updateUser, updatePassword, getUsersess, getAdmin }; 
