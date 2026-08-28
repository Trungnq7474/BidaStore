const { sql } = require('../config/db');
const multer = require('multer');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/images/chat');
    },

    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({storage: storage});

const sendMess = async (req, res) => {
    const { user_id, sender, message } = req.body;

    try {

        let file_path = "";
        if(req.files && req.files.length > 0) {
            let files = [];

            for(let i=0; i < req.files.length; i++) {
                files.push(
                    "images/chat/" + req.files[i].filename
                );
            }

            file_path = files.join("|");
        }

        await sql.query`
            INSERT INTO messages (user_id, sender, message, file_path, is_read)
            VALUES (${user_id}, ${sender}, ${message}, ${file_path}, 0)
        `;

        res.send("ok");
    }

    catch (err) {
        res.status(500).send(err.message);
    }
};

const getMess = async (req, res) => {
    const user_id = req.params.user_id;

    try {
        const check = await sql.query`
            SELECT * FROM messages WHERE user_id = ${user_id}
        `;

        if(check.recordset.length === 0) {
            await sql.query`
                INSERT INTO messages (user_id, sender, message)
                VALUES(${user_id}, 'shop', N'SHOP BIDA Xin chào bạn!'),
                      (${user_id}, 'shop', N'Bạn cần chúng tôi hỗ trợ điều gì ạ?')
            `;
        }

        const result = await sql.query`
            SELECT * FROM messages WHERE user_id = ${user_id}
            ORDER BY message_id ASC
        `;

        res.json(result.recordset);
    }

    catch (err) {
        res.status(500).send(err.message);
    }
};

const getUsermess = async (req, res) => {
    try {
        const result = await sql.query`
            SELECT 
                u.id,
                u.username,
                m.message,
                m.created_at,

                (
                    SELECT COUNT(*)
                    FROM messages
                    WHERE user_id = u.id
                    AND sender = 'user'
                    AND is_read = 0
                ) AS new_count

            FROM users u

            INNER JOIN messages m 
                ON u.id = m.user_id

            WHERE m.message_id = (
                SELECT MAX(message_id)
                FROM messages
                WHERE user_id = u.id
            )

            ORDER BY m.created_at DESC
        `;

        res.json(result.recordset);
    }

    catch (err) {
        res.status(500).send(err.message);
    }
};

const getRead = async (req, res) => {
    const user_id = req.params.user_id;

    try {
        const result = await sql.query`
            SELECT COUNT(*) AS total FROM messages 
            WHERE user_id = ${user_id}
            AND sender = 'shop'
            AND is_read = 0
        `;

        res.json(result.recordset[0].total);
    }

    catch (err) {

    }
};

const readMess = async (req, res) => {
    const user_id = req.params.user_id;

    try {
        await sql.query`
            UPDATE messages SET is_read = 1 
            WHERE user_id = ${user_id}
            AND sender = 'shop'
            AND is_read = 0
        `;

        res.send("ok");
    }

    catch (err) {
        res.status(500).send(err.message);
    }
};

const readMessadmin = async (req, res) => {
    const user_id = req.params.user_id;
    
    try {
        await sql.query`
            UPDATE messages SET is_read = 1
            WHERE user_id = ${user_id}
            AND sender = 'user'
            AND is_read = 0
        `;

        res.send("ok");
    }

    catch (err) {
        res.status(500).send(err.message);
    }
};

const getAdminread = async (req, res) => {
    try {
        const result = await sql.query`
            SELECT COUNT(*) AS total
            FROM messages WHERE sender = 'user' AND is_read = 0
        `;

        res.json(result.recordset[0].total);
    }

    catch (err) {
        res.status(500).send(err.message);
    }
};

module.exports = { sendMess, getMess, getUsermess, upload, getRead, readMess, readMessadmin, getAdminread };