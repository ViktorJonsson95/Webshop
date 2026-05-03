import { useMutation, useQueryClient } from "@tanstack/react-query"

const deleteOrder = async (id) => {
    const res = await fetch(`http://localhost:3000/api/orders/${id}`, {
        method: "DELETE",
    })

    const data = await res.json();

    if (!res.ok) {
        throw new Error(data?.error || "Failed to delete order")
    }

    return data
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