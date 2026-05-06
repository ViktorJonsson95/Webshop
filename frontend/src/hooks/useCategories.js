import { useProducts } from "./useProducts"

// Custom hook för att hämta unika kategorier från produkter
export const useCategories = () => {
    // Hämtar alla produkter via befintlig hook
    const { data, isLoading, error } = useProducts()

    // Säkerställer att vi alltid jobbar med en array
    const products = data || []
    // Plockar ut alla kategorier från produkterna
    const categoryList = products.map(p => p.category)
    // Tar bort tomma värden (null, undefined, "")
    const cleanedCategories = categoryList.filter(Boolean)
    // Tar bort dubletter genom att använda Set och konvertera tillbaka till array
    const categories = Array.from(new Set(cleanedCategories))

    // Kompakt men svårtläst, new Set tar bort dubbletter
    //const categories = [...new Set((data || []).map((p) => p.category).filter(Boolean))]

    // Returnerar kategorier samt loading/error state
    return { categories, isLoading, error }
}
