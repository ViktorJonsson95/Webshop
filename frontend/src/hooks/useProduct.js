import { useQuery } from '@tanstack/react-query'

// Funktion som hämtar en specifik produkt baserat på id
const getProductById = async (id) => {
    const res = await fetch(`http://localhost:3000/api/products/${id}`) // GET request med id

    const data = await res.json(); // Parsar svaret från servern

    // Om requesten misslyckas → kasta error med backend-meddelande
    if (!res.ok) throw new Error(data?.error || 'Failed to fetch')

    return data // Returnerar produkten
}

// Custom hook för att hämta en produkt
export const useProduct = (id) =>
    useQuery({
        // Query key inkluderar id → unik cache per produkt
        queryKey: ['product', id],

        // Funktion som hämtar produkten
        queryFn: () => getProductById(id),

        // Kör bara queryn om id finns (förhindrar onödiga requests)
        enabled: !!id,
    })