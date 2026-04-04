const pool = require("../config/db");

const createCustomOrder = async (userId) => {
    const result = await db.query(
        "INSERT INTO custom_orders (user_id, order_type) VALUES ($1, 'engraved_wood') RETURNING order_id",
        [userId]
    );
    return result.rows[0].order_id;
};

const insertEngravedWoodItems = async (customOrderId, items, address, contact) => {
    const values = items.map((item) => [
        customOrderId,
        item.name,
        item.engravingText,
        item.price,
        address,
        contact,
    ]);

    const inserts = values.map((v, i) => `($${i * 6 + 1}, $${i * 6 + 2}, $${i * 6 + 3}, $${i * 6 + 4}, $${i * 6 + 5}, $${i * 6 + 6})`).join(", ");

    const flatValues = values.flat();

    const query = `
        INSERT INTO engraved_items
        (custom_order_id, item_name, engraving_text, price, address, contact)
        VALUES ${inserts}
        RETURNING custom_order_id
    `;

    const result = await db.query(query, flatValues);
    return result.rows;
};

module.exports = {
    createCustomOrder,
    insertEngravedWoodItems,
};
