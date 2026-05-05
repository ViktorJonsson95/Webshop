import { useProduct } from '../hooks/useProduct';
import { useParams } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react'

export default function ProductPage() {
    const { id } = useParams();
    const { data, isLoading, error } = useProduct(id);
    const [added, setAdded] = useState(false);
    const queryClient = useQueryClient();

    if (isLoading) return <p>Loading, please wait...</p>
    //Om det blev fel ELLER om data är tom, visa felmeddelande
    if (error) {
        return <p>{error?.message || "Något gick fel"}</p>
    }

    if (!data) {
        return <p>Produkten hittades inte</p>
    }

    const handleAddToCart = () => {
        const raw = localStorage.getItem("cart")
        const cart = raw ? JSON.parse(raw) : []

        // kolla om produkten redan finns
        const existing = cart.find(item => item.id === data.id)

        let updatedCart

        if (existing) {
            updatedCart = cart.map(item =>
                item.id === data.id
                    ? { ...item, quantity: (item.quantity ?? 1) + 1 }
                    : item
            )
        } else {
            updatedCart = [...cart, { ...data, quantity: 1 }]
        }

        localStorage.setItem("cart", JSON.stringify(updatedCart))
        queryClient.setQueryData(["cart"], updatedCart)

        // visa feedback
        setAdded(true)
        setTimeout(() => setAdded(false), 1500)
    }

    return (
        <div className='max-w-3xl mx-auto px-4 py-8 text-center'>
            <h1 className="text-2xl text-slate-800 mt-4 font-bold">
                {data.name}
            </h1>
            <img
                className="w-full max-w-md mx-auto block"
                src={
                    data.imageUrl && data.imageUrl.trim() !== ""
                        ? data.imageUrl
                        : "/placeholder640x640.png"
                }
                alt={data.name}>
            </img>

            <p className="mt-8 text-3xl font-bold text-slate-800">
                {data.price} kr
            </p>

            <p className="mt-3 max-w-md mx-auto text-center text-slate-600 leading-loose">
                {data.description}
            </p>

            <button
                onClick={handleAddToCart}
                className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 font-semibold mt-6 rounded transition inline-block"
            >
                Lägg till i kundvagn
            </button>

            {/* Villkorlig rendering: visar ett meddelande när en produkt läggs till i kundkorgen */}
            {added && (
                <span className="block mt-3 text-base font-semibold text-green-700">
                    Tillagd i kundvagnen
                </span>
            )}
        </div>

    )
}
