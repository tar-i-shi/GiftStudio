const pool = require("../config/db");

const getGiftsByNames = async (names) => {
    if (!names.length) return [];

    const query = `
        SELECT id, name, price, image, occasion
        FROM gifts
        WHERE name = ANY($1)
    `;

    const result = await pool.query(query, [names]);
    return result.rows;
};

module.exports = {
    getGiftsByNames
};