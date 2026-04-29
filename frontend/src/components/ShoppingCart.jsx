import { useState, useEffect } from 'react';

export default function ShoppingCart() {
    const [cartItems, setCartItems] = useState([]);

    useEffect(() => {
        const rawCart = localStorage.getItem("cart");
        
        if (rawCart) {
            setCartItems(JSON.parse(rawCart));
        }
    }, []); // Hämtar bara från localStorage EN gång när sidan laddas

    // Räknar ut totala priset
    // Körs varje gång efter cartItems ändras
    const total = cartItems.reduce((acc, product) => {
        return acc + (product.price * (product.quantity || 1));
    }, 0);

    //Räknar ut det totala antalet artiklar i kundvagnen  
    //Summerar antalet av varje produkt
    const totalQuantity = cartItems.reduce((acc, product) => {
        return acc + (product.quantity || 1);
    }, 0);

    const removeFromCart = (id) => {
        // Skapa en ny lista utan produkten med just det ID:t
        const updatedCart = cartItems.filter(product => product.id !== id);

        // 2. Uppdatera state så att UI uppdateras direkt
        setCartItems(updatedCart);

        // 3. Spara den nya listan i webbläsarens minne
        localStorage.setItem("cart", JSON.stringif(updatedCart));
    };


    return (
        <div className="shopping-cart">
            <h2>Kundvagn</h2>

            {cartItems.length === 0 ? (
                <p>Kundvagnen är tom</p>
            ) : (
                    <>
                    <ul>
                        {cartItems.map((product) => (
                            <li key={product.id}>
                                {product.name} - {product.price} kr
                                <button
                                    onClick={() => removeFromCart(product.id)}
                                    style={{ cursor: 'pointer' }}
                                >
                                Ta bort
                                </button>
                            </li>
                        ))}
                    </ul>

                    <div className="cart-total">
                        <hr />
                        <p><strong>Totalpris: {total} kr</strong></p>
                        <p>Antal artiklar: {cartItems.length} st</p>
                     </div>
                    </>
            )}
        </div>
    );
}