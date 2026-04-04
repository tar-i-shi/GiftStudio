import { useLocation, useNavigate } from 'react-router-dom';
import { giftData } from './giftsData';
import { useEffect, useState } from 'react';
import { useCart } from './CartContext';

function CommonGiftsPage() {
    const location = useLocation();
    const navigate = useNavigate();

    const [activeOccasions, setActiveOccasions] = useState([]);
    const { cart, addToCart, increaseQty, decreaseQty } = useCart(); // ✅ Use global cart

    const occasionList = Object.keys(giftData);

    // Read filters from URL
    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const filters = params.getAll('occasion');
        setActiveOccasions(filters);
    }, [location.search]);

    const toggleOccasion = (occasion) => {
        let updatedFilters = activeOccasions.includes(occasion)
            ? activeOccasions.filter(o => o !== occasion)
            : [...activeOccasions, occasion];

        setActiveOccasions(updatedFilters);

        const newParams = new URLSearchParams();
        updatedFilters.forEach(o => newParams.append('occasion', o));
        navigate(`/common-gifts?${newParams.toString()}`);
    };

    const clearAllFilters = () => {
        setActiveOccasions([]);
        navigate('/common-gifts');
    };

    const occasionsToDisplay = activeOccasions.length ? activeOccasions : occasionList;

    return (
        <div className="p-6">
            {/* Filter Buttons */}
            <div className="flex flex-wrap gap-3 mb-6">
                {occasionList.map(occasion => (
                    <button
                        key={occasion}
                        onClick={() => toggleOccasion(occasion)}
                        className={`px-4 py-2 rounded-full border ${activeOccasions.includes(occasion)
                            ? 'bg-green-100 text-black'
                            : 'bg-gray-100'
                            }`}
                    >
                        {occasion.charAt(0).toUpperCase() + occasion.slice(1)}
                    </button>
                ))}
                <button
                    onClick={clearAllFilters}
                    className="px-4 py-2 rounded-full bg-red-100 hover:bg-red-200"
                >
                    Clear All Filters
                </button>
            </div>

            {/* Gift Grid */}
            {occasionsToDisplay.map((occasion) => (
                <div key={occasion} className="mb-8">
                    <h2 className="text-2xl font-semibold mb-4 capitalize">{occasion} Gifts</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                        {giftData[occasion]?.map((gift, idx) => {
                            const quantity = cart[gift.name] || 0;

                            return (
                                <div key={idx} className="border p-2 rounded-2xl shadow hover:shadow-lg bg-white">
                                    <img
                                        src={gift.image}
                                        alt={gift.name}
                                        className="w-full h-[280px] object-cover rounded-2xl"
                                    />
                                    <h3 className="mt-4 text-lg font-semibold">{gift.name}</h3>
                                    <p className="text-lg font-bold text-black mt-1">{gift.price}</p>
                                    <p className="text-sm text-gray-600 flex items-center gap-1 mt-1">
                                        🛍️ <span>Earliest delivery:</span>{' '}
                                        <span className="font-medium text-black">Tomorrow</span>
                                    </p>

                                    {/* Cart Controls */}
                                    <div className="mt-4">
                                        {quantity === 0 ? (
                                            <button
                                                onClick={() => addToCart(gift.name)}
                                                className="bg-indigo-600 text-white px-4 py-2 rounded-full w-full"
                                            >
                                                Add to Cart
                                            </button>
                                        ) : (
                                            <div className="flex items-center justify-center gap-4">
                                                <button
                                                    onClick={() => decreaseQty(gift.name)}
                                                    className="bg-gray-200 px-3 py-1 rounded-full text-xl font-bold"
                                                >
                                                    −
                                                </button>
                                                <span className="text-lg font-semibold">{quantity}</span>
                                                <button
                                                    onClick={() => increaseQty(gift.name)}
                                                    className="bg-gray-200 px-3 py-1 rounded-full text-xl font-bold"
                                                >
                                                    +
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            ))}
        </div>
    );
}

export default CommonGiftsPage;
