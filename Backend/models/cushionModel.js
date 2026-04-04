
const pool = require("../config/db");
const createCustomOrder = async (userId) => {
    const result = await pool.query(
        "INSERT INTO custom_orders (user_id, order_type) VALUES ($1, 'cushion') RETURNING order_id",
        [userId]
    );
    return result.rows[0].order_id;
};

const createCushionOrder = async (orderId, size, quantity, prints, address, contact) => {
    await pool.query(
        `INSERT INTO custom_cushions (order_id, size, quantity, print_colors, address, contact)
     VALUES ($1, $2, $3, $4, $5, $6)`,
        [orderId, size, quantity, prints, address, contact]
    );
};

module.exports = { createCustomOrder, createCushionOrder };
