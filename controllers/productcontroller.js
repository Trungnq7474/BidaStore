const {sql} = require('../config/db');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/images');
    },

    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
});

const upload = multer({storage: storage});

const getproducts = async (req, res) => {

    const product_id = req.params.product_id;
    try {
        const result = await sql.query`
            SELECT p.*, AVG(c.rating) AS average_rating
            FROM products p
            LEFT JOIN comments c
                ON p.product_id = c.product_id
            WHERE p.product_id = ${product_id}
            GROUP BY p.product_id, p.product_name, p.price, p.new_price, p.discount, p.image, p.description, p.category, p.stock
        `;

        res.json(result.recordset[0]);
    }

    catch (err) {
        res.status(500).send(err.message);
    }
};

const getproducts2 = async (req, res) => {
    try {
        const kq = await sql.query`
            SELECT p.*, AVG(c.rating) AS average_rating
            FROM products p
            LEFT JOIN comments c
                ON p.product_id = c.product_id
            GROUP BY p.product_id, p.product_name, p.price, p.new_price, p.discount, p.image, p.description, p.category, p.stock
        `;
        res.json(kq.recordset);
    }

    catch (err) {
        res.status(500).send(err.message);
    }
}

const searchProducts = async (req, res) => {
    try {
        const keyword = '%' + (req.query.keyword || "") + '%';

        const kq = await sql.query`
            SELECT p.*, AVG(c.rating) AS average_rating
            FROM products p
            LEFT JOIN comments c
                ON p.product_id = c.product_id 
            WHERE product_name LIKE ${keyword}
             GROUP BY p.product_id, p.product_name, p.price, p.new_price, p.discount, p.image, p.description, p.category, p.stock
        `;

        res.json(kq.recordset);
    }

    catch (err) {
        res.status(500).send(err.message);
    }
};

const addPro = async (req, res) => {
    const {inname, inprice, innewprice, indiscount, indescrip, incate, inquan} = req.body;

    const inimg = req.file.filename;

    try {
        await sql.query`
            INSERT INTO products (product_name, price, new_price, discount, image, description, category, stock)
            VALUES (${inname}, ${inprice}, ${innewprice || null}, ${indiscount || null}, ${inimg}, ${indescrip}, ${incate}, ${inquan})
        `;

        res.send("ok");
    }

    catch (err) {   
        res.status(500).send(err.message);
    }
};

const deletePro = async (req, res) => {
    const {id} = req.body;

    try {
        await sql.query`
            DELETE FROM products WHERE product_id = ${id}
        `;

        res.send("ok");
    }

    catch (err) {
        res.status(500).send(err.message);
    }
}

const getProcate = async (req, res) => {
    const cate = req.params.category;
    try {
        const result = await sql.query`
            SELECT p.*, AVG(c.rating) AS average_rating
            FROM products p
            LEFT JOIN comments c
                ON p.product_id = c.product_id
            WHERE p.category = ${cate}
            GROUP BY p.product_id, p.product_name, p.price, p.new_price, p.discount, p.image, p.description, p.category, p.stock
        `;

        res.json(result.recordset);
    }

    catch (err) {
        res.status(500).send(err.message);
    }
}

const updatePro = async (req, res) => {
    const {id, name, price, new_price, discount, category, description, stock} = req.body;

    try {
        if(req.file) {
            const image = req.file.filename;

            await sql.query`
                UPDATE products SET product_name = ${name},
                                    price = ${price},
                                    new_price = ${new_price || null},
                                    discount = ${discount || null},
                                    image = ${image},
                                    description = ${description},
                                    category = ${category},
                                    stock = ${stock}
                WHERE product_id = ${id}
            `;
        }

        else {
            await sql.query`
                UPDATE products SET product_name = ${name},
                                    price = ${price},
                                    new_price = ${new_price || null},
                                    discount = ${discount || null},
                                    description = ${description},
                                    category = ${category},
                                    stock = ${stock}
                WHERE product_id = ${id}
            `;
        }

        res.send("ok");
    }

    catch (err) {
        res.status(500).send(err.message);
    }
}

const getProductcount = async (req, res) => {
    
    try {
        const result = await sql.query`
            SELECT COUNT(*) AS total FROM products
        `;

        res.json(result.recordset[0]);
    }

    catch (err) {
        res.status(500).send(err.message);
    }
};

const getTopproduct = async (req, res) => {
    
    try{
        const result = await sql.query`
            SELECT TOP 3 
                   p.product_id,
                   p.product_name,
                   p.image,
                   SUM(oi.quantity) AS da_ban,
                   SUM(
                        oi.quantity *
                        CASE
                            WHEN p.new_price IS NOT NULL AND p.new_price > 0
                            THEN p.new_price
                            ELSE p.price
                        END
                   ) AS doanh_thu
            FROM orderitems oi JOIN orders o
                            ON oi.order_id = o.id
                            JOIN products p
                            ON oi.product_name = p.product_name
            WHERE o.status = 'xong'
            GROUP BY 
                p.product_id,
                p.product_name, 
                p.image, 
                p.price,
                p.new_price
            ORDER BY SUM(oi.quantity) DESC
        `;

        res.json(result.recordset);
    }

    catch (err) {
        res.status(500).send(err.message);
    }

};

const getTopten = async (req, res) => {
    try {
        const result = await sql.query`
            SELECT TOP 10   p.product_id,
                            p.product_name,
                            p.image,
                            p.price,
                            p.new_price,
                            p.discount,
                            p.stock,
                           AVG(c.rating) AS average_rating,
            SUM(oi.quantity) AS da_ban
            FROM orderitems oi 
            JOIN orders o
                ON oi.order_id = o.id
            JOIN products p
                ON oi.product_name = p.product_name
            LEFT JOIN comments c
                ON p.product_id = c.product_id
            WHERE o.status = 'xong'
            GROUP BY
               p.product_id,
                p.product_name,
                p.image,
                p.price,
                p.new_price,
                p.discount,
                p.stock
            ORDER BY SUM(oi.quantity) DESC
        `;

        res.json(result.recordset);
    }

    catch (err) {
        res.status(500).send(err.message);
    }
};



module.exports = { getproducts, getproducts2, searchProducts, addPro, upload, deletePro, getProcate, updatePro, getProductcount, getTopproduct, getTopten };