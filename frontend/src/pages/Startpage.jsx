import { useProducts } from "../hooks/useProducts"
import { Link } from "react-router-dom"

const addToCart = (product) => {
  const existingCart = JSON.parse(localStorage.getItem("cart")) || []

  const existingItem = existingCart.find(item => item.id === product.id)

  let updatedCart 

  if(existingItem) {
    updatedCart = existingCart.map(item => 
      item.id === product.id ? {...item, quantity: item.quantity + 1}
      : item
    )
  } else {
    updatedCart = [...existingCart, {...product, quantity: 1}]
  }
  
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
    <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-4">
      <h1 className="border border-red-500">Webbshop</h1>
      {data.map((product) => (
        <div key={product.id}>
          <Link to={`/product/${product.id}`}>
            <h3>{product.name}</h3>
            <p>{product.price} kr</p>
            <img src={product.imageUrl} alt={product.name} />
          </Link>
          
          <button
            onClick={() => addToCart(product)}
            style={{ cursor: 'pointer' }}
          >
            Lägg till i kundvagn
          </button>
        </div>
      ))}
    </div>
  )
}
