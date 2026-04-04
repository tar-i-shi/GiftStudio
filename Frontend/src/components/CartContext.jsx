import { createContext, useContext, useState } from 'react';

const CartContext = createContext();

export function CartProvider({ children }) {
    const [cart, setCart] = useState({}); // key: gift name/id, value: quantity

    const addToCart = (giftName) => {
        setCart(prev => ({ ...prev, [giftName]: 1 }));
    };

    const increaseQty = (giftName) => {
        setCart(prev => ({ ...prev, [giftName]: (prev[giftName] || 0) + 1 }));
    };

    const decreaseQty = (giftName) => {
        setCart(prev => {
            const currentQty = prev[giftName];
            if (currentQty <= 1) {
                const updated = { ...prev };
                delete updated[giftName];
                return updated;
            }
            return { ...prev, [giftName]: currentQty - 1 };
        });
    };

    const clearCart = () => {
        setCart({});
    };

    const getTotalQuantity = () =>
        Object.values(cart).reduce((total, qty) => total + qty, 0);

    return (
        <CartContext.Provider
            value={{
                cart,
                addToCart,
                increaseQty,
                decreaseQty,
                clearCart,
                getTotalQuantity
            }}
        >
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    return useContext(CartContext);
}
