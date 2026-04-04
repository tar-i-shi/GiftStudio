import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import axios from "axios";

const boxTypes = [
    { id: "medium", name: "Medium (10–15 items)", price: 299 },
    { id: "large", name: "Large (15–25 items)", price: 499 },
];

const gifts = [
    { id: 1, name: "Chocolate Bar", price: 199 },
    { id: 2, name: "Keychain", price: 99 },
    { id: 3, name: "Mini Perfume", price: 299 },
    { id: 4, name: "Scented Candle", price: 399 },
];

export default function CustomizedHamper() {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [selectedBox, setSelectedBox] = useState(null);
    const [selectedGifts, setSelectedGifts] = useState({});
    const [address, setAddress] = useState("");
    const [contact, setContact] = useState("");
    const [confirmCOD, setConfirmCOD] = useState(false);
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);

    const handleGiftChange = (giftId, quantity) => {
        setSelectedGifts((prev) => {
            const updated = { ...prev };
            if (quantity > 0) {
                updated[giftId] = quantity;
            } else {
                delete updated[giftId];
            }
            return updated;
        });
    };

    const selectedGiftDetails = gifts
        .filter((g) => selectedGifts[g.id])
        .map((gift) => ({
            ...gift,
            quantity: selectedGifts[gift.id],
            total: selectedGifts[gift.id] * gift.price,
        }));

    const giftTotal = selectedGiftDetails.reduce((acc, g) => acc + g.total, 0);
    const boxTotal = selectedBox ? selectedBox.price : 0;
    const grandTotal = giftTotal + boxTotal;
    const handleSubmit = async () => {
        if (!user) {
            return alert("You must be logged in to place an order.");
        }

        try {
            setLoading(true);


            const response = await axios.post(
                `${import.meta.env.VITE_API_URL}/api/customized-hamper`,
                userId: user.id,
                boxType: selectedBox?.id,
                boxPrice: selectedBox?.price,
                gifts: selectedGiftDetails.map(g => ({
                    name: g.name,
                    price: g.price,
                    quantity: g.quantity
                })),
                address,
                contact,
                totalAmount: grandTotal
            }, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`
            }
        });

        alert("✅ Order placed! Order ID: " + response.data.orderId);
        navigate("/");
    } catch (err) {
        console.error(err);
        alert("❌ Failed to place order.");
    } finally {
        setLoading(false);
    }
};
return (
    <div className="max-w-4xl mx-auto p-6">
        {/* Step Indicator */}
        <div className="flex items-center justify-between mb-8">
            {[1, 2, 3, 4].map((s) => (
                <div key={s} className="flex-1 text-center relative">
                    <div
                        className={`w-10 h-10 rounded-full mx-auto flex items-center justify-center ${step === s ? "bg-black text-white" : "border border-black"
                            }`}
                    >
                        {s}
                    </div>
                    <div className="mt-2 text-sm font-medium">
                        {["Box", "Gifts", "Summary", "Order"][s - 1]}
                    </div>
                </div>
            ))}
        </div>

        {/* Step 1: Box Selection */}
        {step === 1 && (
            <>
                <h2 className="text-2xl font-semibold mb-4">Choose Box Type</h2>
                <div className="grid gap-4">
                    {boxTypes.map((box) => (
                        <label
                            key={box.id}
                            className={`border p-4 rounded cursor-pointer ${selectedBox?.id === box.id ? "bg-indigo-100 border-indigo-500" : ""
                                }`}
                        >
                            <input
                                type="radio"
                                name="box"
                                className="mr-2"
                                checked={selectedBox?.id === box.id}
                                onChange={() => setSelectedBox(box)}
                            />
                            {box.name} – ₹{box.price}
                        </label>
                    ))}
                </div>
            </>
        )}

        {/* Step 2: Gift Selection */}
        {step === 2 && (
            <>
                <h2 className="text-2xl font-semibold mb-4">Choose Gift Items</h2>
                <div className="grid sm:grid-cols-2 gap-4">
                    {gifts.map((gift) => (
                        <div
                            key={gift.id}
                            className={`border p-4 rounded ${selectedGifts[gift.id] ? "bg-green-100 border-green-500" : ""
                                }`}
                        >
                            <p className="font-medium mb-2">
                                {gift.name} – ₹{gift.price}
                            </p>
                            <div className="flex items-center gap-3 mt-2">
                                <button
                                    onClick={() =>
                                        handleGiftChange(
                                            gift.id,
                                            Math.max((selectedGifts[gift.id] || 0) - 1, 0)
                                        )
                                    }
                                    className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300"
                                >
                                    –
                                </button>
                                <span className="min-w-[20px] text-center">
                                    {selectedGifts[gift.id] || 0}
                                </span>
                                <button
                                    onClick={() =>
                                        handleGiftChange(gift.id, (selectedGifts[gift.id] || 0) + 1)
                                    }
                                    className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300"
                                >
                                    +
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </>
        )}

        {/* Step 3: Summary */}
        {step === 3 && (
            <>
                <h2 className="text-2xl font-semibold mb-4">Order Summary</h2>
                <div className="mb-4">
                    <p>
                        <strong>Box:</strong> {selectedBox?.name} – ₹{boxTotal}
                    </p>
                    <p className="mt-2 font-medium">Gift Items:</p>
                    <ul className="list-disc ml-6">
                        {selectedGiftDetails.map((gift) => (
                            <li key={gift.id}>
                                {gift.name} (x{gift.quantity}) – ₹{gift.total}
                            </li>
                        ))}
                    </ul>
                </div>
                <p className="text-xl font-semibold">Total: ₹{grandTotal}</p>
            </>
        )}

        {/* Step 4: Order Placement */}
        {step === 4 && (
            <>
                <h2 className="text-2xl font-semibold mb-4">Place Your Order</h2>
                <p className="mb-2 text-gray-800">
                    Payable Amount (Cash on Delivery): ₹{grandTotal}
                </p>

                <div className="mb-4">
                    <label className="block font-medium mb-1">Delivery Address</label>
                    <textarea
                        rows={3}
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        className="w-full border px-3 py-2 rounded"
                        placeholder="Enter your full address"
                    />
                </div>

                <div className="mb-4">
                    <label className="block font-medium mb-1">Contact Number</label>
                    <input
                        type="tel"
                        value={contact}
                        onChange={(e) => setContact(e.target.value)}
                        className="w-full border px-3 py-2 rounded"
                        placeholder="Enter your phone number"
                    />
                </div>

                <div className="mb-4">
                    <label className="flex items-center space-x-2">
                        <input
                            type="checkbox"
                            checked={confirmCOD}
                            onChange={(e) => setConfirmCOD(e.target.checked)}
                        />
                        <span>I confirm this is a Cash on Delivery order</span>
                    </label>
                </div>

                <button
                    className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 disabled:opacity-50"
                    disabled={!address || !contact || !confirmCOD}
                    onClick={handleSubmit}
                >
                    Confirm Cash on Delivery
                </button>
            </>
        )}

        {/* Navigation Controls */}
        <div className="flex justify-between mt-8">
            <button
                onClick={() => {
                    if (step === 1) {
                        navigate("/"); // ✅ Navigate to home page
                    } else {
                        setStep((s) => Math.max(1, prev - 1));
                    }
                }}
                className="border px-4 py-2 rounded"
            >
                {step === 1 ? "Back to Home" : "Back"}
            </button>
            {step < 4 && (<button
                onClick={() => {
                    if (step === 1 && !selectedBox) return alert("Please select a box.");
                    if (step === 2 && Object.keys(selectedGifts).length === 0)
                        return alert("Please select at least one gift.");
                    setStep((prev) => Math.min(4, prev + 1));
                }}
                className="bg-black text-white px-6 py-2 rounded"
                disabled={step === 4}
            >
                Next
            </button>)}
        </div>
    </div>
);
}
