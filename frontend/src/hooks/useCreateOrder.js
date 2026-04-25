import { useMutation, useQueryClient } from '@tanstack/react-query'

const createOrder = async (order) => {
    const res = await fetch("http://localhost:3000/api/orders", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(order),
    })

    const data = await res.json();

    if (!res.ok) {
        throw new Error(data?.error || 'Failed to create order')
    }

    return data
}

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