import { useState, useEffect } from 'react'
import { useProducts } from '../hooks/useProducts'
import { useCreateOrder } from '../hooks/useCreateOrder'

const TestShop = () => {
    // 🔹 LOCAL STATE (kundvagn)
    const [cart, setCart] = useState([])

    // 🔹 REACT QUERY - GET (hämtar produkter)
    const { data: products, isLoading, error } = useProducts()

    // 🔹 REACT QUERY - POST (skapar order)
    const { mutate: createOrder, isPending, isSuccess, data } = useCreateOrder()

    // 🔹 Ladda kundvagn från localStorage vid start
    useEffect(() => {
        const savedCart = localStorage.getItem('cart')
        if (savedCart) {
            setCart(JSON.parse(savedCart))
        }
    }, [])

    // 🔹 Spara kundvagn i localStorage när den ändras
    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cart))
    }, [cart])

    // 🔹 Lägg till produkt i kundvagn
    const addToCart = (product) => {
        setCart(prev => [...prev, product])
    }

    // 🔹 Skicka order till backend
    const handleCreateOrder = () => {
        const order = {
            products: cart,
            createdAt: new Date().toISOString(),
        }

        createOrder(order)
    }

    // 🔹 Loading state (React Query)
    if (isLoading) return <p>Laddar produkter...</p>

    // 🔹 Error state (React Query)
    if (error) return <p>Något gick fel</p>

    return (
        <div style={{ padding: '20px' }}>

            {/* 🔹 PRODUKTER */}
            <section>
                <h2>Produkter (GET via useQuery)</h2>

                {products.map(product => (
                    <div key={product.id} style={{ border: '1px solid gray' }}>
                        <p><strong>{product.name}</strong></p>
                        <p>{product.price} kr</p>

                        <button onClick={() => addToCart(product)}>
                            Lägg till i kundvagn
                        </button>
                    </div>
                ))}
            </section>

            <hr />

            {/* 🔹 KUNDVAGN */}
            <section>
                <h2>Kundvagn (localStorage)</h2>

                {cart.length === 0 ? (
                    <p>Tom kundvagn</p>
                ) : (
                    cart.map((item, index) => (
                        <div key={index}>
                            {item.name} - {item.price} kr
                        </div>
                    ))
                )}
            </section>

            <hr />

            {/* 🔹 ORDER DATA */}
            <section>
                <h2>Order som skickas</h2>

                <pre>
                    {JSON.stringify({
                        products: cart,
                        createdAt: '...',
                    }, null, 2)}
                </pre>

                <button onClick={handleCreateOrder} disabled={cart.length === 0 || isPending}>
                    Skapa order (POST via useMutation)
                </button>

                {isPending && <p>Skickar order...</p>}
                {isSuccess && <p>Order skapad!</p>}
            </section>

            <hr />

            {/* 🔹 SERVER RESPONSE */}
            <section>
                <h2>Server response</h2>
                <pre>{JSON.stringify(data, null, 2)}</pre>
            </section>
        </div>
    )
}

export default TestShop