// // controllers/orderController.js
// const { createOrder, getAllOrders } = require("../models/orderPlaceModel");

// const placeOrder = async (req, res) => {
//     try {
//         const { cartItems, address, contact, paymentMethod } = req.body;
//         const userId = req.user?.id || 1; // fallback if JWT not implemented yet

//         if (!cartItems?.length || !address || !contact) {
//             return res.status(400).json({ message: "Missing required order details" });
//         }

//         // Calculate total price
//         const totalPrice = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

//         const newOrder = await createOrder(userId, totalPrice, address, contact, paymentMethod);

//         return res.status(200).json({
//             message: "Order placed successfully!",
//             orderId: newOrder.id,
//         });
//     } catch (err) {
//         console.error("Error placing order:", err);
//         return res.status(500).json({ message: "Internal Server Error" });
//     }
// };

// const getOrders = async (req, res) => {
//     try {
//         const orders = await getAllOrders();
//         res.status(200).json(orders);
//     } catch (err) {
//         console.error("Error fetching orders:", err);
//         res.status(500).json({ message: "Internal Server Error" });
//     }
// };

// module.exports = { placeOrder, getOrders };
