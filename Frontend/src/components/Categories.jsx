import React from "react";
import { Link } from "react-router-dom"; // import Link

const categories = [
    {
        name: "Birthday Gifts",
        image: "src/assets/b_tea_time_moments.webp",
        path: "/common-gifts?occasion=Birthday",
    },
    {
        name: "Anniversary Gifts",
        image: "src/assets/a_love_letter_necklace.webp",
        path: "/common-gifts?occasion=Anniversary",
    },
    {
        name: "Housewarming",
        image: "src/assets/h_elegant_charm.webp",
        path: "/common-gifts?occasion=Housewarming",
    },
    {
        name: "Proposal",
        image: "src/assets/p_Gracefull_charm.webp",
        path: "/common-gifts?occasion=Proposal",
    },
];

export default function Categories() {
    return (
        <section className="py-16 bg-gray-50">
            <div className="container mx-auto px-6">
                <h2 className="text-3xl font-semibold mb-10 text-center">Shop by Category</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                    {categories.map((cat) => (
                        <Link
                            to={cat.path}
                            key={cat.name}
                            className="relative group rounded-lg overflow-hidden cursor-pointer shadow-lg"
                        >
                            <img
                                src={cat.image}
                                alt={cat.name}
                                className="w-full h-56 object-cover group-hover:scale-110 transition-transform duration-300"
                            />
                            <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                <h3 className="text-white text-xl font-semibold">{cat.name}</h3>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}
