import { useMutation, useQueryClient } from "@tanstack/react-query"

const deleteOrder = async (id) => {
    const res = await fetch(`http://localhost:3000/api/orders/${id}`, {
        method: "DELETE",
    })

    if (!res.ok) {
        throw new Error("Failed to delete order")
    }
}

export const useDeleteOrder = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: deleteOrder,

        onMutate: async (id) => {
            await queryClient.cancelQueries(["orders"])

            const previousOrders = queryClient.getQueryData(["orders"])

            queryClient.setQueryData(["orders"], (old = []) =>
                old.filter((o) => o.id !== id)
            )

            return { previousOrders }
        },

        onError: (err, id, context) => {
            if (context?.previousOrders) {
                queryClient.setQueryData(["orders"], context.previousOrders)
            }
        },

        onSettled: () => {
            queryClient.invalidateQueries(["orders"])
        },
    })
}