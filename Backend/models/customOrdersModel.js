const pool = require("../config/db");

async function insertCustomOrder(userId, orderType) {
    const result = await pool.query(
        'INSERT INTO custom_orders (user_id, order_type) VALUES ($1, $2) RETURNING order_id',
        [userId, orderType]
    );
    return result.rows[0].order_id;
}

module.exports = { insertCustomOrder };
