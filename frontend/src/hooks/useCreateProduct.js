import { useMutation, useQueryClient } from "@tanstack/react-query"

// Funktion som skickar en POST-request för att skapa en ny produkt
const createProduct = async (product) => {
    const res = await fetch("http://localhost:3000/api/products", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(product), // Skickar produktdata som JSON
    })

    const data = await res.json(); // Parsar svaret från servern

    // Om requesten misslyckas → kasta error med backend-meddelande
    if (!res.ok) {
        throw new Error(data?.error || "Failed to create product")
    }

    return data; // Returnerar skapad produkt
}

// Custom hook för att skapa produkt med React Query
export const useCreateProduct = () => {
    const queryClient = useQueryClient() // Ger tillgång till cache

    return useMutation({
        mutationFn: createProduct, // Funktion som körs när mutate anropas

        // Körs innan mutation → används för optimistic update
        onMutate: async (newProduct) => {
            // Stoppa eventuella pågående fetches för produkter
            await queryClient.cancelQueries(["products"])

            // Spara nuvarande produkter (för rollback vid fel)
            const previousProducts = queryClient.getQueryData(["products"])

            // Skapa en temporär produkt (för att visa direkt i UI)
            const optimisticProduct = {
                ...newProduct,
                id: "temp-" + Date.now(), // Fake id
            }

            // Lägg till den optimistiska produkten i cachen
            queryClient.setQueryData(["products"], (old) => [
                ...old,
                optimisticProduct,
            ])

            // Returnera context så vi kan använda det i onError
            return { previousProducts }
        },

        // Om något går fel → återställ tidigare state
        onError: (err, newProduct, context) => {
            queryClient.setQueryData(["products"], context.previousProducts)
        },

        // Körs alltid efter mutation (success eller error)
        onSettled: () => {
            // Refetcha produkter från servern för att få korrekt data
            queryClient.invalidateQueries(["products"])
        },
    })
}