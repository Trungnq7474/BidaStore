const { sql } = require('../config/db');


//TẠO ĐƠN HÀNG MỚI
const createOrder = async (req, res) => {
    const { user_id, name_receive, email, phone, address, method, total, product_id, bank_name, bank_account } = req.body;

    try {

        //TẠO ĐƠN HÀNG
        const result = await sql.query`
            INSERT INTO orders (user_id, name_receive, email, phone, address, total, method, bank_name, bank_account)
            OUTPUT INSERTED.id
            VALUES (${user_id}, ${name_receive}, ${email}, ${phone}, ${address}, ${total}, ${method}, ${bank_name}, ${bank_account})
        `;
        const order_id = result.recordset[0].id;

        await sql.query`
            INSERT INTO notifications (message, type)
            VALUES(${`Có Đơn Hàng ORD-00${order_id} Mới Từ ${name_receive}`}, 'order')
        `;

        // NẾU CÓ product_id → MUA NGAY
        if(product_id) {
            const proresult = await sql.query`
                SELECT product_name, image, price FROM products WHERE product_id = ${product_id}
            `;

            const product = proresult.recordset[0];
            const image = `images/${product.image}`;
            await sql.query`
                INSERT INTO orderitems (order_id, product_name, image, quantity, price)
                VALUES (${order_id}, ${product.product_name}, ${image}, 1, ${product.price})
            `;
        }

        else {
            const cartresult = await sql.query`
                SELECT * FROM carts WHERE user_id = ${user_id}
            `;

            const cart = cartresult.recordset;

            
                // LƯU SẢN PHẨM VÀO BẢNG ORDERITEMS
                for(const item of cart) {
                    await sql.query`
                        INSERT INTO orderitems (order_id, product_name, image, quantity, price)
                        VALUES (${order_id}, ${item.product_name}, ${item.image}, ${item.quantity}, ${item.price})
                    `;
                }

                await sql.query`
                    DELETE FROM carts WHERE user_id = ${user_id}
                `;
            }

            res.json({
                success: true,
                order_id: order_id,
            }); 
        } catch (err) {
            res.status(500).send(err.message);
        }
};

// LẤY THÔNG TIN ĐƠN HÀNG
const getOrder = async (req, res) => {
    try {
        const order_id = req.params.id;

        const result = await sql.query`
            SELECT * FROM orders WHERE id = ${order_id}
        `;
        res.json(result.recordset[0]);
    }

    catch (err) {
        res.status(500).send(err.message);
    }
}

// LẤY TẤT CẢ THÔNG TIN ĐƠN HÀNG
const getAllOrders = async (req, res) => {
    try{
        const kq = await sql.query`
            SELECT * FROM orders ORDER BY created_at DESC
        `;
        res.json(kq.recordset);
    }

    catch (err) {
        res.status(500).send(err.message);
    }
}

// XÓA ĐƠN HÀNG
const deleteOrder = async (req, res) => {
    const {id} = req.body;

    try {
        await sql.query`
            DELETE FROM orders WHERE id = ${id}
        `;
        res.send("ok");

    }

    catch (err) {
        res.status(500).send(err.message);
    }
}

// LẤY SẢN PHẨM TRONG ĐƠN HÀNG
const getOrderItems = async (req, res) => {
    try {
        const order_id = req.params.id;

        const result = await sql.query`
            SELECT * FROM orderitems WHERE order_id = ${order_id}        
        `;

        res.json(result.recordset);
    }

    catch (err) {
        res.status(500).send(err.message);
    }
}

const updateStatus = async (req, res) => {
    const {id, status} = req.body;

    try {

        const result = await sql.query`
            SELECT status, user_id
            FROM orders
            WHERE id = ${id}
        `;

        const old = result.recordset[0].status;
        const user_id = result.recordset[0].user_id;

        if(old === "xong" || old === "huy") {
            return res.send("not");
        }

        if(old === "dang" && status === "cho") {
            return res.send("not");
        }

        if(old === "cho" && status === "xong") {
            return res.send("not");
        }

        if(old === "dang" && status === "huy") {
            return res.send("not");
        }

        await sql.query`
            UPDATE orders SET status = ${status} WHERE id = ${id}
        `;

        let message = "";

        if(status === "dang") {
            message = `Đơn Hàng ORD-00${id} Của Bạn Đang Được Giao`;
        }

        else if(status === "xong") {
           message = `Đơn Hàng ORD-00${id} Của Bạn Đã Giao Thành Công`;
        }

        else if(status === "huy") {
            message = `Đơn Hàng ORD-00${id} Của Bạn Đã Bị Hủy`;
        }

        if(message) {
            await sql.query`
                INSERT INTO notifications (user_id, message, type)
                VALUES(${user_id}, ${message}, 'order')
            `;
        }

        res.send("ok");
    }

    catch (err) {
        res.status(500).send(err.message);
    }
}

const getMyorder = async (req, res) => {
    try {
        const user_id = req.session.user.id;

        const result = await sql.query`
            SELECT * FROM orders 
            WHERE user_id = ${user_id}
            ORDER BY created_at DESC 
        `;

        res.json(result.recordset);
    }

    catch (err) {
        res.status(500).send(err.message);
    }
}

const getOrdercount = async (req, res) => {

    try {
        const result = await sql.query`
            SELECT COUNT(*) AS total FROM orders
        `;

        res.json(result.recordset[0]);
    }

    catch (err) {
        res.status(500).send(err.message);
    }
}

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

module.exports = { createOrder, getOrder, getAllOrders, getOrderItems, deleteOrder, updateStatus, getMyorder, getOrdercount, getReve, getOrdermonth, getNoti, readNoti, getUsernoti, readUsernoti, deleteUsernoti, deleteAminnoti };