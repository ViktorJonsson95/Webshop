import { useQuery } from '@tanstack/react-query'

const getProductById = async (id) => {
    const res = await fetch(`http://localhost:3000/api/products/${id}`)

    const data = await res.json();
    if (!res.ok) throw new Error(data?.error || 'Failed to fetch')
    return res.json()
}

export const useProduct = (id) =>
    useQuery({
        queryKey: ['product', id],
        queryFn: () => getProductById(id),
        enabled: !!id,
    })