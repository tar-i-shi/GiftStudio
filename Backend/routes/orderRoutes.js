const express = require('express');
const { placeOrder, getUserOrders } = require('../controllers/orderController');


const router = express.Router();

router.post('/place', placeOrder);  // protect with auth
router.get('/my-orders', getUserOrders);

module.exports = router;
