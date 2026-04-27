import { useQuery } from '@tanstack/react-query'

const getProducts = async () => {
    const res = await fetch('http://localhost:3000/api/products')

    const data = await res.json();

    if (!res.ok) {
        throw new Error(data?.error || 'Failed to fetch products')
    }

    return data
}

export const useProducts = () => {
    return useQuery({
        queryKey: ['products'],
        queryFn: getProducts,
    })
}