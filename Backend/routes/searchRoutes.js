const express = require("express");
const router = express.Router();
const axios = require("axios");

router.get("/search", async (req, res) => {
    try {
        const query = req.query.q;

        const response = await axios.get(
            `${process.env.ML_API_URL}/semantic-search`,
            { params: { q: query } }
        );

        res.json(response.data);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Search failed" });
    }
});

module.exports = router;