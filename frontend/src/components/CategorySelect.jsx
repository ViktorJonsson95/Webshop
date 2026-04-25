import { useProducts } from "../hooks/useProducts"

export default function CategorySelect({ value, onChange }) {
    const { data: products, isLoading, error } = useProducts()

    if (isLoading) return <p>Laddar...</p>
    if (error) return <p>Fel...</p>

    // plocka ut unika kategorier
    const categories = [
        ...new Set(
            products
                .map((p) => p.category)
                .filter(Boolean) // tar bort undefined/null
        ),
    ]

    return (
        <select
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="border p-2 rounded"
        >
            <option value="">Välj kategori</option>

            {categories.map((cat) => (
                <option key={cat} value={cat}>
                    {cat}
                </option>
            ))}
        </select>
    )
}