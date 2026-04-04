const { createCustomOrder, createCushionOrder } = require("../models/cushionModel");

const placeCushionOrder = async (req, res) => {
    const { userId, size, quantity, prints, address, contact } = req.body;

    if (!userId || !size || !quantity || !prints || !address || !contact) {
        return res.status(400).json({ success: false, message: "All fields are required." });
    }

    try {
        const orderId = await createCustomOrder(userId);
        await createCushionOrder(orderId, size, quantity, prints, address, contact);

        res.json({ success: true, message: "Cushion order placed.", orderId });
    } catch (err) {
        console.error("Cushion Order Error:", err);
        res.status(500).json({ success: false, message: "Order failed." });
    }
};

module.exports = { placeCushionOrder };
