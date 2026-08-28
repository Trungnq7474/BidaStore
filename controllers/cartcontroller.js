const { sql } = require('../config/db');

// Thêm Giỏ Hàng
const addtoCart = async (req, res) => {
    const { user_id, product_name, price, image } = req.body;

    try {
        const check = await sql.query
        `
            SELECT * FROM carts WHERE user_id = ${user_id} AND product_name = ${product_name}
        `;

        if(check.recordset.length > 0) {
            await sql.query
            `
                UPDATE carts SET quantity = quantity + 1 WHERE user_id = ${user_id} AND product_name = ${product_name}
            `;
        }

        else {
            await sql.query
            `
                INSERT INTO carts (user_id, product_name, price, image, quantity)
                VALUES (${user_id}, ${product_name}, ${price}, ${image}, 1)
            `;
        }

        res.send("ok");
    }

    catch (err) {
        res.status(500).send(err.message);
    }
};

// Lấy Giỏ Hàng

const getCart = async (req, res) => {
    const user_id = req.query.user_id;

    try {
        const result = await sql.query
        `
            SELECT * FROM carts WHERE user_id = ${user_id}
        `;

        res.json(result.recordset);
    }

    catch(err) {
        res.status(500).send(err.message);
    }
}

// Tăng Số Lượng

const increase = async(req, res) => {
    const { user_id, product_name } = req.body;

    await sql.query
    `
        UPDATE carts SET quantity = quantity + 1 WHERE user_id = ${user_id} AND product_name = ${product_name}
    `;

    res.send("ok");
};

// Giảm Số Lượng

const decrease = async(req, res) => {
    const { user_id, product_name } = req.body;

    await sql.query 
    `
        UPDATE carts SET quantity = quantity - 1 WHERE user_id = ${user_id} AND product_name = ${product_name} AND quantity > 1
    `;

    res.send("ok");
};

// Xóa 1 Sản Phẩm

const removeItem =  async(req, res) => {
    const { user_id, product_name } = req.body;

    await sql.query 
    `
        DELETE FROM carts WHERE user_id = ${user_id} AND product_name = ${product_name} 
    `;
    res.send("ok");
};

const removeAll = async(req, res) => {
    const { user_id } = req.body;

    await sql.query
    `
        DELETE FROM carts WHERE user_id = ${user_id}
    `;
    res.send("ok");
};

module.exports = { addtoCart, getCart, increase, decrease, removeItem, removeAll };
