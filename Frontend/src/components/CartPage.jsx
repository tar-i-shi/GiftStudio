// CartPage.js
import React from 'react';
import { useNavigate } from 'react-router-dom'; // 👈 Add this
import { useCart } from './CartContext';
import { giftData } from './giftsData';

function CartPage() {
    const { cart, increaseQty, decreaseQty } = useCart();
    const navigate = useNavigate(); // 👈

    const allGifts = Object.values(giftData).flat();
    const getGiftDetails = (name) => allGifts.find(g => g.name === name);

    const cartItems = Object.entries(cart).map(([name, quantity]) => {
        const gift = getGiftDetails(name);
        return gift ? { ...gift, quantity } : null;
    }).filter(Boolean);

    const totalPrice = cartItems.reduce((sum, item) => {
        const price = parseFloat(item.price.replace(/[^\d.]/g, ''));
        return sum + (price * item.quantity);
    }, 0);

    return (
        <div className="container mx-auto px-6 py-8">
            <h2 className="text-2xl font-bold mb-6">Your Cart</h2>

            {cartItems.length === 0 ? (
                <p className="text-gray-600">Your cart is empty.</p>
            ) : (
                <>
                    <div className="space-y-6">
                        {cartItems.map(item => (
                            <div key={item.name} className="flex items-center gap-4 border p-4 rounded-xl bg-white shadow">
                                <img src={item.image} alt={item.name} className="w-24 h-24 object-cover rounded-lg" />
                                <div className="flex-1">
                                    <h3 className="text-lg font-semibold">{item.name}</h3>
                                    <p className="text-sm text-gray-600">{item.price}</p>
                                    <div className="flex items-center mt-2 space-x-3">
                                        <button onClick={() => decreaseQty(item.name)} className="px-3 py-1 bg-gray-200 rounded-full">−</button>
                                        <span className="font-semibold">{item.quantity}</span>
                                        <button onClick={() => increaseQty(item.name)} className="px-3 py-1 bg-gray-200 rounded-full">+</button>
                                    </div>
                                </div>
                            </div>
                        ))}

                        <div className="mt-6 text-right">
                            <h4 className="text-xl font-bold mb-2">Total: ₹{totalPrice.toFixed(2)}</h4>
                            <button
                                className="bg-indigo-600 text-white px-6 py-2 rounded-full hover:bg-indigo-700"
                                onClick={() => navigate('/checkout')}
                            >
                                Proceed to Checkout
                            </button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}

export default CartPage;
