const axios = require("axios");
const { getGiftsByIds } = require("../models/searchModel");

const handleSearch = async (req, res) => {
    try {
        const query = req.query.q;

        if (!query) return res.json([]);

        const mlResponse = await axios.get(
            `${process.env.ML_API_URL}/semantic-search`,
            { params: { q: query } }
        );

        const ids = Array.isArray(mlResponse.data)
            ? mlResponse.data
            : [];

        console.log("ML IDs:", ids);

        const gifts = await getGiftsByIds(ids);

        // maintain ML order
        const sorted = ids.map(id => gifts.find(g => g.id === id)).filter(Boolean);

        res.json(sorted);



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