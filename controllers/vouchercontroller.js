const {sql} = require("../config/db");

const addVoucher = async (req, res) => {
    const {code, type, value, min_order, quantity, start_date, end_date} = req.body;

    try {
        const check = await sql.query`
            SELECT * FROM vouchers 
            WHERE code = ${code}
        `;

        if(check.recordset.length > 0) {
            return res.send("had");
        }

        const startDate = start_date.replace("T", " ");
        const endDate = end_date.replace("T", " ");

        await sql.query`
            INSERT INTO vouchers (code, type, value, min_order, quantity, start_date, end_date)
            VALUES(${code}, ${type}, ${value}, ${min_order}, ${quantity}, ${startDate}, ${endDate})
        `;

        res.send("ok");
    }

    catch (err) {
        res.status(500).send(err.message);
        console.log(err);
    }
};

const getVouchers = async (req, res) => {
    try {
        const result = await sql.query`
            SELECT * FROM vouchers
            ORDER BY id DESC
        `;
        res.send(result.recordset);
    }

    catch (err) {
        res.status(500).send(err.message);
    }
};

const deleteVouchers = async (req, res) => {

    const { id } = req.body;

    try {
        await sql.query`
            DELETE FROM vouchers WHERE id = ${id}
        `;

        res.send("ok");
    }

    catch (err) {
        res.status(500).send(err.message);
    }
};

const updateVouchers = async (req, res) => {
    const { id, code, type, value, min_order, quantity, start_date, end_date } = req.body;

    try {
        const startDate = start_date.replace("T", " ");
        const endDate = end_date.replace("T", " ");

        await sql.query`
            UPDATE vouchers
            SET code = ${code}, 
                type = ${type}, 
                value = ${value}, 
                min_order = ${min_order}, 
                quantity = ${quantity}, 
                start_date = ${startDate}, 
                end_date = ${endDate}
            WHERE id = ${id}
        `;

        res.send("ok");
    }

    catch (err) {
        res.status(500).send(err.message);
    }
};

const updateVouchersstatus = async (req, res) => {
    const  { id, is_active } = req.body;

    try {
        await sql.query`
            UPDATE vouchers SET is_active = ${is_active}
            WHERE id =${id}
        `;

        res.send("ok");
    }

    catch (err) {
        res.status(500).send(err.message);
    }
}



module.exports = { addVoucher, getVouchers, deleteVouchers, updateVouchers, updateVouchersstatus };