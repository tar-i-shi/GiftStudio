const jwt = require("jsonwebtoken");
const { findUserById } = require("../models/userModel");
const { createOrder, getOrdersByUser } = require("../models/orderModel");
const { addOrderItem, getOrderItemsByOrderId } = require("../models/orderItemModel");

const getUserIdFromToken = async (req) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        throw new Error("Authorization header missing or malformed");
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await findUserById(decoded.userId);
    if (!user) throw new Error("User not found");
    return user.id;
};

const placeOrder = async (req, res) => {
    try {
        const userId = await getUserIdFromToken(req);
        const { cartItems, address, contact, paymentMethod } = req.body;

        if (!Array.isArray(cartItems) || cartItems.length === 0 || !address || !contact) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        const totalPrice = cartItems.reduce(
            (sum, item) => sum + (Number(item.price) * item.quantity),
            0
        );

        const order = await createOrder(userId, address, contact, totalPrice, paymentMethod || 'COD');

        for (const item of cartItems) {
            await addOrderItem(order.id, item.name, item.quantity, Number(item.price));
        }

        res.status(201).json({ message: 'Order placed successfully!', orderId: order.id });
    } catch (err) {
        console.error(err.message);
        res.status(err.message.includes("token") ? 401 : 500).json({
            message: err.message.includes("token")
                ? "Unauthorized. Please log in."
                : "Something went wrong"
        });
    }
};

const getUserOrders = async (req, res) => {
    try {
        const userId = await getUserIdFromToken(req);
        const orders = await getOrdersByUser(userId);

        // Include items in each order
        const ordersWithItems = await Promise.all(
            orders.map(async (order) => {
                const items = await getOrderItemsByOrderId(order.id);
                console.log(`Order ID: ${order.id}, Items:`, items);
                return { ...order, items };
            })
        );


        res.json(ordersWithItems);
    } catch (err) {
        console.error(err.message);
        res.status(err.message.includes("token") ? 401 : 500).json({
            message: err.message.includes("token")
                ? "Unauthorized. Please log in."
                : "Error retrieving orders"
        });
    }
};

module.exports = { placeOrder, getUserOrders };
