// // models/orderModel.js
// const pool = require("../config/db");

// // Insert a new order
// const createOrder = async (userId, totalPrice, address, contact, paymentMethod) => {
//     const query = `
//         INSERT INTO orders (user_id, total_price, address, contact, payment_method, created_at)
//         VALUES ($1, $2, $3, $4, $5, NOW())
//         RETURNING id;
//     `;
//     const values = [userId, totalPrice, address, contact, paymentMethod];
//     const result = await pool.query(query, values);
//     return result.rows[0];
// };

// // Get all orders (optional - for admin/test)
// const getAllOrders = async () => {
//     const result = await pool.query("SELECT * FROM orders ORDER BY created_at DESC");
//     return result.rows;
// };

// module.exports = { createOrder, getAllOrders };
