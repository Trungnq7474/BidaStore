const {sql} = require('../config/db');

const addComment = async (req, res) => {
    const { product_id, user_name, comment_text, rating} = req.body;

    try {
        const result = await sql.query`
            INSERT INTO comments (product_id, user_name, comment_text, rating)
            OUTPUT INSERTED.id
            VALUES (${product_id}, ${user_name}, ${comment_text}, ${rating})
        `;

        const comment_id = result.recordset[0].id;

        await sql.query`
            INSERT INTO notifications (message, type)
            VALUES(
                ${`Có Đánh Giá REV-00${comment_id} Mới Từ ${user_name}`}, 'review'
            )
        `;

        res.send("ok");
    }

    catch (err) {
        res.status(500).send(err.message);
    }
}

const getComment = async (req, res) => {

    const { product_id } = req.params;

    try {

        const result = await sql.query`
            SELECT 
                c.*,
                p.product_name
            FROM comments c
            INNER JOIN products p ON c.product_id = p.product_id
            WHERE c.product_id = ${product_id}
            ORDER BY created_at DESC
        `;

        res.json(result.recordset);

    } catch (error) {

        console.log(error);

        res.status(500).json({
            message: "Lỗi server"
        });

    }
};

const getAllComment = async (req, res) =>  {
    try {
        const kq = await sql.query`
            SELECT 
                c.*, 
                p.product_name 
            FROM comments c
            INNER JOIN products p ON c.product_id = p.product_id
            ORDER BY c.created_at DESC
        `;
        res.json(kq.recordset);
    }

    catch (error) {
        res.status(500).send(error.message);
    }
}

const replyComment = async (req, res) => {
    const { id, shop_reply } = req.body;

    try {

        const result = await sql.query`
            SELECT product_id, user_name
            FROM comments
            WHERE id = ${id}
        `;

        const comment = result.recordset[0];


        await sql.query`
            UPDATE comments SET shop_reply = ${shop_reply} WHERE id = ${id}
        `;

        const userResult = await sql.query`
            SELECT id
            FROM users
            WHERE username = ${comment.user_name}
        `;

        if(userResult.recordset.length > 0) {
            const user_id = userResult.recordset[0].id;

            await sql.query`
                INSERT INTO notifications(user_id, message, type, product_id)
                VALUES(${user_id}, ${`Đánh Giá REV-00${id} Của Bạn Đã Được Phản Hồi`}, 'review',${comment.product_id})
            `;
        }

        res.send("ok");
    }

    catch (error) {
        res.status(500).send(error.message);
    }
}

const deleteComment = async (req, res) => {
    const { id } = req.body;

    try{
        await sql.query`
            DELETE FROM comments WHERE id = ${id}
        `;
        res.send("ok");
    }

    catch (error) {
        res.status(500).send(error.message);
    }
};

const getCommentcount = async (req, res) => {

    try{
        const result = await sql.query`
            SELECT COUNT(*) AS total FROM comments
        `;

        res.json(result.recordset[0]);
    }

    catch (err) {
        res.status(500).send(err.message);
    }
}
module.exports = { addComment, getComment, getAllComment, replyComment, deleteComment, getCommentcount };