const axios = require("axios");
const { getGiftsByNames } = require("../models/searchModel");

const handleSearch = async (req, res) => {
    try {
        const query = req.query.q;

        if (!query) return res.json([]);

        if (!process.env.ML_API_URL) {
            throw new Error("ML_API_URL not defined");
        }

        // 🔥 Call ML API
        const mlResponse = await axios.get(
            `${process.env.ML_API_URL}/semantic-search`,
            { params: { q: query } }
        );

        const mlData = mlResponse.data;

        // ✅ SAFE extraction
        const names = Array.isArray(mlData)
            ? mlData.map(item => item.name)
            : [];

        const gifts = await getGiftsByNames(names);

        // ❗ DO NOT MODIFY IMAGE PATH
        res.json(gifts);

    } catch (err) {
        console.error("Search Error:", err.message);

        res.status(500).json({
            error: "Search failed",
            details: err.message
        });
    }
};

module.exports = {
    handleSearch
};