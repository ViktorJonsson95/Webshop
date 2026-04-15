import { useState, useEffect } from 'react'
import { useCreateOrder } from '../hooks/useCreateOrder'

const products = [
    { id: 1, name: 'Produkt 1', price: 100 },
    { id: 2, name: 'Produkt 2', price: 200 },
    { id: 3, name: 'Produkt 3', price: 300 },
    { id: 4, name: 'Produkt 4', price: 400 },
]

const TestShop = () => {
    const [cart, setCart] = useState([])
    const { mutate, data, isPending } = useCreateOrder()

    // ladda cart från localStorage
    useEffect(() => {
        const saved = JSON.parse(localStorage.getItem('cart')) || []
        setCart(saved)
    }, [])

    const addToCart = (product) => {
        const updatedCart = [...cart, { id: product.id, quantity: 1 }]
        setCart(updatedCart)
        localStorage.setItem('cart', JSON.stringify(updatedCart))
    }

    const handleOrder = () => {
        const order = { items: cart }

        mutate(order)
    }

    return (
        <div>
            <h2>Produkter</h2>
            {products.map((p) => (
                <div key={p.id}>
                    <span>{p.name} - {p.price} kr </span>
                    <button onClick={() => addToCart(p)}>Lägg till</button>
                </div>
            ))}

            <h2>Kundvagn (localStorage)</h2>
            <pre>{JSON.stringify(cart, null, 2)}</pre>

            <button onClick={handleOrder} disabled={isPending}>
                {isPending ? 'Skickar...' : 'Skapa order'}
            </button>

            {data && (
                <>
                    <h2>Order skickad till backend</h2>
                    <pre>{JSON.stringify(data, null, 2)}</pre>
                </>
            )}
        </div>
    )
}

export default TestShop