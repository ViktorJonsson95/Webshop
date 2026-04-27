import { useMutation, useQueryClient } from "@tanstack/react-query"

const deleteProduct = async (id) => {
    const res = await fetch(`http://localhost:3000/api/products/${id}`, {
        method: "DELETE",
    })

    const data = await res.json();

    if (!res.ok) {
        throw new Error(data?.error || "Failed to delete product")
    }

    return data
}

export const useDeleteProduct = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: deleteProduct,

        onMutate: async (id) => {
            await queryClient.cancelQueries(["products"])

            const previousProducts = queryClient.getQueryData(["products"])

            queryClient.setQueryData(["products"], (old) =>
                old.filter((p) => p.id !== id)
            )

            return { previousProducts }
        },

        onError: (err, id, context) => {
            queryClient.setQueryData(["products"], context.previousProducts)
        },

        onSettled: () => {
            queryClient.invalidateQueries(["products"])
        },
    })
}