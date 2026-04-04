import React from "react";
import { useNavigate } from "react-router-dom";

export default function OrderSuccess() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 text-center">
            <h1 className="text-4xl font-bold text-green-600 mb-4">🎉 Order Placed Successfully!</h1>
            <p className="text-gray-700 mb-6">
                Thank you for shopping with GiftStudio. Your order will be delivered soon!
            </p>
            <button
                onClick={() => navigate("/")}
                className="bg-indigo-600 text-white px-6 py-2 rounded hover:bg-indigo-700"
            >
                Back to Home
            </button>
        </div>
    );
}
