import { useQuery } from "@tanstack/react-query"

const getOrders = async () => {
    const res = await fetch("http://localhost:3000/api/orders")

    const data = await res.json();

    if (!res.ok) {
        throw new Error(data?.error || "Failed to fetch orders")
    }

    return data
}

export const useOrders = () => {
    return useQuery({
        queryKey: ["orders"],
        queryFn: getOrders,
    })
}