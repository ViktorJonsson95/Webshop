import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createOrder } from '../api/createOrder'

export const useCreateOrder = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: createOrder,

        onMutate: async (newOrder) => {
            await queryClient.cancelQueries(['orders'])

            const previousOrders = queryClient.getQueryData(['orders'])

            const optimisticOrder = {
                ...newOrder,
                id: 'temp-' + Date.now(),
            }

            queryClient.setQueryData(['orders'], (old = []) => [
                ...old,
                optimisticOrder,
            ])

            return { previousOrders }
        },

        onError: (err, newOrder, context) => {
            if (context?.previousOrders) {
                queryClient.setQueryData(['orders'], context.previousOrders)
            }
        },

        onSettled: () => {
            queryClient.invalidateQueries(['orders'])
        },
    })
}