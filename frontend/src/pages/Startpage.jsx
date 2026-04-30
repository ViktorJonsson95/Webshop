import { useState } from "react"
import { useProducts } from "../hooks/useProducts"
import { Link, useSearchParams } from "react-router-dom"
import { useCategories } from "../hooks/useCategories"

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
  const [searchParams, setSearchParams] = useSearchParams()
  const { categories } = useCategories()
  const [sort, setSort] = useState("")

  const activeCategory = searchParams.get("category") || ""
  const activeTag = searchParams.get("tag") || ""

  const setCategory = (category) => {
    const params = new URLSearchParams(searchParams)

    if (category) {
      params.set("category", category)
    } else {
      params.delete("category")
    }

    setSearchParams(params)
  }

  const setParam = (key, value) => {
    const params = new URLSearchParams(searchParams)
    if (value) params.set(key, value)
    else params.delete(key)
    setSearchParams(params)
  }

  const filteredProducts = (data || []).filter((p) => {
    const matchCategory = activeCategory
      ? p.category === activeCategory
      : true

    const matchTag = activeTag
      ? p.tags?.includes(activeTag)
      : true

    return matchCategory && matchTag
  })

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sort) {
      case "price-asc":
        return a.price - b.price
      case "price-desc":
        return b.price - a.price
      case "name-asc":
        return a.name.localeCompare(b.name)
      case "name-desc":
        return b.name.localeCompare(a.name)
      default:
        return 0
    }
  })


  if (isLoading) {
    return <h2>Laddar produkter...</h2>
  }

  if (error) {
    return <h2>Något gick fel: {error.message}</h2>
  }

  return (
    <div className="p-4">

      <div className="flex gap-4 overflow-x-auto no-scrollbar">
        <button
          className={`p-2 ${!activeCategory
            ? "bg-blue-200 font-bold"
            : ""
            }`}
          onClick={() => {
            const params = new URLSearchParams(searchParams)
            params.delete("category")
            setSearchParams(params)
          }}
        >
          Visa alla produkter
        </button>
        {categories.map((cat) => (
          <button className={`p-2 ${activeCategory === cat
            ? "bg-blue-200 font-bold"
            : "bg-transparent"
            }`} key={cat} onClick={() => setCategory(cat)}>
            {cat}
          </button>
        ))}
      </div>
      <div
        className="mb-4 cursor-pointer"
        onClick={() => setParam("tag", "vår")}
      >
        <div className="bg-green-100 p-6 text-center rounded">
          <h2 className="text-xl font-bold">Spring Collection</h2>
          <p>Klicka för att se vårskor</p>
        </div>
      </div>
      {/* Titel */}
      <h1 className="text-2xl font-bold mb-4">
        {activeCategory || "Alla produkter"}
      </h1>
      <select onChange={(e) => setSort(e.target.value)}>
        <option value="">Sortera</option>
        <option value="price-asc">Pris låg → hög</option>
        <option value="price-desc">Pris hög → låg</option>
        <option value="name-asc">Namn A → Ö</option>
        <option value="name-desc">Namn Ö → A</option>
      </select>
      {activeTag && (
        <div className="mb-4 flex items-center gap-2">
          <span className="bg-green-200 px-2 py-1 rounded">
            {activeTag}
          </span>

          <button
            className="text-red-500"
            onClick={() => setParam("tag", "")}
          >
            ✕
          </button>
        </div>
      )}
      {/* Produkter */}
      <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-4">
        {sortedProducts.map((product) => (
          <div key={product.id} className="border p-2">
            <Link to={`/product/${product.id}`}>
              <h3>{product.name}</h3>
              <p>{product.price} kr</p>
              <img
                src={
                  product.imageUrl && product.imageUrl.trim() !== ""
                    ? product.imageUrl
                    : "/placeholder640x640.png"
                }
                alt={product.name}
              />
            </Link>

            <button
              className="border mt-2 p-1"
              onClick={() => addToCart(product)}
            >
              Lägg till i kundvagn
            </button>
          </div>
        ))}
      </div>

      {/* Inga resultat */}
      {filteredProducts.length === 0 && (
        <p className="mt-4">Inga produkter matchar</p>
      )}
    </div>
  )
}