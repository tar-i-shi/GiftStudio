const { insertCustomOrder } = require('../models/customOrdersModel');
const { insertPhotoMugOrder } = require('../models/photoMugModel');

async function placePhotoMugOrder(req, res) {
    const { userId, size, quantity, address, contact } = req.body;
    const photoPaths = req.files.map(file => `/uploads/${file.filename}`);

    try {
        const orderId = await insertCustomOrder(userId, 'photo_mug');
        await insertPhotoMugOrder(orderId, size, quantity, photoPaths, address, contact);
        res.json({ success: true, message: 'Photo mug order placed.', orderId });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Order failed.' });
    }
}

module.exports = { placePhotoMugOrder };
