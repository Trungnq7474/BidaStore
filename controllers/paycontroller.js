const { sql } = require('../config/db');

const getReve = async (req, res) => {
    
    try {
        const result = await sql.query`
            SELECT MONTH(created_at) AS thang,
                   SUM(total) AS doanhthu
            FROM orders WHERE status = 'xong'
            GROUP BY MONTH(created_at)
            ORDER BY MONTH(created_at)
        `;

        res.json(result.recordset);
    }

    catch (err) {
        res.status(500).send(err.message);
    }
}

const getOrdermonth = async (req, res) => {

    try {
        const result = await sql.query`
            SELECT MONTH(created_at) AS thang,
                   COUNT(*) AS sodon
            FROM orders
            GROUP BY MONTH(created_at)
            ORDER BY MONTH(created_at)
        `;

        res.json(result.recordset);
    }

    catch (err) {
        res.status(500).send(err.message);
    }
}

const getNoti = async (req, res) => {
    try {
        const result = await sql.query`
            SELECT * FROM notifications
            WHERE user_id IS NULL
            ORDER BY created_at DESC
        `;
        res.json(result.recordset);
    }

    catch (err) {
        res.status(500).send(err.message);
    }
};

const readNoti = async (req, res) => {

    const { id } = req.body;
    
    try {
        await sql.query`
            UPDATE notifications SET is_read = 1 WHERE id =${id}
        `;
        res.send("ok");
    }

    catch (err) {
        res.status(500).send(err.message);
    }
};

const getUsernoti = async (req, res) => {

    if(!req.session.user) {
        return res.json([]);
    }

    const user_id = req.session.user.id;

    try {
        const result = await sql.query`
            SELECT * FROM notifications
            WHERE user_id = ${user_id}
            ORDER BY created_at DESC
        `;
        res.json(result.recordset);
    }

    catch (err) {
        res.status(500).send(err.message);
    }
};

const readUsernoti = async (req, res) => {
    const { id } = req.body;

    try {
        const user_id = req.session.user.id;
        await sql.query`
            UPDATE notifications
            SET is_read = 1
            WHERE id = ${id}
            AND user_id = ${user_id}
        `;
        res.send("ok");
    }

    catch (err) {
        res.status(500).send(err.message);
    }
}

const deleteUsernoti = async (req, res) => {
    try {
        const user_id = req.session.user.id;

        await sql.query`
            DELETE FROM notifications
            WHERE user_id = ${user_id}
        `;

        res.send("ok");
    }   

    catch(err) {
        res.status(500).send(err.message);
    }
};

const deleteAminnoti = async (req, res) => {
    try {
        await sql.query`
            DELETE FROM notifications
            WHERE user_id IS NULL
        `;

        res.send("ok");
    }   

    catch(err) {
        res.status(500).send(err.message);
    }
};

const checkPayment = async (req, res) => {

    try {
        const order_id = req.params.id;

        const result = await sql.query`
            SELECT id, status, method, total, bank_name
            FROM orders
            WHERE id =${order_id}
        `;

        if(result.recordset.length === 0) {
            return res.json({ success: false});
        }

        const order = result.recordset[0];

        res.json({
            success: true,
            status: order.status,
            paid: order.bank_name.includes("Thanh Toán")
        });
    }

    catch(err) {
        res.status(500).send(err.message);
    }
};

const sePay = async (req, res) => {
    try {
        const data = req.body;

        const content = data.content || "";
        const amount = Number(data.transferAmount);
        const match = content.match(/ORD-?00(\d+)/);

        if(!match) {
            return res.send("Không tìm thấy mã đơn");
        }

        const order_id = match[1];

        const result = await sql.query`
            SELECT id, total, status, method
            FROM orders
            WHERE id =${order_id}
        `;

        if(result.recordset.length === 0) {
            return res.send("Không tìm thấy đơn hàng");
        }

        const order = result.recordset[0];

        if(order.method !== "QR") {
            return res.send("Không phải đơn QR");
        }

        if(amount < order.total) {
            return res.send("Chưa đủ tiền");
        }

        await sql.query`
            UPDATE orders
            SET bank_name = 'Đã Thanh Toán'
            WHERE id = ${order_id}
        `;

        res.send("ok");
    }

    catch (err) {
        res.status(500).send(err.message);
    }
};
 

module.exports = { getReve, getOrdermonth, getNoti, readNoti, getUsernoti, readUsernoti, deleteUsernoti, deleteAminnoti, checkPayment, sePay };