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
        <div className='flex flex-col justify-center'>
            <h1 className="text-2xl text-slate-800 mt-4 font-bold">
                {data.name}
            </h1>
            <img
                className="w-full max-w-md mx-auto block mt-4"
                src={
                    data.imageUrl && data.imageUrl.trim() !== ""
                        ? data.imageUrl
                        : "/placeholder640x640.png"
                }
                alt={data.name}>
            </img>

            <p className="mt-4 text-2xl font-bold text-slate-800">
                {data.price} kr
            </p>

            <p className="mt-3 max-w-md mx-auto text-center text-slate-600 leading-relaxed">
                {data.description}
            </p>

            <button
                onClick={handleAddToCart}
                className="bg-blue-500 text-white px-4 py-2 rounded"
            >
                Lägg till i kundvagn
            </button>

            {added && (
                <span className="text-green-500 text-sm">
                    Tillagd i kundvagnen
                </span>
            )}
        </div>

    )
}
