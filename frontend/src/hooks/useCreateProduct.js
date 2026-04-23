import { useMutation, useQueryClient } from "@tanstack/react-query"
import { createProduct } from "../api/createProduct"

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