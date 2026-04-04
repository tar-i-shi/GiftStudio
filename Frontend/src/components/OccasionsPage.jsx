import React from "react";
import { Link } from "react-router-dom";
import {
    FaBirthdayCake,
    FaGift,
    FaHeart,
    FaBaby,
    FaRegGrinStars,
    FaRegSadCry,
    FaRing,
    FaHome,
} from "react-icons/fa";

// Occasion label should match the keys in giftData for filtering to work
const occasions = [
    { icon: <FaBirthdayCake size={40} />, label: "Birthday" },
    { icon: <FaRegGrinStars size={40} />, label: "Anniversary" },
    { icon: <FaHome size={40} />, label: "Housewarming" },
    { icon: <FaHeart size={40} />, label: "Wedding" },
    { icon: <FaBaby size={40} />, label: "Baby Shower" },
    { icon: <FaGift size={40} />, label: "Farewell" },
    { icon: <FaRegSadCry size={40} />, label: "Get Well Soon" },
    { icon: <FaRing size={40} />, label: "Proposal" },
];

const OccasionsPage = () => {
    return (
        <div className="bg-white py-10 px-4 text-center">
            <h1 className="text-4xl font-bold text-gray-800 mb-2">What’s The Occasion?</h1>
            <p className="text-gray-600 mb-10">Elevate every moment with thoughtful gifting solutions</p>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 max-w-6xl mx-auto">
                {occasions.map((occasion, index) => (
                    <Link
                        key={index}
                        to={`/common-gifts?occasion=${encodeURIComponent(occasion.label)}`}
                        className="flex flex-col items-center"
                    >
                        <div className="w-28 h-28 md:w-32 md:h-32 bg-orange-50 rounded-full flex items-center justify-center mb-2 shadow hover:shadow-md transition">
                            <div className="text-orange-900">{occasion.icon}</div>
                        </div>
                        <p className="text-sm font-medium text-gray-700 capitalize">{occasion.label}</p>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default OccasionsPage;
