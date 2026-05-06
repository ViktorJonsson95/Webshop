import { useMutation, useQueryClient } from "@tanstack/react-query"

// Funktion som skickar en DELETE-request för att ta bort en order
const deleteOrder = async (id) => {
    const res = await fetch(`http://localhost:3000/api/orders/${id}`, {
        method: "DELETE",
    })

    const data = await res.json(); // Parsar svaret från servern

    // Om requesten misslyckas → kasta error med backend-meddelande
    if (!res.ok) {
        throw new Error(data?.error || "Failed to delete order")
    }

    return data // Returnerar svar från servern
}

// Custom hook för att ta bort order med React Query
export const useDeleteOrder = () => {
    const queryClient = useQueryClient() // Ger tillgång till cache

    return useMutation({
        mutationFn: deleteOrder, // Funktion som körs när mutate anropas

        // Körs innan mutation → används för optimistic update
        onMutate: async (id) => {
            // Stoppa eventuella pågående fetches för orders
            await queryClient.cancelQueries(["orders"])

            // Spara nuvarande orders (för rollback vid fel)
            const previousOrders = queryClient.getQueryData(["orders"])

            // Uppdatera cachen direkt genom att ta bort ordern
            queryClient.setQueryData(["orders"], (old = []) =>
                old.filter((o) => o.id !== id)
            )

            // Returnera context så vi kan använda det i onError
            return { previousOrders }
        },

        // Om något går fel → återställ tidigare state
        onError: (err, id, context) => {
            if (context?.previousOrders) {
                queryClient.setQueryData(["orders"], context.previousOrders)
            }
        },

        // Körs alltid efter mutation (success eller error)
        onSettled: () => {
            // Refetcha orders från servern för att få korrekt data
            queryClient.invalidateQueries(["orders"])
        },
    })
}