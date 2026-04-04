import React, { useState, useEffect } from 'react';
import { useCart } from './CartContext';
import { giftData } from './giftsData';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import axios from 'axios';

function CheckoutPage() {
    const { cart, clearCart } = useCart();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [address, setAddress] = useState('');
    const [contact, setContact] = useState('');
    const [confirmCOD, setConfirmCOD] = useState(false);

    // ✅ Redirect to login if not logged in
    useEffect(() => {
        if (!user) {
            alert('You must be logged in to proceed to checkout.');
            navigate('/login');
        }
    }, [user, navigate]);

    const allGifts = Object.values(giftData).flat();
    const getGiftDetails = (name) => allGifts.find((g) => g.name === name);

    const cartItems = Object.entries(cart)
        .map(([name, quantity]) => {
            const gift = getGiftDetails(name);
            return gift ? { ...gift, quantity } : null;
        })
        .filter(Boolean);

    const totalPrice = cartItems.reduce((sum, item) => {
        const priceNum = parseFloat(item.price.replace(/[^\d.]/g, ''));
        return sum + priceNum * item.quantity;
    }, 0);

    const handleSubmit = async () => {
        if (!user) {
            alert('You must be logged in to place an order.');
            navigate('/login');
            return;
        }

        if (!address || !contact || !confirmCOD) {
            alert('Please fill all fields and confirm COD.');
            return;
        }

        try {
            const token = localStorage.getItem('token');
            if (!token) {
                alert('Authentication token missing. Please login again.');
                navigate('/login');
                return;
            }

            const itemsToSend = cartItems.map((item) => ({
                name: item.name,
                quantity: item.quantity,
                price: parseFloat(item.price.replace(/[^\d.]/g, '')),
            }));

            const response = await axios.post(
                'http://localhost:5000/api/orders/place',
                {
                    cartItems: itemsToSend,
                    address,
                    contact,
                    paymentMethod: 'COD',
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (response.status === 201) {
                alert(response.data.message || 'Order placed successfully!');
                clearCart();
                navigate('/order-success');
            } else {
                alert(response.data.message || 'Something went wrong');
            }
        } catch (err) {
            console.error('Submit error:', err);
            if (err.response) {
                alert(err.response.data.message || 'Error placing order');
            } else {
                alert('Network error or server not reachable');
            }
        }
    };

    return (
        <div className="max-w-2xl mx-auto px-6 py-10">
            <h2 className="text-2xl font-bold mb-6">Checkout</h2>

            <p className="mb-2 font-medium">Order Summary:</p>
            <ul className="list-disc ml-6 mb-4">
                {cartItems.map((item) => (
                    <li key={item.name}>
                        {item.name} x {item.quantity}
                    </li>
                ))}
                <li>Total: ₹{totalPrice.toFixed(2)}</li>
            </ul>

            <textarea
                className="w-full border px-3 py-2 rounded mb-3"
                rows={3}
                placeholder="Enter delivery address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
            />

            <input
                className="w-full border px-3 py-2 rounded mb-3"
                type="tel"
                placeholder="Contact Number"
                value={contact}
                onChange={(e) => setContact(e.target.value)}
            />

            <label className="flex items-center mb-4">
                <input
                    type="checkbox"
                    checked={confirmCOD}
                    onChange={() => setConfirmCOD(!confirmCOD)}
                    className="mr-2"
                />
                Confirm Cash on Delivery
            </label>

            <div className="flex justify-between">
                <button
                    className="text-gray-600 hover:underline"
                    onClick={() => navigate('/cart')}
                >
                    ← Back to Cart
                </button>
                <button
                    className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 disabled:opacity-50"
                    disabled={!address || !contact || !confirmCOD}
                    onClick={handleSubmit}
                >
                    Place Order
                </button>
            </div>
        </div>
    );
}

export default CheckoutPage;
