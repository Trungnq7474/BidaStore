const { sql } = require('../config/db'); 
const nodemailer = require('nodemailer')

const transporter = nodemailer.createTransport ({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

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

const replyContact = async (req, res) => {

    const { id } = req.body;
    
    try {
        const result = await sql.query`
            SELECT name, email, mess
            FROM contacts
            WHERE id =${id}
        `;

        if(result.recordset.length === 0) {
            res.send("not");
            return;
        }

        const contact = result.recordset[0];

        await transporter.sendMail({
            from: `BidaStore <${process.env.EMAIL_USER}>`,
            to: contact.email,
            subject: 'Phản Hồi Liên Hệ Từ BidaStore',

            html: `
                <div style="
                    margin: 0;
                    padding: 30px 15px;
                    background: #f1f5f9;
                    font-family: Arial, Helvetica, sans-serif;
                ">

                    <div style="
                        max-width: 600px;
                        margin: auto;
                        background: #ffffff;
                        border-radius: 12px;
                        overflow: hidden;
                        box-shadow: 0 4px 15px rgba(0,0,0,0.08);
                    ">

                        <div style="
                            height: 3px;
                            background: #2563eb;
                        "></div>

                        <div style="
                            padding: 30px;
                        ">

                            <h2 style="
                                margin: 0 0 20px;
                                color: #2563eb;
                                font-size: 24px;
                                text-align: center;
                            ">
                                Xin Chào ${contact.name} ! 😊😊
                            </h2>

                            <p style="
                                margin: 0 0 15px;
                                color: #333333;
                                font-size: 16px;
                                line-height: 1.6;
                            ">
                                BidaStore Đã Nhận Được Tin Nhắn Của Bạn:
                            </p>

                            <div style="
                                margin: 20px 0;
                                padding: 18px;
                                background: #f8fafc;
                                border-left: 4px solid #2563eb;
                                border-radius: 6px;
                                color: #444444;
                                font-size: 16px;
                                line-height: 1.6;
                            ">
                                ${contact.mess}
                            </div>

                            <p style="
                                margin: 20px 0;
                                color: #333333;
                                font-size: 16px;
                                line-height: 1.7;
                            ">
                                Cảm Ơn Bạn Đã Liên Hệ Với BidaStore.
                                Shop Sẽ Hỗ Trợ Bạn Trong Thời Gian Sớm Nhất ! 💕😊
                            </p>

                            <p style="
                                margin: 25px 0 5px;
                                color: #333333;
                                font-size: 16px;
                            ">
                                Trân Trọng,
                            </p>

                            <strong style="
                                color: #2563eb;
                                font-size: 18px;
                            ">
                                BidaStore 💙
                            </strong>

                            <div style="
                                text-align: center;
                                margin-top: 30px;
                            ">
                                <img
                                    src="cid:bidastorelogo@bidastore"
                                    alt="BidaStore"
                                    style="
                                        display: block;
                                        width: 180px;
                                        max-width: 100%;
                                        height: auto;
                                        margin: auto;
                                    "
                                >
                            </div>

                        </div>

                    </div>

                </div>
            `,

            attachments: [
                {
                    filename: 'logo-bida.png',
                    path: 'public/images/logo bida.png',
                    cid: 'bidastorelogo@bidastore',
                    contentDisposition: 'inline'
                }
            ]
        });

        res.send("ok");
    }

    catch (err) {
        res.status(500).send(err.message);
    }
};

module.exports = { sendContact, getContact, readContact, deleteContact, getContactcount, replyContact };