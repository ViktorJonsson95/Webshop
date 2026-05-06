import { useProducts } from "../hooks/useProducts"

// Komponent för att visa och välja kategori i en dropdown
// Tar emot value (vald kategori) och onChange (callback vid ändring)
export default function CategorySelect({ value, onChange }) {

    // Hämtar alla produkter via hook
    // data döps om till products
    const { data: products, isLoading, error } = useProducts()

    // Visar loading state medan produkter hämtas
    if (isLoading) return <p>Laddar...</p>

    // Visar enkelt felmeddelande om något går fel
    if (error) return <p>Fel...</p>

    // Plockar ut unika kategorier från produkterna
    const categoryList = products.map(p => p.category) // plocka ut alla kategorier
    const cleanedCategories = categoryList.filter(Boolean) // ta bort tomma värden
    const uniqueCategories = Array.from(new Set(cleanedCategories)) // ta bort dubletter
    const categories = uniqueCategories
    //Samma sak i en rad (mer kompakt men svårare att läsa):
    //const categories = [...new Set(products.map((p) => p.category).filter(Boolean)),]

    return (
        <select
            value={value} // kontrollerad komponent (värdet styrs av parent)
            onChange={(e) => onChange(e.target.value)} // skickar upp nytt värde till parent
            className="border p-2 rounded"
        >
            {/* Default-val */}
            <option value="">Välj kategori</option>

            {/* Renderar alla unika kategorier som options */}
            {categories.map((cat) => (
                <option key={cat} value={cat}>
                    {cat}
                </option>
            ))}
        </select>
    )
}