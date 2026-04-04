import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';

function OrdersPage() {
    const [orders, setOrders] = useState([]);
    const { user } = useAuth();

    useEffect(() => {
        const fetchOrders = async () => {
            const token = localStorage.getItem('token');
            if (!token) return;

            try {
                const response = await axios.get('http://localhost:5000/api/orders/my-orders', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setOrders(response.data);
            } catch (err) {
                console.error('Failed to fetch orders:', err);
                alert('Error loading order history');
            }
        };

        fetchOrders();
    }, []);

    return (
        <div className="max-w-3xl mx-auto px-4 py-10">
            <h2 className="text-2xl font-bold mb-6">Your Orders</h2>

            {orders.length === 0 ? (
                <p>No past orders found.</p>
            ) : (
                <div className="space-y-6">
                    {orders.map((order, index) => (
                        <div key={index} className="border p-4 rounded-lg shadow">
                            <p className="font-semibold">Order ID: {order.id}</p>
                            <p>Date: {new Date(order.created_at).toLocaleString()}</p>
                            <p>Address: {order.address}</p>
                            <p>Contact: {order.contact}</p>
                            <p>Payment: {order.payment_method}</p>
                            <br />
                            <p className="font-semibold">Items:</p>
                            <ul className="ml-4 list-disc">
                                {order.items.map((item, i) => (
                                    <li key={i}>
                                        {item.gift_name} x {item.quantity} — ₹{item.price}
                                    </li>
                                ))}
                            </ul>
                            <br />
                            <p>Total Price: {order.total_price}</p>
                        </div>
                    ))}
                </div>
            )
            }
        </div >
    );
}

export default OrdersPage;
