import { useQuery } from "@tanstack/react-query"

// Funktion som hämtar alla ordrar från backend
const getOrders = async () => {
    const res = await fetch("http://localhost:3000/api/orders") // GET request

    const data = await res.json(); // Parsar svaret från servern

    // Om requesten misslyckas → kasta error med backend-meddelande
    if (!res.ok) {
        throw new Error(data?.error || "Failed to fetch orders")
    }

    return data // Returnerar listan av ordrar
}

// Custom hook för att hämta ordrar med React Query
export const useOrders = () => {
    return useQuery({
        queryKey: ["orders"], // Unik nyckel för cache (måste vara konsekvent i appen)
        queryFn: getOrders,   // Funktion som hämtar datan
    })
}