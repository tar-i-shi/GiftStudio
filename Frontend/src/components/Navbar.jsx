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
    const navigate = useNavigate();

    useEffect(() => {
        const delayDebounce = setTimeout(() => {
            if (searchTerm.trim() === "") {
                setSuggestions([]);
                return;
            }

            fetch(`/api/gifts/search?q=${encodeURIComponent(searchTerm)}`)
                .then(res => res.json())
                .then(data => {
                    if (Array.isArray(data)) {
                        setSuggestions(data.slice(0, 5));
                    } else {
                        console.error("Unexpected response:", data);
                        setSuggestions([]);
                    }
                })
                .catch(err => {
                    console.error("Search error:", err);
                    setSuggestions([]);
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
                <Link to="/" className="text-2xl font-bold text-indigo-600">GiftStudio</Link>

                <div className="hidden md:flex space-x-6">
                    <Link to="/">Home</Link>
                    <Link to="/common-gifts">Gifts</Link>
                    <Link to="/personalised-products">Personalised</Link>
                    <Link to="/occasions">Occasions</Link>
                    <Link to="/contact">Contact</Link>
                </div>

                <div className="flex items-center space-x-4">
                    <div className="relative hidden md:block w-[200px]">
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && handleSelect(searchTerm)}
                            placeholder="Search gifts..."
                            className="px-3 py-1 border border-gray-300 rounded-md w-full"
                        />
                        {searchTerm && (
                            <ul className="absolute z-10 bg-white border mt-1 shadow-lg w-full max-h-48 overflow-y-auto rounded scrollbar-hide">

                                {suggestions.length > 0 ? (
                                    suggestions.map((item, idx) => (
                                        <li
                                            key={idx}
                                            onClick={() => handleSelect(item.name)}
                                            className="px-4 py-2 hover:bg-indigo-100 cursor-pointer"
                                        >
                                            {item.name}
                                        </li>
                                    ))
                                ) : (
                                    <li className="px-4 py-2 text-gray-500 italic">No matches found</li>
                                )}
                            </ul>
                        )}
                    </div>

                    {user ? (
                        <>
                            <span className="text-md text-gray-700">Hi, {user.name}</span>
                            <button onClick={logout} className="text-md text-gray-600 hover:text-red-600">Logout</button>
                            <Link to="/orders" className="text-md text-gray-700 hover:text-indigo-600">Orders</Link>
                        </>
                    ) : (
                        <>
                            <Link to="/login">Login</Link>
                            <Link to="/signup" className="bg-indigo-600 text-white px-3 py-1 rounded">Sign Up</Link>
                        </>
                    )}

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
