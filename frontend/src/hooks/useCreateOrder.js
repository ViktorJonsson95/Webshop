import { useMutation } from '@tanstack/react-query'
import { createOrder } from '../api/createOrder'

export const useCreateOrder = () => {
    return useMutation({
        mutationFn: createOrder,
    })
}
// This mutation is intentionally minimal.
// Optimistic updates (onMutate/onError/onSettled)
// can be added later when orders are displayed via useQuery(['orders'])