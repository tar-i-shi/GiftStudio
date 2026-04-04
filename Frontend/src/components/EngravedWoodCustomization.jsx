// EngravedWoodCustomization.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext"; // Adjust path if needed
import axios from "axios";

const items = [
    { id: 1, name: "Keychain", price: 199 },
    { id: 2, name: "Fridge Magnet", price: 299 },
];

export default function EngravedWoodCustomization() {
    const navigate = useNavigate();
    const { user } = useAuth();

    const [step, setStep] = useState(1);
    const [selectedItems, setSelectedItems] = useState({});
    const [engravingTexts, setEngravingTexts] = useState({});
    const [currentEngravingIndex, setCurrentEngravingIndex] = useState(0);
    const [address, setAddress] = useState("");
    const [contact, setContact] = useState("");
    const [confirmCOD, setConfirmCOD] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleItemQuantity = (id, qty) => {
        setSelectedItems((prev) => {
            const updated = { ...prev };
            if (qty > 0) {
                updated[id] = qty;
            } else {
                delete updated[id];
            }
            return updated;
        });
    };

    const itemInstances = Object.entries(selectedItems).flatMap(([itemId, qty]) => {
        const item = items.find((i) => i.id === Number(itemId));
        return Array.from({ length: qty }, (_, index) => ({
            id: item.id,
            name: item.name,
            price: item.price,
            key: `${item.id}-${index}`,
            index,
        }));
    });

    const totalPrice = itemInstances.reduce((acc, i) => acc + i.price, 0);

    const engravingStep = itemInstances[currentEngravingIndex] || {};

    const handleNext = () => {
        if (step === 1) {
            if (Object.keys(selectedItems).length === 0) {
                return alert("Please select at least one item.");
            }
            setCurrentEngravingIndex(0);
            setStep(2);
        } else if (step === 2) {
            if (!engravingTexts[engravingStep.key]?.trim()) {
                return alert("Please enter engraving text for this item.");
            }
            if (currentEngravingIndex < itemInstances.length - 1) {
                setCurrentEngravingIndex(currentEngravingIndex + 1);
            } else {
                setStep(3);
            }
        }
    };

    const handleBack = () => {
        if (step === 1) {
            navigate("/");
        } else if (step === 2) {
            if (currentEngravingIndex > 0) {
                setCurrentEngravingIndex(currentEngravingIndex - 1);
            } else {
                setStep(1);
            }
        } else if (step === 3) {
            setStep(2);
            setCurrentEngravingIndex(itemInstances.length - 1);
        }
    };

    const handleSubmit = async () => {
        if (!user) return alert("You must be logged in to place an order.");

        const payload = {
            userId: user.id,
            items: itemInstances.map((item) => ({
                itemId: item.id,
                name: item.name,
                price: item.price,
                engravingText: engravingTexts[item.key] || "",
            })),
            address,
            contact,
        };

        try {
            setLoading(true);
            const res = await axios.post("http://localhost:5000/api/engraved-customization", payload, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });
            alert("✅ Order placed! Order ID: " + res.data.orderId);
            navigate("/");
        } catch (error) {
            console.error(error);
            alert("❌ Failed to place order.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto p-12">
            <h2 className="text-4xl font-semibold mb-6">Customize Engraved Wood Gift</h2>

            {/* Step Indicator */}
            <div className="flex items-center justify-between mb-8">
                {["Select Items", "Engrave Text", "Delivery"].map((label, i) => (
                    <div key={i} className="flex-1 text-center">
                        <div
                            className={`w-10 h-10 rounded-full mx-auto flex items-center justify-center ${step === i + 1
                                ? "bg-black text-white"
                                : "border border-black"
                                }`}
                        >
                            {i + 1}
                        </div>
                        <div className="mt-2 text-sm font-medium">{label}</div>
                    </div>
                ))}
            </div>

            {step === 1 && (
                <>
                    <h3 className="text-xl font-medium mb-4">Select Items</h3>
                    <div className="grid gap-4 sm:grid-cols-2">
                        {items.map((item) => (
                            <div
                                key={item.id}
                                className={`border p-4 rounded ${selectedItems[item.id] ? "bg-green-100 border-green-500" : ""
                                    }`}
                            >
                                <p className="font-medium">{item.name} – ₹{item.price}</p>
                                <div className="flex items-center gap-3 mt-3">
                                    <button
                                        onClick={() => handleItemQuantity(item.id, Math.max((selectedItems[item.id] || 0) - 1, 0))}
                                        className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300"
                                    >–</button>
                                    <span className="min-w-[20px] text-center">{selectedItems[item.id] || 0}</span>
                                    <button
                                        onClick={() => handleItemQuantity(item.id, (selectedItems[item.id] || 0) + 1)}
                                        className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300"
                                    >+</button>
                                </div>
                            </div>
                        ))}
                    </div>
                </>
            )}

            {step === 2 && engravingStep && (
                <>
                    <h3 className="text-xl font-medium mb-4">Engraving Text</h3>
                    <p className="mb-1 font-medium">{engravingStep.name} – Item #{engravingStep.index + 1}</p>
                    <textarea
                        value={engravingTexts[engravingStep.key] || ""}
                        onChange={(e) => setEngravingTexts({ ...engravingTexts, [engravingStep.key]: e.target.value })}
                        className="w-full border rounded px-3 py-2"
                        placeholder="Enter engraving text..."
                    />
                </>
            )}

            {step === 3 && (
                <>
                    <h3 className="text-xl font-medium mb-4">Delivery Details</h3>
                    <p className="mb-2 font-medium">Order Summary:</p>
                    <ul className="list-disc ml-6 mb-4">
                        {itemInstances.map((item) => (
                            <li key={item.key}>
                                {item.name} – ₹{item.price}
                                <br />
                                <span className="text-sm text-gray-600">
                                    Engraving: {engravingTexts[item.key]}
                                </span>
                            </li>
                        ))}
                    </ul>
                    <p className="font-semibold mb-4">Total Payable: ₹{totalPrice}</p>

                    <textarea
                        rows={3}
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        className="w-full border px-3 py-2 rounded mb-3"
                        placeholder="Enter your address"
                    />

                    <input
                        type="tel"
                        value={contact}
                        onChange={(e) => setContact(e.target.value)}
                        className="w-full border px-3 py-2 rounded mb-3"
                        placeholder="Contact Number"
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
                        onClick={handleSubmit}
                    >
                        {loading ? "Placing Order..." : "Place Order"}
                    </button>
                </>
            )}

            {/* Navigation */}
            <div className="flex justify-between mt-8">
                <button
                    onClick={handleBack}
                    className="border px-4 py-2 rounded"
                >
                    {step === 1 ? "Back to Home" : "Back"}
                </button>
                {step < 3 && (
                    <button
                        onClick={handleNext}
                        className="bg-black text-white px-6 py-2 rounded"
                    >
                        Next
                    </button>
                )}
            </div>
        </div>
    );
}
