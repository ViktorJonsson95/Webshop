import { useProducts } from "./useProducts"

export const useCategories = () => {
    const { data, isLoading, error } = useProducts()

    const categories = [
        ...new Set(
            (data || [])
                .map((p) => p.category)
                .filter(Boolean)
        ),
    ]

    return { categories, isLoading, error }
}