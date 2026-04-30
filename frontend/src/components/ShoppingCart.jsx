import { useState, useEffect } from 'react';

export default function ShoppingCart() {
    const [cartItems, setCartItems] = useState([]);

    useEffect(() => {
        const rawCart = localStorage.getItem("cart");

        if (rawCart) {
            setCartItems(JSON.parse(rawCart));
        }
    }, []); // Hämtar bara från localStorage EN gång när sidan laddas

    // Uträkning för produkter i cart
    // Körs varjre gång efter cartItems ändras
    const total = cartItems.reduce((sum, product) => {
        return sum + (product.price * (product.quantity || 1));
    }, 0);

    return (
        <div className="shopping-cart">
            <h2 className='text-white'>Din varukorg</h2>

            {cartItems.length === 0 ? (
                <p>Kundvagnen är tom</p>
            ) : (
                <>
                    <ul>
                        {cartItems.map((product) => (
                            <li key={product.id}>
                                {product.name} - {product.price} kr
                            </li>
                        ))}
                    </ul>

                    <div className="cart-total">
                        <hr />
                        <p><strong>Totalpris: {total} kr</strong></p>
                    </div>
                </>
            )}
        </div>
    );
}