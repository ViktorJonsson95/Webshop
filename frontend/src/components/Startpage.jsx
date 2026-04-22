import { useProducts } from "../hooks/useProducts"

const addToCart = (product) => {
  const existingCart = JSON.parse(localStorage.getItem("cart")) || []
  const updatedCart = [...existingCart, product]
  localStorage.setItem("cart", JSON.stringify(updatedCart))
}

export default function Startpage() {
  const { data, isLoading, error } = useProducts()

  if (isLoading) {
    return <h2>Laddar produkter...</h2>
  }

  if (error) {
    return <h2>Något gick fel: {error.message}</h2>
  }

  return (
    <div>
      <h1 className="border border-red-500">Webbshop</h1>
      {data.map((product) => (
        <div key={product.id}>
          <h3>{product.name}</h3>
          <p>{product.price} kr</p>
          <img src={product.imageUrl} alt={product.name} />

          <button onClick={() => addToCart(product)}>
            Lägg till i kundvagn
          </button>
        </div>
      ))}
    </div>
  )
}
