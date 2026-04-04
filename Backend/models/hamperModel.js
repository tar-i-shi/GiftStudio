
const pool = require("../config/db");
async function createHamperOrder({ userId, boxType, boxPrice, gifts, address, contact, totalAmount }) {
    const client = await db.connect();
    try {
        await client.query("BEGIN");

        const commonOrder = await client.query(
            `INSERT INTO custom_orders (user_id, order_type) VALUES ($1, $2) RETURNING order_id`,
            [userId, "hamper"]
        );
        const orderId = commonOrder.rows[0].order_id;

        await client.query(
            `INSERT INTO hamper_orders (order_id, box_type, box_price, address, contact, total_amount)
             VALUES ($1, $2, $3, $4, $5, $6)`,
            [orderId, boxType, boxPrice, address, contact, totalAmount]
        );

        for (const gift of gifts) {
            await client.query(
                `INSERT INTO hamper_items (order_id, gift_name, gift_price, quantity)
                 VALUES ($1, $2, $3, $4)`,
                [orderId, gift.name, gift.price, gift.quantity]
            );
        }

        await client.query("COMMIT");
        return orderId;
    } catch (err) {
        await client.query("ROLLBACK");
        throw err;
    } finally {
        client.release();
    }
}

module.exports = { createHamperOrder };
