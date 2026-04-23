import { useMutation, useQueryClient } from "@tanstack/react-query"
import { deleteOrder } from "../api/deleteOrder"

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