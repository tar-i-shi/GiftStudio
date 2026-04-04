
const pool = require("../config/db");
const createOrder = async (userId, address, contact, totalPrice, paymentMethod) => {
    const result = await pool.query(
        `INSERT INTO orders (user_id, address, contact, total_price, payment_method)
     VALUES ($1, $2, $3, $4, $5) RETURNING *`,
        [userId, address, contact, totalPrice, paymentMethod]
    );
    return result.rows[0];
};

const getOrdersByUser = async (userId) => {
    const result = await pool.query(`SELECT * FROM orders WHERE user_id = $1 ORDER BY created_at DESC`, [userId]);
    return result.rows;
};

module.exports = { createOrder, getOrdersByUser };
