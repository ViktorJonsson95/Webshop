import { useMutation, useQueryClient } from "@tanstack/react-query"

const createProduct = async (product) => {
    const res = await fetch("http://localhost:3000/api/products", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(product),
    })

    const data = await res.json();

    if (!res.ok) {
        throw new Error(data?.error || "Failed to create product")
    }

    return data;
}

export const useCreateProduct = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: createProduct,

        onMutate: async (newProduct) => {
            await queryClient.cancelQueries(["products"])

            const previousProducts = queryClient.getQueryData(["products"])

            const optimisticProduct = {
                ...newProduct,
                id: "temp-" + Date.now(),
            }

            queryClient.setQueryData(["products"], (old) => [
                ...old,
                optimisticProduct,
            ])

            return { previousProducts }
        },

        onError: (err, newProduct, context) => {
            queryClient.setQueryData(["products"], context.previousProducts)
        },

        onSettled: () => {
            queryClient.invalidateQueries(["products"])
        },
    })
}