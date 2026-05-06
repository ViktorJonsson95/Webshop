import { useMutation, useQueryClient } from '@tanstack/react-query'

// Funktion som skickar en POST-request för att skapa en order
const createOrder = async (order) => {
    const res = await fetch("http://localhost:3000/api/orders", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(order), // Skickar ordern som JSON
    })

    const data = await res.json(); // Parsar svaret från servern

    // Om requesten misslyckas → kasta error med backend-meddelande
    if (!res.ok) {
        throw new Error(data?.error || 'Failed to create order')
    }

    return data // Returnerar skapad order från servern
}

// Custom hook för att skapa order med React Query
export const useCreateOrder = () => {
    const queryClient = useQueryClient() // Ger tillgång till cache

    return useMutation({
        mutationFn: createOrder, // Funktion som körs när mutate anropas

        // Körs innan mutation → används för optimistic update
        onMutate: async (newOrder) => {
            // Stoppa eventuella pågående fetches för orders
            await queryClient.cancelQueries(['orders'])

            // Spara nuvarande orders (för rollback om något går fel)
            const previousOrders = queryClient.getQueryData(['orders'])

            // Skapa en temporär order (för att visa direkt i UI)
            const optimisticOrder = {
                ...newOrder,
                id: 'temp-' + Date.now(), // Fake id
            }

            // Lägg till den optimistiska ordern i cachen
            queryClient.setQueryData(['orders'], (old = []) => [
                ...old,
                optimisticOrder,
            ])

            // Returnera context så vi kan använda det i onError
            return { previousOrders }
        },

        // Om något går fel → återställ tidigare state
        onError: (err, newOrder, context) => {
            if (context?.previousOrders) {
                queryClient.setQueryData(['orders'], context.previousOrders)
            }
        },

        // Körs alltid efter mutation (success eller error)
        onSettled: () => {
            // Refetcha orders från servern för att få korrekt data
            queryClient.invalidateQueries(['orders'])
        },
    })
}