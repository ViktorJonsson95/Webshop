export const getOrders = async () => {
    const res = await fetch("http://localhost:3000/api/orders")

    if (!res.ok) {
        throw new Error("Failed to fetch orders")
    }

    return res.json()
}