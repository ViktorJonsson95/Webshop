// detta ska bytas ut mot GET produkter från backend senare
const products = [
  {
    name: "Trådlösa Hörlurar Pro",
    price: 1499,
    description: "Brusreducerande over-ear hörlurar med 30 timmars batteritid.",
    category: "Elektronik",
    stock: 25,
    imageUrl: "https://example.com/images/headphones.jpg",
  },
  {
    name: "Smartwatch Active",
    price: 1999,
    description: "Vattentålig smartwatch med pulsmätning och GPS.",
    category: "Elektronik",
    stock: 18,
    imageUrl: "https://example.com/images/smartwatch.jpg",
  },
  {
    name: "Bluetooth Högtalare Mini",
    price: 599,
    description: "Portabel högtalare med kraftfullt ljud och 12h batteritid.",
    category: "Elektronik",
    stock: 40,
    imageUrl: "https://example.com/images/speaker.jpg",
  },
  {
    name: "Gaming Mus RGB",
    price: 799,
    description: "Ergonomisk gamingmus med justerbar DPI och RGB-belysning.",
    category: "Elektronik",
    stock: 30,
    imageUrl: "https://example.com/images/mouse.jpg",
  },
  {
    name: "Laptop Stand Aluminium",
    price: 349,
    description: "Stilrent laptopställ i aluminium för bättre ergonomi.",
    category: "Tillbehör",
    stock: 50,
    imageUrl: "https://example.com/images/laptop-stand.jpg",
  },
]

import { useProducts } from "./hooks/useProducts"

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
      <h1>Webbshop</h1>
      {data.map((product) => (
        <div key={product.id}>
          <h3>{product.name}</h3>
          <p>{product.price} kr</p>

          <button onClick={() => addToCart(product)}>
            Lägg till i kundvagn
          </button>
        </div>
      ))}
    </div>
  )
}
