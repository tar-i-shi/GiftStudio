import React from "react";
import { Link } from "react-router-dom";
export default function Hero() {
    return (
        <section className="relative bg-indigo-600 text-white">
            <div className="container mx-auto px-6 py-20 flex flex-col md:flex-row items-center">
                <div className="md:w-1/2 space-y-6">
                    <h1 className="text-4xl md:text-5xl font-bold leading-tight">
                        Unique & Personalized Gifts
                    </h1>
                    <p className="text-lg md:text-xl max-w-xl">
                        Find the perfect gift to show you care. Custom gifts made just for your loved ones.
                    </p>
                    <div>
                        <Link to="/common-gifts" className="bg-white text-indigo-600 font-semibold px-6 py-3 rounded-md hover:bg-gray-100 transition">
                            Shop Now
                        </Link>
                    </div>
                </div>
                <div className="md:w-1/2 mt-12 md:mt-0">
                    <img
                        src="assets/hero.jpg"
                        alt="Gift Box"
                        className="rounded-lg shadow-lg"
                    />
                </div>
            </div>
        </section>
    );
}
