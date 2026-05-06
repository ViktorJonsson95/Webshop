import { useMutation, useQueryClient } from '@tanstack/react-query'

// Custom hook för att uppdatera en produkt
export const useUpdateProduct = () => {
    const queryClient = useQueryClient() // Ger tillgång till React Query cache

    return useMutation({
        // Funktion som körs när mutate anropas
        mutationFn: async ({ id, data }) => {
            // Skickar PUT-request för att uppdatera produkten
            const res = await fetch(`http://localhost:3000/api/products/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data), // Skickar uppdaterad produktdata
            })

            const result = await res.json() // Parsar svaret från servern

            // Om requesten misslyckas → kasta error med backend-meddelande
            if (!res.ok) {
                throw new Error(result?.error || "Failed to update")
            }

            return result // Returnerar uppdaterad produkt
        },

        // Körs alltid efter mutation (success eller error)
        onSettled: () => {
            // Refetcha produkter så UI får senaste datan
            queryClient.invalidateQueries(["products"])
        },
    })
}