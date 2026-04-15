import { useQuery } from '@tanstack/react-query'
import { getProductById } from '../api/products'

export const useProduct = (id) =>
    useQuery({
        queryKey: ['product', id],
        queryFn: () => getProductById(id),
        enabled: !!id,
    })