const pool = require("../config/db");

const addOrderItem = async (orderId, name, quantity, price) => {
    await pool.query(
        'INSERT INTO order_items (order_id, gift_name, quantity, price) VALUES ($1, $2, $3, $4)',
        [orderId, name, quantity, price]
    );
};

const getOrderItemsByOrderId = async (orderId) => {
    const result = await pool.query(
        'SELECT gift_name, quantity, price FROM order_items WHERE order_id = $1',
        [orderId]
    );
    return result.rows;
};

module.exports = { addOrderItem, getOrderItemsByOrderId };
