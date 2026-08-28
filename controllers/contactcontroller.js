const { sql } = require('../config/db'); 

const sendContact = async (req, res) => {
    const { name, email, mess, phone } = req.body;

    try {
        const result = await sql.query`
            INSERT INTO contacts (name, email, mess, phone)
            OUTPUT INSERTED.id
            VALUES (${name}, ${email}, ${mess}, ${phone})
        `;

        const contact_id = result.recordset[0].id;

        await sql.query`
            INSERT INTO notifications (message, type)
            VALUES (
                ${`Có Phản Hồi FBK-00${contact_id} Mới Từ ${name}`},'contact'
            )
        `;
        res.send("ok");
        
    }

    catch (error) {
        res.status(500).send(error.message);
    }
};

const getContact = async (req, res) => {
    try {
        const kq = await sql.query`
            SELECT * FROM contacts ORDER BY created_at DESC
        `;

        res.json(kq.recordset);
    }

    catch (err) {
        res.status(500).send(err.message);
    }
}

const readContact = async (req, res) => {
    const { id } = req.body;

    try {

        const result = await sql.query`
            SELECT name, email FROM contacts WHERE id = ${id}
        `;

        const contact = result.recordset[0];

        await sql.query`
            UPDATE contacts SET is_read = 1 WHERE id = ${id}
        `;

        const userResult = await sql.query`
            SELECT id FROM users WHERE email = ${contact.email}
        `;

        if(userResult.recordset.length > 0) {
            const user_id = userResult.recordset[0].id;

            await sql.query`
                INSERT INTO notifications(user_id, message, type)
                VALUES(${user_id}, ${`Admin Đã Đọc Và Trả Lời Liên Hệ FBK-00${id} Của Bạn Qua Email`}, 'contact')
            `;
        }

        res.send("ok");
    }

    catch (error) {
        res.status(500).send(error.message);
    }
}

const deleteContact = async (req, res) => {
    const { id } = req.body;

    try{
        await sql.query`
            DELETE FROM contacts WHERE id = ${id}
        `;
        res.send("ok");
    }

    catch (error) {
        res.status(500).send(error.message);
    }
}

const getContactcount = async (req, res) => {
    
    try{

        const result = await sql.query`
            SELECT COUNT(*) AS total FROM contacts
        `;

        res.json(result.recordset[0]);
    }

    catch (err) {
        res.status(500).send(err.message);
    }
}

module.exports = { sendContact, getContact, readContact, deleteContact, getContactcount };