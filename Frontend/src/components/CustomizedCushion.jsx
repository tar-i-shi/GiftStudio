import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext"; // Adjust path if needed
import axios from "axios";

const sizes = ["Small", "Medium", "Large"];
const colors = ["Red", "Blue", "White", "Black"];

export default function CustomizedCushion() {
    const navigate = useNavigate();
    const { user } = useAuth();

    const [step, setStep] = useState(1);
    const [selectedSize, setSelectedSize] = useState("");
    const [quantity, setQuantity] = useState(0);
    const [prints, setPrints] = useState([]);
    const [address, setAddress] = useState("");
    const [contact, setContact] = useState("");
    const [confirmCOD, setConfirmCOD] = useState(false);
    const [loading, setLoading] = useState(false);

    const pricePerCushion = 799;
    const totalPrice = quantity * pricePerCushion;

    const handlePrintChange = (index, value) => {
        const updated = [...prints];
        updated[index] = value;
        setPrints(updated);
    };

    const handlePlaceOrder = async () => {
        if (!user) {
            alert("You must be logged in to place an order.");
            return;
        }

        if (!address || !contact || !confirmCOD) {
            alert("Please fill all delivery details and confirm COD.");
            return;
        }
        if (prints.length < quantity) {
            alert("Please select color/print for all cushions.");
            return;
        }

        try {
            setLoading(true);
            const response = await axios.post(
                "http://localhost:5000/api/custom-cushion",
                {
                    userId: user.id,
                    size: selectedSize,
                    quantity,
                    prints,
                    address,
                    contact,
                },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                }
            );
            alert("✅ Order placed! Order ID: " + response.data.orderId);
            navigate("/"); // Redirect to home after success
        } catch (error) {
            console.error(error);
            alert("❌ Failed to place order.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto p-6">
            <h2 className="text-3xl font-semibold mb-6">Customize Your Cushion</h2>

            {step === 1 && (
                <>
                    <label className="block mb-2 font-medium">Select Cushion Size:</label>
                    <select
                        className="w-full border rounded px-3 py-3 mb-6"
                        value={selectedSize}
                        onChange={(e) => setSelectedSize(e.target.value)}
                    >
                        <option value="">-- Select Size --</option>
                        {sizes.map((size) => (
                            <option key={size} value={size}>
                                {size}
                            </option>
                        ))}
                    </select>

                    <label className="block mb-2 font-medium">Quantity:</label>
                    <div className="flex items-center gap-3 mb-6">
                        <button
                            onClick={() => setQuantity((q) => Math.max(q - 1, 0))}
                            className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
                        >
                            –
                        </button>
                        <span>{quantity}</span>
                        <button
                            onClick={() => setQuantity((q) => q + 1)}
                            className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
                        >
                            +
                        </button>
                    </div>
                </>
            )}

            {step === 2 && (
                <>
                    <h3 className="text-lg font-semibold mb-4">Customize Each Cushion</h3>
                    {Array.from({ length: quantity }).map((_, index) => (
                        <div key={index} className="mb-4">
                            <label className="block mb-1 font-medium">Cushion #{index + 1} Color/Print</label>
                            <select
                                className="w-full border px-3 py-2 rounded"
                                value={prints[index] || ""}
                                onChange={(e) => handlePrintChange(index, e.target.value)}
                            >
                                <option value="">-- Select --</option>
                                {colors.map((color) => (
                                    <option key={color} value={color}>
                                        {color}
                                    </option>
                                ))}
                            </select>
                        </div>
                    ))}
                </>
            )}

            {step === 3 && (
                <>
                    <h3 className="text-lg font-semibold mb-4">Delivery Details</h3>
                    <p className="mb-2 font-medium">Summary:</p>
                    <ul className="list-disc ml-6 mb-4">
                        <li>Size: {selectedSize}</li>
                        <li>Quantity: {quantity}</li>
                        <li>Total: ₹{totalPrice}</li>
                        <li>Colors/Prints: {prints.join(", ")}</li>
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

                    <button
                        className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 disabled:opacity-50"
                        disabled={!address || !contact || !confirmCOD || loading}
                        onClick={handlePlaceOrder}
                    >
                        {loading ? "Placing Order..." : "Place Order"}
                    </button>
                </>
            )}

            {/* Navigation */}
            <div className="flex justify-between mt-6">
                <button
                    onClick={() => {
                        if (step === 1) {
                            navigate("/");
                        } else {
                            setStep((s) => Math.max(1, s - 1));
                        }
                    }}
                    className="border px-4 py-2 rounded"
                >
                    {step === 1 ? "Back to Home" : "Back"}
                </button>
                {step < 3 && (
                    <button
                        onClick={() => {
                            if (step === 1 && (!selectedSize || quantity === 0)) {
                                return alert("Please select size and quantity.");
                            }
                            if (step === 2 && prints.length < quantity) {
                                return alert("Please choose print/color for each cushion.");
                            }
                            setStep((s) => Math.min(3, s + 1));
                        }}
                        className="bg-black text-white px-6 py-2 rounded"
                    >
                        Next
                    </button>
                )}
            </div>
        </div>
    );
}
