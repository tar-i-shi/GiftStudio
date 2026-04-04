import React from "react";
import { useNavigate } from "react-router-dom"; // Import this for navigation

const products = [
    {
        id: 1,
        name: "Custom Photo Mug",
        price: "₹499",
        image:
            "src/assets/cn_photo_mug.jpg",
    },
    {
        id: 2,
        name: "Personalized Cushion",
        price: "₹799",
        image:
            "src/assets/cn_cushion.webp",
    },
    {
        id: 3,
        name: "Engraved Wooden Customization",
        price: "₹1299",
        image:
            "src/assets/cn_wood_keychain.avif",
    },
    {
        id: 4,
        name: "Customized Hamper",
        price: "₹799",
        image:
            "src/assets/b_chocoholic.webp",
    },
];

export default function FeaturedProducts() {
    const navigate = useNavigate(); // hook for navigation

    const handleClick = (product) => {
        if (product.name === "Customized Hamper") {
            navigate("/customized-hamper"); // assuming your route is named like this
        } else if (product.name === "Engraved Wooden Customization") {
            navigate("/engraved-customization");
        } else if (product.name === "Custom Photo Mug") {
            navigate("/custom-photo-mug");
        } else if (product.name === "Personalized Cushion") {
            navigate("/custom-cushion");
        } else {
            // Handle add to cart logic for other items
            alert(`${product.name} added to cart!`);
        }
    };

    return (
        <section className="py-16 container mx-auto px-6">
            <h2 className="text-3xl font-semibold mb-10 text-center">Featured Gifts</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
                {products.map((p) => (
                    <div
                        key={p.id}
                        className="border rounded-lg overflow-hidden shadow hover:shadow-lg transition-shadow cursor-pointer"
                    >
                        <img
                            src={p.image}
                            alt={p.name}
                            className="w-full h-64 object-cover"
                        />
                        <div className="p-4">
                            <h3 className="text-lg font-semibold">{p.name}</h3>
                            <p className="mt-2 text-indigo-600 font-bold">{p.price}</p>
                            <button
                                onClick={() => handleClick(p)}
                                className="mt-4 bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition"
                            >
                                {p.name === "Customized Hamper" ? "Customize Now" : "Customize Now"}
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
