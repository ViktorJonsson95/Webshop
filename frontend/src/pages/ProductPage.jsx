import { useProduct } from '../hooks/useProduct';
import { useParams } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react'

// Hämta produktens id och data
export default function ProductPage() {
    const { id } = useParams();
    const { data, isLoading, error } = useProduct(id);
    const [added, setAdded] = useState(false);
    const queryClient = useQueryClient();

    if (isLoading) return <p>Laddar produkt, var god vänta</p>
    //Om det blev fel ELLER om data är tom, visa felmeddelande
    if (error) {
        return <p>{error?.message || "Något gick fel"}</p>
    }

    if (!data) {
        return <p>Produkten hittades inte</p>
    }

    // Uppdatera antal om produkten redan finns i kundvagnen
    // Annars - lägg till produkten
    const handleAddToCart = () => {
        const raw = localStorage.getItem("cart")
        const cart = raw ? JSON.parse(raw) : []

        // Kolla om produkten redan finns i kundvagnen
        const existing = cart.find(item => item.id === data.id)

        let updatedCart
        
        // Uppdatera antal om produkten redan finns i kundvagnen
        if (existing) {
            updatedCart = cart.map(item =>
                item.id === data.id
                    ? { ...item, quantity: (item.quantity ?? 1) + 1 }
                    : item
            )
        } else {
            updatedCart = [...cart, { ...data, quantity: 1 }]
        }

        // Uppdatera cachen med den nya listan
        localStorage.setItem("cart", JSON.stringify(updatedCart))
        queryClient.setQueryData(["cart"], updatedCart)


        setAdded(true)
        setTimeout(() => setAdded(false), 1500)
    }

    // Produktinformation: namn, bild, pris och beskrivning
    return (
        <div className="max-w-3xl mx-auto px-4 py-6">

            {/* Produktnamn */}
            <h1 className="text-xl sm:text-2xl font-bold text-slate-800 text-center">
                {data.name}
            </h1>

            {/* Bild */}
            <img
                className="w-full max-w-sm sm:max-w-md mx-auto mt-4 object-contain"
                src={
                    data.imageUrl && data.imageUrl.trim() !== ""
                        ? data.imageUrl
                        : "/placeholder640x640.png"
                }
                alt={data.name}
            />

            {/* Pris */}
            <p className="mt-6 text-2xl sm:text-3xl font-bold text-slate-800 text-center">
                {data.price} kr
            </p>

            {/* Beskrivning */}
            <p className="mt-4 text-sm sm:text-base text-slate-600 leading-relaxed text-center max-w-md mx-auto">
                {data.description}
            </p>

            {/* CTA */}
            <div className="mt-6 flex justify-center">
                <button
                    onClick={handleAddToCart}
                    className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white px-6 py-3 font-semibold rounded transition"
                >
                    Lägg till i kundvagn
                </button>
            </div>

            {/* Visa ett meddelande när en produkt läggs till i kundvagnen */}
            {/* Feedback */}
            {added && (
                <span className="block mt-3 text-sm font-semibold text-green-700 text-center">
                    Tillagd i kundvagnen
                </span>
            )}
        </div>
    )
}
