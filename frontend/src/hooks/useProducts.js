import { useQuery } from '@tanstack/react-query'

// Funktion som hämtar alla produkter från backend
const getProducts = async () => {
    const res = await fetch('http://localhost:3000/api/products') // GET request

    const data = await res.json(); // Parsar svaret från servern

    // Om requesten misslyckas → kasta error med backend-meddelande
    if (!res.ok) {
        throw new Error(data?.error || 'Failed to fetch products')
    }

    return data // Returnerar listan av produkter
}

// Custom hook för att hämta produkter med React Query
export const useProducts = () => {
    return useQuery({
        queryKey: ['products'], // Unik nyckel för cache (delas över appen)
        queryFn: getProducts,   // Funktion som hämtar datan
    })
}