
const pool = require("../config/db");
async function insertPhotoMugOrder(orderId, size, quantity, photoUrls, address, contact) {
    return pool.query(
        `INSERT INTO custom_photo_mugs (order_id, size, quantity, photo_urls, address, contact)
     VALUES ($1, $2, $3, $4, $5, $6)`,
        [orderId, size, quantity, photoUrls, address, contact]
    );
}

module.exports = { insertPhotoMugOrder };
