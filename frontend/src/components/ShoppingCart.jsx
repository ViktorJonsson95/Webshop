import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaPlus, FaMinus, FaTrashAlt } from 'react-icons/fa';

export default function ShoppingCart() {
    const [cartItems, setCartItems] = useState([]);

    // Hämta sparade produkter från localStorage vid första laddning
    useEffect(() => {
        const cart = localStorage.getItem("cart");
        if (cart) {
            setCartItems(JSON.parse(cart));
        }
    }, []); 

    // Öka antalet produkter
    const increaseQuantity = (id) => {
        const updatedCart = cartItems.map(product =>
            product.id === id ? { ...product, quantity: (product.quantity || 1) + 1 } : product
        );
        setCartItems(updatedCart);
        localStorage.setItem("cart", JSON.stringify(updatedCart));
    };

    // Minska antalet produkter
    const decreaseQuantity = (id) => {
        const updatedCart = cartItems.map(product =>
            product.id === id ? { ...product, quantity: (product.quantity || 1) - 1 } : product
        );
        setCartItems(updatedCart);
        localStorage.setItem("cart", JSON.stringify(updatedCart));
    };

    // Ta bort produkten från kundvagnen
    const removeFromCart = (id) => {
        const updatedCart = cartItems.filter(product => product.id !== id); 
        setCartItems(updatedCart);   // Uppdatera state 
        localStorage.setItem("cart", JSON.stringify(updatedCart));  // Spara den nya listan 
    };


    // --- TOTALSUMMA OCH CHECKOUT

    // Beräkna totalsumma (med fallback till 1 för quantity)
    const total = cartItems.reduce((acc, product) => {  
        return acc + (product.price * (product.quantity || 1));
    }, 0);

    // Beräkna totalt antal artiklar
    const totalQuantity = cartItems.reduce((acc, product) => {
        return acc + (product.quantity || 1);
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
                                {`${product.name} - ${product.price} kr (${product.quantity || 1} st)`}

                                <button onClick={() => increaseQuantity(product.id)} style={{ cursor: 'pointer', padding: '10px' }}>
                                    <FaPlus />
                                </button>

                                <button onClick={() => decreaseQuantity(product.id)} style={{ cursor: 'pointer', padding: '10px' }}>
                                    <FaMinus />
                                </button>

                                <button onClick={() => removeFromCart(product.id)} style={{ cursor: 'pointer', padding: '10px' }}>
                                    <FaTrashAlt />
                                </button>
                            </li>
                        ))}
                    </ul>

                    <div className="cart-total">
                        <hr />
                        <p>{`Totalpris: ${total} kr`}</p>
                        <p>{`Totalt antal artiklar: ${totalQuantity} st`}</p>
                        <Link to="/checkout">
                            <button style={{ cursor: 'pointer', padding: '10px', width: '100%' }}>   
                            Gå till kassan
                            </button>
                        </Link>
                    </div>
                </>
            )}
        </div>
    );
}