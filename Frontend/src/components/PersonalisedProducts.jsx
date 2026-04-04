import React from "react";
import { Link } from "react-router-dom";
import { FaMugHot, FaCouch, FaTree, FaGift } from "react-icons/fa"; // Icons

export default function PersonalisedProducts() {
    const items = [
        {
            name: "Photo Mugs",
            icon: <FaMugHot size={32} />,
            link: "/custom-photo-mug",
        },
        {
            name: "Personalised Cushions",
            icon: <FaCouch size={32} />,
            link: "/custom-cushion",
        },
        {
            name: "Engraved Wood Items",
            icon: <FaTree size={32} />,
            link: "/engraved-customization", // adjust this route when created
        },
        {
            name: "Customized Hampers",
            icon: <FaGift size={32} />,
            link: "/customized-hamper", // adjust this route when created
        },
    ];

    return (
        <div className="max-w-6xl mx-auto text-center py-14 px-3 min-h-30xl">
            <h2 className="text-3xl font-bold mb-6">Personalised Products</h2>
            <p className="text-gray-600 mb-10">
                Make your gifts special with unique personalization options
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                {items.map((item) => (
                    <Link
                        to={item.link}
                        key={item.name}
                        className="flex flex-col items-center justify-center p-6 rounded-full bg-orange-50 hover:bg-orange-100 shadow transition"
                    >
                        <div className="text-orange-800 mb-2">{item.icon}</div>
                        <span className="text-sm font-medium text-gray-800">{item.name}</span>
                    </Link>
                ))}
            </div>
        </div>
    );
}
