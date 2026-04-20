import { useQuery } from '@tanstack/react-query'
import { getProductById } from '../api/getProductById'

export const useProduct = (id) =>
    useQuery({
        queryKey: ['product', id],
        queryFn: () => getProductById(id),
        enabled: !!id,
    })