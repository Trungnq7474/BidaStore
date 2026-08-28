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
            SELECT * FROM products WHERE product_id = ${product_id}
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
            SELECT * FROM products
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
            SELECT * FROM products WHERE product_name LIKE ${keyword}
        `;

        res.json(kq.recordset);
    }

    catch (err) {
        res.status(500).send(err.message);
    }
};

const addPro = async (req, res) => {
    const {inname, inprice, indescrip, incate} = req.body;

    const inimg = req.file.filename;

    try {
        await sql.query`
            INSERT INTO products (product_name, price, image, description, category)
            VALUES (${inname}, ${inprice}, ${inimg}, ${indescrip}, ${incate})
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
        res.status(500).send(message);
    }
}

const getProcate = async (req, res) => {
    const cate = req.params.category;
    try {
        const result = await sql.query`
            SELECT * FROM products WHERE category = ${cate}
        `;

        res.json(result.recordset);
    }

    catch (err) {
        res.status(500).send(err.message);
    }
}

const updatePro = async (req, res) => {
    const {id, name, price, category, description} = req.body;

    try {
        if(req.file) {
            const image = req.file.filename;

            await sql.query`
                UPDATE products SET product_name = ${name},
                                    price = ${price},
                                    image = ${image},
                                    description = ${description},
                                    category = ${category}
                WHERE product_id = ${id}
            `;
        }

        else {
            await sql.query`
                UPDATE products SET product_name = ${name},
                                    price = ${price},
                                    description = ${description},
                                    category = ${category}
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
                   oi.product_name,
                   oi.image,
                   SUM(oi.quantity) AS da_ban,
                   SUM(oi.quantity * oi.price) AS doanh_thu
            FROM orderitems oi JOIN orders o
                            ON oi.order_id = o.id
            WHERE o.status = 'xong'
            GROUP BY oi.product_name, oi.image
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
            SELECT TOP 10  p.product_id,
                           oi.product_name,
                           oi.image,
                           oi.price,
            SUM(oi.quantity) AS da_ban
            FROM orderitems oi 
            JOIN orders o
                ON oi.order_id = o.id
            JOIN products p
                ON oi.product_name = p.product_name
            WHERE o.status = 'xong'
            GROUP BY
                p.product_id,
                oi.product_name,
                oi.image,
                oi.price
            ORDER BY SUM(oi.quantity) DESC
        `;

        res.json(result.recordset);
    }

    catch (err) {
        res.status(500).send(err.message);
    }
};



module.exports = { getproducts, getproducts2, searchProducts, addPro, upload, deletePro, getProcate, updatePro, getProductcount, getTopproduct, getTopten };