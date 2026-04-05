const axios = require("axios");
const { getGiftsByIds } = require("../models/searchModel");

const handleSearch = async (req, res) => {
    try {
        const query = req.query.q;

        if (!query) return res.json([]);

        console.log("➡️ Query:", query);

        // ✅ FIXED ML URL
        const mlResponse = await axios.get(
            `${process.env.ML_API_URL}/semantic-search`,
            { params: { q: query } }
        );

        console.log("✅ ML raw response:", mlResponse.data);

        // ✅ Expect array of IDs
        const ids = Array.isArray(mlResponse.data)
            ? mlResponse.data
            : [];

        if (!ids.length) return res.json([]);

        const gifts = await getGiftsByIds(ids);

        // ✅ Maintain ML order
        const sorted = ids
            .map(id => gifts.find(g => g.id === id))
            .filter(Boolean);

        res.json(sorted);

    } catch (err) {
        console.error("❌ Search Error FULL:", err);

        res.status(500).json({
            error: "Search failed",
            details: err.message
        });
    }
};

module.exports = { handleSearch };