const { sql } = require('../config/db');

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
};

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
        res.status(500).send(err.message);
    }
};

const addAddress = async (req, res) => {
    const { name, phone, address_detail, city, ward, is_default } = req.body;

    try {
        const user_id = req.session.user.id;

        const check = await sql.query`
            SELECT COUNT(*) AS total
            FROM address
            WHERE user_id = ${user_id}
        `;

        if(check.recordset[0].total >= 3) {
            return res.send("full");
        }

        if(is_default) {
            const checkDefault = await sql.query`
                SELECT * FROM address 
                WHERE user_id = ${user_id}
                AND is_default = 1
            `;

            if(checkDefault.recordset.length > 0) {
                return res.send("default");
            }
        }

        await sql.query`
            INSERT INTO address (user_id, name, phone, address_detail, city, ward, is_default)
            VALUES (${user_id}, ${name}, ${phone}, ${address_detail}, ${city}, ${ward}, ${is_default ? 1 : 0})
        `;
        
        res.send("ok");
    }

    catch (err) {
        res.status(500).send(err.message);
    }
};

const getAddress = async (req, res) => {
    try {
        const user_id = req.session.user.id;

        const result = await sql.query`
            SELECT * FROM address
            WHERE user_id = ${user_id};
        `

        res.json(result.recordset);
    }

    catch (err) {
        res.status(500).send(err.message);
    }
};

const getOneAddress = async (req, res) => {
    const user_id = req.session.user.id;
    const address_id = req.params.id;

    const result = await sql.query`
        SELECT * FROM address
        WHERE address_id = ${address_id}
        AND user_id = ${user_id}
    `;

    res.json(result.recordset[0]);
};

const updateAddress = async (req, res) => {
    const { name, phone, address_detail, city, ward, is_default } = req.body;
    const address_id = req.params.id;
    const user_id = req.session.user.id;

    try {

        if(is_default) {
            const checkDefault = await sql.query`
                SELECT * FROM address
                WHERE user_id = ${user_id}
                AND is_default = 1
                AND address_id != ${address_id}
            `;

            if(checkDefault.recordset.length > 0) {
                return res.send("default");
            }
        }
        
        await sql.query`
            UPDATE address
            SET name = ${name},
                phone = ${phone},
                address_detail = ${address_detail},
                city = ${city},
                ward = ${ward},
                is_default = ${is_default ? 1 : 0}
            WHERE address_id = ${address_id}
            AND user_id = ${user_id}
        `;

        res.send("ok");
    }

    catch (err) {
        res.status(500).send(err.message);
    }
};

const deleteAddress = async (req, res) => {
    const address_id = req.params.id;
    const user_id = req.session.user.id;

    try {
        await sql.query`
            DELETE FROM address
            WHERE address_id = ${address_id}
            AND user_id = ${user_id}
        `;

        res.send("ok");
    }

    catch (err) {
        res.status(500).send(err.message);
    }
};

const getMyproductCount = async (req, res) => {
    try {
        const user_id = req.session.user.id;

        const result = await sql.query`
            SELECT SUM(oi.quantity) AS total
            FROM orders o
            JOIN orderitems oi ON o.id = oi.order_id
            WHERE o.user_id = ${user_id}
            AND o.status = 'xong'
        `;

        res.json(result.recordset[0]);
    }

    catch (err) {
        res.status(500).send(err.message);
    }
};

const getMyOrderCount = async(req, res) => {
    try {
        const user_id = req.session.user.id;

        const result = await sql.query`
            SELECT COUNT(*) AS total
            FROM orders
            WHERE user_id = ${user_id}
        `;

        res.json(result.recordset[0]);
    }

    catch (err) {
        res.status(500).send(err.message);
    }
};

const getMyMoney = async (req, res) => {
    try {
        const user_id = req.session.user.id;

        const result = await sql.query`
            SELECT SUM(total) AS total
            FROM orders
            WHERE user_id = ${user_id}
            AND status = 'xong'
        `;

        res.json(result.recordset[0]);
    }

    catch (err) {
        res.status(500).send(err.message);
    }
};

const getMyComplete = async (req, res) => {
    try {
        const user_id = req.session.user.id;

        const result = await sql.query`
            SELECT COUNT(*) AS total
            FROM orders
            WHERE user_id = ${user_id}
            AND status = 'xong';
        `;

        res.json(result.recordset[0]);
    }

    catch (err) {
        res.status(500).send(err.message);
    }
};

module.exports = { updateUser, updatePassword, addAddress, getAddress, getOneAddress, updateAddress, deleteAddress, getMyproductCount, getMyOrderCount, getMyMoney, getMyComplete };