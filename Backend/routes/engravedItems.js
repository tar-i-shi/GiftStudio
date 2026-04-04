const express = require("express");
const router = express.Router();
const { placeEngravedWoodOrder } = require("../controllers/engravedItemsController");

router.post("/engraved-customization", placeEngravedWoodOrder);

module.exports = router;
