import { useState, useEffect } from 'react';

export default function ShoppingCart({ cartItems }) {
    
    const [cartItems, setCartItems] = useState([]);
    // Visar produkterna i kundvagnen om det finns några, annars en tom lista
    const itemsToShow = cartItems || [];

    // Räknar ut summan för produkterna i shopping cart
    const total = itemsToShow.reduce((sum, product) => {
        return sum + (product.price * (product.quantity || 1))
    }, 0);

    return (
        <div className="shopping-cart">
            <h2>Kundvagn</h2>

            {itemsToShow.length === 0 ? (
                <p>Kundvagnen är tom</p>
            ) : (
                    <>
                    <ul>
                        {itemsToShow.map((product) => (
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