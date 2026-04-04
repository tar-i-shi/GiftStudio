const { createHamperOrder } = require("../models/hamperModel");

exports.placeHamperOrder = async (req, res) => {
    try {
        const orderId = await createHamperOrder(req.body);
        res.json({ orderId });
    } catch (err) {
        console.error("Hamper Order Error:", err);
        res.status(500).json({ message: "Failed to place hamper order." });
    }
};
