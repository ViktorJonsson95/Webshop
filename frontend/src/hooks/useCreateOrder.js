import { useMutation } from '@tanstack/react-query'
import { createOrder } from '../api/orders'

export const useCreateOrder = () => {
    return useMutation({
        mutationFn: createOrder,
    })
}