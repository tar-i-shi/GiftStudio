// CustomPhotoMug.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // ✅ Import for navigation
import { useAuth } from "./AuthContext"; // Make sure your context file path is correct
import axios from "axios"; // Axios for HTTP requests
const mugSizes = ["Standard", "Large"];

export default function CustomPhotoMug() {
    const navigate = useNavigate(); // ✅ Initialize navigate
    const { user } = useAuth();
    const [step, setStep] = useState(1);
    const [selectedSize, setSelectedSize] = useState("");
    const [quantity, setQuantity] = useState(0);
    const [photos, setPhotos] = useState([]);
    const [address, setAddress] = useState("");
    const [contact, setContact] = useState("");
    const [confirmCOD, setConfirmCOD] = useState(false);
    const [loading, setLoading] = useState(false);
    const pricePerMug = 499;
    const totalPrice = quantity * pricePerMug;

    const handlePhotoUpload = (index, file) => {
        const updated = [...photos];
        updated[index] = file;
        setPhotos(updated);
    };
    const handleSubmit = async () => {
        if (!user) {
            return alert("You must be logged in to place an order.");
        }

        const formData = new FormData();
        formData.append("userId", user.id);
        formData.append("size", selectedSize);
        formData.append("quantity", quantity);
        formData.append("address", address);
        formData.append("contact", contact);
        photos.forEach((photo) => formData.append("photos", photo));

        try {
            setLoading(true);
            const response = await axios.post(
                `${import.meta.env.VITE_API_URL}/api/photo-mug`,
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                        Authorization: `Bearer ${localStorage.getItem("token")}`, // If needed
                    },
                }
            );
            alert("✅ Order placed! Order ID: " + response.data.orderId);
            navigate("/"); // Redirect home after order
        } catch (err) {
            console.error(err);
            alert("❌ Failed to place order.");
        } finally {
            setLoading(false);
        }
    };
    return (
        <div className="max-w-3xl mx-auto p-14">
            <h2 className="text-5xl font-semibold mb-6">Customize Your Photo Mug</h2>

            {step === 1 && (
                <>
                    <label className="block mb-2 font-medium">Select Mug Size:</label>
                    <select
                        className="w-full border rounded px-3 py-3 mb-6"
                        value={selectedSize}
                        onChange={(e) => setSelectedSize(e.target.value)}
                    >
                        <option value="">-- Select Size --</option>
                        {mugSizes.map((size) => (
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
                    <h3 className="text-lg font-semibold mb-4">Upload Photos for Each Mug</h3>
                    {Array.from({ length: quantity }).map((_, index) => (
                        <div key={index} className="mb-4">
                            <label className="block mb-1 font-medium">Mug #{index + 1} Photo</label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => handlePhotoUpload(index, e.target.files[0])}
                                className="w-full border px-3 py-2 rounded"
                            />
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
                        disabled={!address || !contact || !confirmCOD}
                        onClick={handleSubmit}
                    >
                        Place Order
                    </button>
                </>
            )}

            {/* Navigation */}
            <div className="flex justify-between mt-6">
                <button
                    onClick={() => {
                        if (step === 1) {
                            navigate("/"); // ✅ Navigate to home page
                        } else {
                            setStep((s) => Math.max(1, s - 1));
                        }
                    }}
                    className="border px-4 py-2 rounded"
                >
                    {step === 1 ? "Back to Home" : "Back"}
                </button>
                {step < 3 && (<button
                    onClick={() => {
                        if (step === 1 && (!selectedSize || quantity === 0)) {
                            return alert("Please select size and quantity.");
                        }
                        if (step === 2 && photos.length < quantity) {
                            return alert("Please upload photo for each mug.");
                        }
                        setStep((s) => Math.min(3, s + 1));
                    }}
                    className="bg-black text-white px-6 py-2 rounded"
                >
                    Next
                </button>)}
            </div>
        </div >
    );
}
