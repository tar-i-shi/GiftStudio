const {
    createCustomOrder,
    insertEngravedWoodItems,
} = require("../models/engravedModel");

exports.placeEngravedWoodOrder = async (req, res) => {
    const { userId, items, address, contact } = req.body;

    if (!userId || !items || !address || !contact) {
        return res.status(400).json({ error: "Missing required fields" });
    }

    try {
        const customOrderId = await createCustomOrder(userId);
        await insertEngravedWoodItems(customOrderId, items, address, contact);
        res.status(201).json({ message: "Order placed", orderId: customOrderId });
    } catch (error) {
        console.error("Engraved order error:", error);
        res.status(500).json({ error: "Failed to place order" });
    }
};
