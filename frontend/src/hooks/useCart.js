import { useQuery } from "@tanstack/react-query"

export default function useCart() {
    return useQuery({
        queryKey: ["cart"],
        queryFn: () => {
            const raw = localStorage.getItem("cart")
            return raw ? JSON.parse(raw) : []
        },
        staleTime: Infinity,
    })
}