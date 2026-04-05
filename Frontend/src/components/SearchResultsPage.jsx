import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

export default function SearchResultsPage() {
    const [searchParams] = useSearchParams();
    const query = searchParams.get("q");
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!query) return;

        setLoading(true);
        fetch(`${import.meta.env.VITE_BACKEND_URL}/api/search?q=${encodeURIComponent(query)}`)
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) {
                    setResults(data);
                } else {
                    setResults([]);
                }
                setLoading(false);
            })
            .catch(err => {
                console.error("Search error:", err);
                setResults([]);
                setLoading(false);
            });
    }, [query]);

    return (
        <div className="container mx-auto px-6 py-10">
            <h2 className="text-2xl font-bold mb-4">
                Search Results for "{query}"
            </h2>

            {loading ? (
                <p>Loading...</p>
            ) : results.length === 0 ? (
                <p className="text-gray-500">No results found.</p>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {results.map((gift, index) => (
                        <div key={index} className="border p-4 rounded shadow hover:shadow-lg transition">
                            <img
                                src={gift.image}
                                alt={gift.name}
                                className="w-full h-40 object-cover rounded mb-2"
                            />
                            <h3 className="text-lg font-semibold">{gift.name}</h3>
                            <p className="text-indigo-600 font-bold">{gift.price}</p>
                            <p className="text-sm text-gray-500">{gift.occasion}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
