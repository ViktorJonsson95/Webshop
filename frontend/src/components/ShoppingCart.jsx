import useCart from '../hooks/useCart';
import { useQueryClient } from '@tanstack/react-query'
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaPlus, FaMinus, FaTrashAlt } from 'react-icons/fa';

export default function ShoppingCart({ showCheckoutButton = true }) {
    const { data: cartItems = [] } = useCart()
    const queryClient = useQueryClient()


    // Hantera antalet produkter i varukorgen samt
    // uppdatera cachen med den nya ändringen
    const increaseQuantity = (id) => {
        const updatedCart = cartItems.map(product =>
            product.id === id ? { ...product, quantity: (product.quantity ?? 1) + 1 }
                : product
        );
        localStorage.setItem("cart", JSON.stringify(updatedCart))
        queryClient.setQueryData(["cart"], updatedCart)
    };


    const decreaseQuantity = (id) => {
        const updatedCart = cartItems.map(product => {
            if (product.id !== id) return product

            const current = product.quantity ?? 1
            const newQuantity = Math.max(1, current - 1)

            return { ...product, quantity: newQuantity }
        })
        localStorage.setItem("cart", JSON.stringify(updatedCart))
        queryClient.setQueryData(["cart"], updatedCart)
    }

    const removeFromCart = (id) => {
        const updatedCart = cartItems.filter(product => product.id !== id)
        localStorage.setItem("cart", JSON.stringify(updatedCart))
        queryClient.setQueryData(["cart"], updatedCart)
    }

    // Totalpris och checkout

    // Beräkna totalsumma (med fallback till 1 för quantity)
    const total = cartItems.reduce((acc, product) => {
        return acc + (product.price * (product.quantity || 1));
    }, 0);

    // Beräkna totalt antal artiklar
    const totalQuantity = cartItems.reduce((acc, product) => {
        return acc + (product.quantity || 1);
    }, 0);

    // Visa produkter, totalpris och checkout-knapp
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
                        {showCheckoutButton && (<Link to="/checkout">
                            <button style={{ cursor: 'pointer', padding: '10px', width: '100%' }}>
                                Gå till kassan
                            </button>
                        </Link>)}
                    </div>
                </>
            )}
        </div>
    );
}