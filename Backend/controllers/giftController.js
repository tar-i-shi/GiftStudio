const axios = require("axios");

const searchGifts = async (req, res) => {
    const query = req.query.q;
    if (!query) return res.status(400).json({ message: "Query required" });

    try {
        const response = await axios.post("http://127.0.0.1:5000/search", { query });
        return res.status(200).json(response.data);
    } catch (err) {
        console.error("Search error from Python:", err.message);
        return res.status(500).json({ message: "Internal server error" });
    }
};

module.exports = { searchGifts };
