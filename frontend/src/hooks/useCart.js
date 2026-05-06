import { useQuery } from "@tanstack/react-query"

// Custom hook för att hantera kundvagnen via React Query
export default function useCart() {
    return useQuery({
        // Unik nyckel för denna query (måste vara samma överallt i appen)
        queryKey: ["cart"],

        // Funktion som hämtar datan (i detta fall från localStorage)
        queryFn: () => {
            const raw = localStorage.getItem("cart") // Hämta cart som string

            // Om det finns data → parse JSON, annars returnera tom array
            return raw ? JSON.parse(raw) : []
        },

        // Gör att datan aldrig anses "stale"
        // → React Query kommer inte refetcha automatiskt
        // → vi måste själva uppdatera cachen med setQueryData
        staleTime: Infinity,
    })
}