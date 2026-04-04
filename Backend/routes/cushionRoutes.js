const express = require("express");
const router = express.Router();
const { placeCushionOrder } = require("../controllers/cushionController");

router.post("/custom-cushion", placeCushionOrder);

module.exports = router;
