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

const ProductCard = ({ product }) => {
  return (
    <div>
      <img src={product.imageUrl} alt={product.name} />
      <h3>{product.name}</h3>
      <p>{product.description}</p>
      <p>
        <strong>{product.price} kr</strong>
      </p>
      <p>Lager: {product.stock}</p>
      <button>Lägg i kundvagn</button>
    </div>
  )
}

export default function Shop() {
  return (
    <div>
      <h1>Webbshop</h1>
      <div>
        {products.map((product, index) => (
          <ProductCard key={index} product={product} />
        ))}
      </div>
    </div>
  )
}
