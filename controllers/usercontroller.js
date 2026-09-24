const { sql } = require('../config/db')

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
};

const deleteUser = async (req, res) => {
    const { id } = req.body;

    try{
        await sql.query`
            DELETE FROM messages WHERE user_id = ${id}
        `;

        await sql.query`
            DELETE FROM users WHERE id = ${id}
        `;
        res.send("ok");
    }

    catch (err) {
        res.status(500).send(err.message);
    }
};

const deleteAllUser = async (req, res) => {
    try {
        await sql.query`
            DELETE FROM users
        `;

        res.send("ok");
    }

    catch (err) {
        res.status(500).send(err.message);
    }
};

module.exports = { getUsersess, getAdmin, getUser, deleteUser, deleteAllUser };