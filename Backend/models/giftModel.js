const pool = require("../config/db");

const findGiftsBySearch = async (searchTerm = "", occasion) => {
    const query = `
        SELECT * FROM gifts 
        WHERE LOWER(name) LIKE $1
        ${occasion ? "AND LOWER(occasion) = LOWER($2)" : ""}
        LIMIT 10
    `;
    const values = occasion ? [`%${searchTerm.toLowerCase()}%`, occasion] : [`%${searchTerm.toLowerCase()}%`];

    const result = await db.query(query, values);
    return result.rows;
};

module.exports = { findGiftsBySearch };
