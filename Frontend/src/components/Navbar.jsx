import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "./CartContext";
import { useAuth } from "./AuthContext";

export default function Navbar() {
    const { cart } = useCart();
    const { user, logout } = useAuth();
    const totalItems = Object.values(cart).reduce((sum, qty) => sum + qty, 0);

    const [searchTerm, setSearchTerm] = useState("");
    const [suggestions, setSuggestions] = useState([]);
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        const delayDebounce = setTimeout(() => {
            if (searchTerm.trim() === "") {
                setSuggestions([]);
                return;
            }

            setLoading(true);

            // ✅ IMPORTANT: use correct backend route
            fetch(`${import.meta.env.VITE_API_URL}/api/search?q=${encodeURIComponent(searchTerm)}`)
                .then(res => res.json())
                .then(data => {
                    if (Array.isArray(data)) {
                        setSuggestions(data.slice(0, 5));
                    } else {
                        setSuggestions([]);
                    }
                    setLoading(false);
                })
                .catch(err => {
                    console.error("Search error:", err);
                    setSuggestions([]);
                    setLoading(false);
                });

        }, 300);

        return () => clearTimeout(delayDebounce);
    }, [searchTerm]);

    const handleSelect = (name) => {
        navigate(`/search?q=${encodeURIComponent(name)}`);
        setSearchTerm("");
        setSuggestions([]);
    };

    return (
        <nav className="bg-white shadow-md sticky top-0 z-50">
            <div className="container mx-auto px-6 py-4 flex items-center justify-between">

                <Link to="/" className="text-2xl font-bold text-indigo-600">
                    GiftStudio
                </Link>

                <div className="hidden md:flex space-x-6">
                    <Link to="/">Home</Link>
                    <Link to="/common-gifts">Gifts</Link>
                    <Link to="/personalised-products">Personalised</Link>
                    <Link to="/occasions">Occasions</Link>
                    <Link to="/contact">Contact</Link>
                </div>

                <div className="flex items-center space-x-4">

                    {/* 🔍 SEARCH BAR */}
                    <div className="relative hidden md:block w-[250px]">
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && handleSelect(searchTerm)}
                            placeholder="Search gifts..."
                            className="px-3 py-2 border border-gray-300 rounded-md w-full"
                        />

                        {/* 🔽 DROPDOWN */}
                        {searchTerm && (
                            <ul className="absolute z-50 bg-white border mt-1 shadow-lg w-full max-h-60 overflow-y-auto rounded">

                                {loading ? (
                                    <li className="px-4 py-2 text-gray-500">
                                        Loading...
                                    </li>
                                ) : suggestions.length > 0 ? (
                                    suggestions.map((item, idx) => (
                                        <li
                                            key={idx}
                                            onClick={() => handleSelect(item.name)}
                                            className="flex items-center gap-2 px-4 py-2 hover:bg-indigo-100 cursor-pointer"
                                        >
                                            {/* ✅ IMAGE */}
                                            <img
                                                src={item.image}
                                                alt={item.name}
                                                className="w-10 h-10 object-cover rounded"
                                            />

                                            <div>
                                                <p className="text-sm font-medium">{item.name}</p>
                                                <p className="text-xs text-gray-500">{item.occasion}</p>
                                            </div>
                                        </li>
                                    ))
                                ) : (
                                    <li className="px-4 py-2 text-gray-500 italic">
                                        No matches found
                                    </li>
                                )}
                            </ul>
                        )}
                    </div>

                    {/* 👤 USER */}
                    {user ? (
                        <>
                            <span className="text-md text-gray-700">Hi, {user.name}</span>
                            <button
                                onClick={logout}
                                className="text-md text-gray-600 hover:text-red-600"
                            >
                                Logout
                            </button>
                            <Link to="/orders" className="text-md text-gray-700 hover:text-indigo-600">
                                Orders
                            </Link>
                        </>
                    ) : (
                        <>
                            <Link to="/login">Login</Link>
                            <Link to="/signup" className="bg-indigo-600 text-white px-3 py-1 rounded">
                                Sign Up
                            </Link>
                        </>
                    )}

                    {/* 🛒 CART */}
                    <Link to="/cart" className="text-gray-600 hover:text-indigo-600 relative">
                        🛒
                        {totalItems > 0 && (
                            <span className="absolute top-0 right-0 bg-red-500 text-white text-xs px-2 rounded-full -mt-1 -mr-1">
                                {totalItems}
                            </span>
                        )}
                    </Link>

                </div>
            </div>
        </nav>
    );
}