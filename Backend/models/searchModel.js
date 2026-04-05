const pool = require("../config/db");

const getGiftsByIds = async (ids) => {
    if (!ids.length) return [];

    const query = `
        SELECT id, name, price, image, occasion
        FROM gifts
        WHERE id = ANY($1)
    `;

    const result = await pool.query(query, [ids]);
    return result.rows;
};

module.exports = {
    getGiftsByIds
};