const { sql } = require('../config/db');

//TẠO ĐƠN HÀNG MỚI
const createOrder = async (req, res) => {
    const { user_id, name_receive, email, phone, address, method, shipping, total, subtotal, product_id, bank_name, bank_account, voucher_id } = req.body;
    
    try {

        if(voucher_id) {
            const result = await sql.query`
                SELECT * FROm vouchers
                WHERE id = ${voucher_id}
            `;

            const voucher = result.recordset[0];

            if(!voucher) {
                return res.json({ message: "voucher_not_found" });
            }

            if(voucher.quantity <= 0) {
                return res.json({ message: "voucher_out" });
            }

            if(voucher.is_active != 1) {
                return res.json({ message: "voucher_inactive" });
            }

            if(subtotal < voucher.min_order) {
                return res.json({ message: "voucher_min" });
            }

            const now = new Date();

            if(now < new Date(voucher.start_date) || now > new Date(voucher.end_date)) {
                return res.json({ message: "voucher_expired" });
            }
        }

        //TẠO ĐƠN HÀNG
        const result = await sql.query`
            INSERT INTO orders (user_id, name_receive, email, phone, address, total, method, shipping, bank_name, bank_account,voucher_id)
            OUTPUT INSERTED.id
            VALUES (${user_id}, ${name_receive}, ${email}, ${phone}, ${address}, ${total}, ${method}, ${shipping}, ${bank_name}, ${bank_account}, ${voucher_id})
        `;
        const order_id = result.recordset[0].id;

        if(voucher_id) {
            await sql.query`
                UPDATE vouchers
                SET quantity = quantity - 1
                WHERE id = ${voucher_id}
            `;
        }

        await sql.query`
            INSERT INTO notifications (message, type)
            VALUES(${`Có Đơn Hàng ORD-00${order_id} Mới Từ ${name_receive}`}, 'order')
        `;

        // NẾU CÓ product_id → MUA NGAY
        if(product_id) {
            const proresult = await sql.query`
                SELECT product_name, image, price, new_price, stock FROM products WHERE product_id = ${product_id}
            `;

            const product = proresult.recordset[0];

            if(product.stock <= 0) {
                return res.send("out");
            }

            let orderPrice = product.price;

            if(product.new_price !== null && product.new_price > 0) {
                orderPrice = product.new_price;
            }

            const image = `images/${product.image}`;
            await sql.query`
                INSERT INTO orderitems (order_id, product_name, image, quantity, price)
                VALUES (${order_id}, ${product.product_name}, ${image}, 1, ${orderPrice})
            `;

            await sql.query`
                UPDATE products
                SET stock = stock - 1
                WHERE product_id = ${product_id}
            `;
        }

        else {
            const cartresult = await sql.query`
                SELECT * FROM carts WHERE user_id = ${user_id}
            `;

            const cart = cartresult.recordset;

            
                // LƯU SẢN PHẨM VÀO BẢNG ORDERITEMS
                for(const item of cart) {

                    const proresutl = await sql.query`
                        SELECT product_id, stock, price, new_price
                        FROM products
                        WHERE product_name = ${item.product_name}
                    `;

                    const product = proresutl.recordset[0];

                    if(product.stock < item.quantity) {
                        return res.send("not_enough");
                    }

                    let orderPrice = product.price;

                    if(product.new_price !== null && product.new_price > 0) {
                        orderPrice = product.new_price;
                    }

                    await sql.query`
                        INSERT INTO orderitems (order_id, product_name, image, quantity, price)
                        VALUES (${order_id}, ${item.product_name}, ${item.image}, ${item.quantity}, ${orderPrice})
                    `;

                    await sql.query`
                        UPDATE products
                        SET stock = stock - ${item.quantity}
                        WHERE product_id = ${product.product_id}
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
            SELECT * FROM orders
            WHERE id = ${order_id}
        `;

        let voucher = null;

        if(result.recordset[0].voucher_id) {
            const voucherResult = await sql.query`
                SELECT * FROM vouchers
                WHERE id = ${result.recordset[0].voucher_id}
            `;

            voucher = voucherResult.recordset[0];
        }
        res.json({
            ...result.recordset[0],
            voucher: voucher
        });
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

const getRecentOrder = async (req, res) => {
    try {
        const result = await sql.query`
            SELECT TOP 7
                id,
                name_receive,
                total,
                status,
                created_at
            FROM orders
            ORDER BY created_at DESC
        `;

        res.json(result.recordset);
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
};

const deleteOrderAll = async (req, res) => {
    try {
        await sql.query`
            DELETE FROM orders
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
            SELECT 
                oi.*,
                p.price AS old_price,
                p.new_price,
                p.discount
            FROM orderitems oi
            LEFT JOIN products p
                ON oi.product_name = p.product_name
            WHERE oi.order_id = ${order_id}       
        `;

        res.json(result.recordset);
    }

    catch (err) {
        res.status(500).send(err.message);
    }
}

const updateStatus = async (req, res) => {
    const {id, status, fromUser} = req.body;

    try {

        const result = await sql.query`
            SELECT status, user_id, name_receive
            FROM orders
            WHERE id = ${id}
        `;

        const old = result.recordset[0].status;
        const user_id = result.recordset[0].user_id;
        const name_receive = result.recordset[0].name_receive;

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

        if(status === "huy") {
            const items = await sql.query`
                SELECT product_name, quantity
                FROM orderitems
                WHERE order_id = ${id}
            `;

            for(const item of items.recordset) {
                await sql.query`
                    UPDATE products
                    SET stock = stock + ${item.quantity}
                    WHERE product_name = ${item.product_name}                
                `;
            }
        }

        await sql.query`
            UPDATE orders 
            SET 
                status = ${status},

                shipping_at = CASE
                    WHEN ${status} = 'dang' THEN GETDATE()
                    ELSE shipping_at
                END,

                delivered_at = CASE
                    WHEN ${status} = 'xong' THEN GETDATE()
                    ELSE delivered_at
                END,
            
                cancelled_at = CASE 
                    WHEN ${status} = 'huy' THEN GETDATE()
                    ELSE cancelled_at
                END

            WHERE id = ${id}
        `;

        await sql.query`
            UPDATE users
            SET membership_rank = (
                SELECT
                    CASE
                        WHEN COUNT(*) < 5 THEN N'HẠNG ĐỒNG'
                        WHEN COUNT(*) < 10 THEN N'HẠNG BẠC'
                        WHEN COUNT(*) < 25 THEN N'HẠNG VÀNG'
                        WHEN COUNT(*) < 50 THEN N'HẠNG KIM CƯƠNG'
                        ELSE N'HẠNG VIP'
                    END
                FROM orders
                WHERE user_id = ${user_id}
                AND status = 'xong'
            )
            WHERE id = ${user_id}
            AND role = 'customer'
        `;

        let message = "";

        if(status === "dang") {
            message = `Đơn Hàng ORD-00${id} Của Bạn Đang Được Giao`;
        }

        else if(status === "xong") {
           message = `Đơn Hàng ORD-00${id} Của Bạn Đã Giao Thành Công`;
        }

        else if(status === "huy" && fromUser) {
            await sql.query`
                INSERT INTO notifications (message, type)
                VALUES(
                    ${`${name_receive} Đã Hủy Đơn Hàng ORD-00${id}`}, 'order'
                )
            `;
        }

        else if(status === "huy" && !fromUser) {
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

module.exports = { createOrder, getOrder, getAllOrders, getRecentOrder, deleteOrder, deleteOrderAll, getOrderItems, updateStatus, getMyorder, getOrdercount };