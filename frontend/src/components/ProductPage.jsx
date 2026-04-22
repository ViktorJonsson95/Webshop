import { useQuery } from '@tanstack/react-query';



export default function ProductPage() {
    const { data: product, isLoading, isError } = useQuery({
        queryKey: ['product'],
        queryFn: () => { // Mock-data tills backend/API är klart
            return {
                name: 'Testprodukt',
                price: 199.00,
                description: 'Beskrivning av testprodukt'
            }
        }
    })

    if (isLoading) return <p>Loading, please wait...</p>
    if (isError) return <p>Something went wrong!</p>

    return (
        <div>
            <h1>Product Page</h1>
            <h2>{product.name}</h2>
            <p>{product.price}</p>
            <p>{product.description}</p>
        </div>
    )
}
