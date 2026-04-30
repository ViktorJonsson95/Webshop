import { useMutation, useQueryClient } from '@tanstack/react-query'

export const useUpdateProduct = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async ({ id, data }) => {
            const res = await fetch(`http://localhost:3000/api/products/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            })

            const result = await res.json()

            if (!res.ok) {
                throw new Error(result?.error || "Failed to update")
            }

            return result
        },

        onSettled: () => {
            queryClient.invalidateQueries(["products"])
        },
    })
}