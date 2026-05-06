import { useState } from "react"
import { useProducts } from "../hooks/useProducts"
import { Link, useSearchParams } from "react-router-dom"
import { useCategories } from "../hooks/useCategories"
import { useQueryClient } from "@tanstack/react-query"

// Startsida som visar produkter, filtrering, sortering och add-to-cart
export default function Startpage() {

  // Hämtar produkter från backend via React Query
  const { data, isLoading, error } = useProducts()

  // Hanterar query params i URL (t.ex ?category=skor&tag=vår)
  const [searchParams, setSearchParams] = useSearchParams()

  // Hämtar unika kategorier via custom hook
  const { categories } = useCategories()

  // State för sorteringsval
  const [sort, setSort] = useState("")

  // State för att visa feedback ("tillagd i kundvagn")
  const [added, setAdded] = useState(false)

  // React Query client (för att manuellt uppdatera cache)
  const queryClient = useQueryClient()

  // Lägg till produkt i kundvagn
  const addToCart = (product) => {

    // Hämtar nuvarande kundvagn från localStorage
    const existingCart = JSON.parse(localStorage.getItem("cart")) || []

    // Kollar om produkten redan finns i kundvagnen
    const existingItem = existingCart.find(item => item.id === product.id)

    let updatedCart

    if (existingItem) {
      // Om produkten redan finns → öka quantity
      updatedCart = existingCart.map(item =>
        item.id === product.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    } else {
      // Annars → lägg till ny produkt med quantity = 1
      updatedCart = [...existingCart, { ...product, quantity: 1 }]
    }

    // Spara uppdaterad kundvagn i localStorage
    localStorage.setItem("cart", JSON.stringify(updatedCart))

    // Uppdatera React Query cache → gör UI reaktivt
    queryClient.setQueryData(["cart"], updatedCart)

    // Visa feedback i UI
    setAdded(true)

    // Ta bort feedback efter 2.5 sek
    setTimeout(() => {
      setAdded(false)
    }, 2500)
  }

  // Hämtar aktiv kategori från URL (eller tom sträng)
  const activeCategory = searchParams.get("category") || ""

  // Hämtar aktiv tag från URL (t.ex "vår")
  const activeTag = searchParams.get("tag") || ""

  // Sätter kategori i URL
  const setCategory = (category) => {
    const params = new URLSearchParams(searchParams)

    if (category) {
      params.set("category", category)
    } else {
      params.delete("category")
    }

    setSearchParams(params)
  }

  // Generisk funktion för att sätta eller ta bort query params
  const setParam = (key, value) => {
    const params = new URLSearchParams(searchParams)

    if (value) params.set(key, value)
    else params.delete(key)

    setSearchParams(params)
  }

  // Filtrerar produkter baserat på kategori och tag
  const filteredProducts = (data || []).filter((p) => {

    // Matcha kategori (eller visa alla om ingen vald)
    const matchCategory = activeCategory
      ? p.category === activeCategory
      : true

    // Matcha tag (om vald)
    const matchTag = activeTag
      ? p.tags?.includes(activeTag)
      : true

    // Endast produkter som matchar båda
    return matchCategory && matchTag
  })

  // Sorterar produkterna baserat på valt alternativ
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sort) {
      case "price-asc":
        return a.price - b.price // låg → hög
      case "price-desc":
        return b.price - a.price // hög → låg
      case "name-asc":
        return a.name.localeCompare(b.name) // A → Ö
      case "name-desc":
        return b.name.localeCompare(a.name) // Ö → A
      default:
        return 0 // ingen sortering
    }
  })

  // Loading state
  if (isLoading) {
    return <h2>Laddar produkter...</h2>
  }

  // Error state
  if (error) {
    return <h2>Något gick fel: {error.message}</h2>
  }

  return (
    <div>

      {/* Sticky kategori-lista (ligger under navbar) */}
      <div className="sticky top-16 z-40 bg-white flex gap-4 overflow-x-auto no-scrollbar p-2">

        {/* Knapp för att visa alla produkter (tar bort category param) */}
        <button
          className={`p-2 ${!activeCategory ? "bg-blue-200 font-bold" : ""}`}
          onClick={() => {
            const params = new URLSearchParams(searchParams)
            params.delete("category")
            setSearchParams(params)
          }}
        >
          Visa alla produkter
        </button>

        {/* Renderar alla kategorier som klickbara filter */}
        {categories.map((cat) => (
          <button
            className={`p-2 ${activeCategory === cat
                ? "bg-blue-200 font-bold"
                : "bg-transparent"
              }`}
            key={cat}
            onClick={() => setCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Banner → sätter tag-filter till "vår" */}
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

      {/* Sorteringsdropdown */}
      <select onChange={(e) => setSort(e.target.value)}>
        <option value="">Sortera</option>
        <option value="price-asc">Pris låg → hög</option>
        <option value="price-desc">Pris hög → låg</option>
        <option value="name-asc">Namn A → Ö</option>
        <option value="name-desc">Namn Ö → A</option>
      </select>

      {/* Visar aktiv tag + möjlighet att ta bort */}
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

      {/* Produkt-grid */}
      <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-4">
        {sortedProducts.map((product) => (
          <div key={product.id} className="border p-2">

            {/* Länk till produktsida */}
            <Link to={`/product/${product.id}`}>
              <img
                src={
                  product.imageUrl && product.imageUrl.trim() !== ""
                    ? product.imageUrl
                    : "/placeholder640x640.png" // fallback bild
                }
                alt={product.name}
              />
              <h3>{product.name}</h3>
              <p>{product.price} kr</p>
            </Link>

            {/* Lägg till i kundvagn */}
            <button
              className="border mt-2 p-1 cursor-pointer"
              onClick={() => addToCart(product)}
            >
              Lägg till i kundvagn
            </button>

            {/* Feedback när produkt lagts till */}
            {added && (
              <span>
                Tillagd i Kundvagnen
              </span>
            )}
          </div>
        ))}
      </div>

      {/* Meddelande om inga produkter matchar filtreringen */}
      {filteredProducts.length === 0 && (
        <p className="mt-4">Inga produkter matchar</p>
      )}
    </div>
  )
}