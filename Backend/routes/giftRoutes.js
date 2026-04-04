const express = require("express");
const router = express.Router();
const { searchGifts } = require("../controllers/giftController");

router.get("/search", searchGifts);

module.exports = router;
