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
        <div className="w-full">
            <h2 className="text-lg font-bold mb-4 text-center">
                Din varukorg
            </h2>

            {cartItems.length === 0 ? (
                <p className="text-center">Kundvagnen är tom</p>
            ) : (
                <>
                    <ul className="flex flex-col gap-4">
                        {cartItems.map((product) => (
                            <li
                                key={product.id}
                                className="flex gap-3 border-b border-slate-300 pb-3"
                            >
                                {/* Bild */}
                                <div className="w-16 h-16 bg-white rounded-md flex items-center justify-center overflow-hidden shrink-0">
                                    <img
                                        src={
                                            product.imageUrl && product.imageUrl.trim() !== ""
                                                ? product.imageUrl
                                                : "/placeholder640x640.png"
                                        }
                                        alt={product.name}
                                        className="w-full h-full object-contain"
                                    />
                                </div>

                                {/* Info + controls */}
                                <div className="flex flex-col flex-1">
                                    {/* Namn + pris */}
                                    <div>
                                        <p className="text-sm font-semibold line-clamp-1">
                                            {product.name}
                                        </p>
                                        <p className="text-sm text-slate-600">
                                            {product.price} kr ({product.quantity || 1} st)
                                        </p>
                                    </div>

                                    {/* Knappar */}
                                    <div className="flex items-center gap-2 mt-2">
                                        <button
                                            onClick={() => increaseQuantity(product.id)}
                                            className="p-2 bg-white rounded shadow"
                                        >
                                            <FaPlus size={12} />
                                        </button>

                                        <button
                                            onClick={() => decreaseQuantity(product.id)}
                                            className="p-2 bg-white rounded shadow"
                                        >
                                            <FaMinus size={12} />
                                        </button>

                                        <button
                                            onClick={() => removeFromCart(product.id)}
                                            className="p-2 bg-red-500 text-white rounded shadow ml-auto"
                                        >
                                            <FaTrashAlt size={12} />
                                        </button>
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>

                    {/* Total + CTA */}
                    <div className="mt-4 pt-4 border-t border-slate-300 text-sm">
                        <p className="font-semibold">
                            Totalpris: {total} kr
                        </p>
                        <p className="text-slate-600">
                            Totalt antal artiklar: {totalQuantity} st
                        </p>

                        {showCheckoutButton && (
                            <Link to="/checkout">
                                <button className="w-full mt-4 bg-green-600 text-white py-2 rounded font-semibold hover:bg-green-700 transition">
                                    Gå till kassan
                                </button>
                            </Link>
                        )}
                    </div>
                </>
            )}
        </div>
    );
}