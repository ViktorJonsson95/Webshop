import { useMutation, useQueryClient } from "@tanstack/react-query"

// Funktion som skickar en DELETE-request för att ta bort en produkt
const deleteProduct = async (id) => {
    const res = await fetch(`http://localhost:3000/api/products/${id}`, {
        method: "DELETE",
    })

    const data = await res.json(); // Parsar svaret från servern

    // Om requesten misslyckas → kasta error med backend-meddelande
    if (!res.ok) {
        throw new Error(data?.error || "Failed to delete product")
    }

    return data // Returnerar svar från servern
}

// Custom hook för att ta bort produkt med React Query
export const useDeleteProduct = () => {
    const queryClient = useQueryClient() // Ger tillgång till cache

    return useMutation({
        mutationFn: deleteProduct, // Funktion som körs när mutate anropas

        // Körs innan mutation → används för optimistic update
        onMutate: async (id) => {
            // Stoppa eventuella pågående fetches för produkter
            await queryClient.cancelQueries(["products"])

            // Spara nuvarande produkter (för rollback vid fel)
            const previousProducts = queryClient.getQueryData(["products"])

            // Uppdatera cachen direkt genom att ta bort produkten
            queryClient.setQueryData(["products"], (old) =>
                old.filter((p) => p.id !== id)
            )

            // Returnera context så vi kan använda det i onError
            return { previousProducts }
        },

        // Om något går fel → återställ tidigare state
        onError: (err, id, context) => {
            queryClient.setQueryData(["products"], context.previousProducts)
        },

        // Körs alltid efter mutation (success eller error)
        onSettled: () => {
            // Refetcha produkter från servern för att få korrekt data
            queryClient.invalidateQueries(["products"])
        },
    })
}