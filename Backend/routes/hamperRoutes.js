const express = require("express");
const router = express.Router();
const { placeHamperOrder } = require("../controllers/hamperController");


router.post("/customized-hamper", placeHamperOrder);

module.exports = router;
