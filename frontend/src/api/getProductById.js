export const getProductById = async (id) => {
    const res = await fetch(`/api/products/${id}`)
    if (!res.ok) throw new Error('Failed to fetch')
    return res.json()
}