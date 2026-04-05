const axios = require("axios");
const { getGiftsByIds } = require("../models/searchModel");

const handleSearch = async (req, res) => {
    try {
        const query = req.query.q;
        if (!query) return res.json([]);

        console.log("🔍 Query:", query);

        const mlResponse = await axios.get(
            `${process.env.ML_API_URL}/semantic-search`,
            { params: { q: query } }
        );

        const ids = mlResponse.data;

        console.log("🧠 ML IDs:", ids);

        const gifts = await getGiftsByIds(ids);

        console.log("📦 DB Results:", gifts);

        res.json(gifts);

    } catch (err) {
        console.error("❌ Search Error FULL:", err);
        res.status(500).json({
            error: "Search failed",
            details: err.message
        });
    }
};

module.exports = { handleSearch };