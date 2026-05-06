import { useEffect, useState } from "react"
import { useProducts } from "../hooks/useProducts"
import { useCreateProduct } from "../hooks/useCreateProduct"
import { useDeleteProduct } from "../hooks/useDeleteProduct"
import { useDeleteOrder } from "../hooks/useDeleteOrder"
import { useOrders } from "../hooks/useOrders"
import { useCategories } from "../hooks/useCategories"
import placeholder from "../assets/placeholder640x640.png"
import { useUpdateProduct } from "../hooks/useUpdateProduct"

// Admin-sida för att hantera produkter och ordrar
export default function AdminPage() {
    // Hämtar produkter
    const { data: products, isLoading, error } = useProducts()

    // State för att veta om vi redigerar en produkt
    const [editingProduct, setEditingProduct] = useState(null)

    // Mutation hooks för CRUD-operationer
    const createMutation = useCreateProduct()
    const deleteMutation = useDeleteProduct()
    const deleteOrderMutation = useDeleteOrder()
    const updateMutation = useUpdateProduct()

    // Hämtar kategorier (baserat på produkter)
    const { categories } = useCategories()

    // Hämtar ordrar med destructuring och alias
    const {
        data: orders,
        isLoading: ordersLoading,
        error: ordersError,
    } = useOrders()

    // Form state för produkt
    const [form, setForm] = useState({
        name: "",
        price: "",
        imageUrl: "",
        description: "",
        category: "",
        tags: ""
    })

    // Meddelande till användaren (success/error)
    const [message, setMessage] = useState("")

    // Loading / error för produkter
    if (isLoading) return <p>Laddar...</p>
    if (error) return <p>Fel: {error.message}</p>

    // Hanterar submit (create + update)
    const handleSubmit = async (e) => {
        e.preventDefault()
        setMessage("")

        // Enkel validering
        if (
            !form.name.trim() ||
            !form.price ||
            !form.imageUrl.trim() ||
            !form.description.trim() ||
            !form.category.trim()
        ) {
            setMessage("Alla fält måste fyllas i")
            return
        }

        try {
            // Bygger payload
            const payload = {
                ...form,
                price: Number(form.price), // konverterar till number
                tags: form.tags
                    .split(",")        // dela på komma
                    .map((t) => t.trim()) // trimma whitespace
                    .filter(Boolean), // ta bort tomma värden
            }

            if (editingProduct) {
                // Uppdatera produkt
                await updateMutation.mutateAsync({
                    id: editingProduct.id,
                    data: payload,
                })
                setMessage("Produkt uppdaterad")
            } else {
                // Skapa ny produkt
                await createMutation.mutateAsync(payload)
                setMessage("Produkt skapad")
            }

            // Reset form
            setForm({
                name: "",
                price: "",
                imageUrl: "",
                description: "",
                category: "",
                tags: "",
            })

            // Avsluta edit mode
            setEditingProduct(null)
        } catch (err) {
            // Visa error från backend
            setMessage(err.message)
        }
    }

    // Ta bort produkt
    const handleDelete = async (id) => {
        setMessage("")

        try {
            await deleteMutation.mutateAsync(id)
            setMessage("Produkt borttagen")
        } catch (err) {
            setMessage(err.message)
        }
    }

    // Ta bort order
    const handleDeleteOrder = async (id) => {
        try {
            await deleteOrderMutation.mutateAsync(id)
            setMessage("Ordern borttagen")
        } catch (err) {
            setMessage(err.message)
        }
    }

    return (
        <div className="max-w-5xl mx-auto px-4 py-6 text-slate-800">

            <h1 className="text-2xl font-bold mb-4">Admin</h1>

            {message && (
                <p className="mb-4 p-3 rounded bg-green-100 text-green-800 text-sm">
                    {message}
                </p>
            )}

            {/* FORM */}
            <form
                onSubmit={handleSubmit}
                className="bg-white rounded-xl shadow-md p-4 flex flex-col gap-3 mb-8"
            >
                <input
                    className="border rounded p-2"
                    placeholder="Namn"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                />

                <input
                    className="border rounded p-2"
                    type="number"
                    placeholder="Pris"
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: e.target.value })}
                />

                <input
                    className="border rounded p-2"
                    placeholder="Bild URL"
                    value={form.imageUrl}
                    onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
                />

                <textarea
                    className="border rounded p-2"
                    placeholder="Beskrivning"
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                />

                <select
                    className="border rounded p-2"
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                >
                    <option value="">Välj kategori</option>
                    {categories.map((cat) => (
                        <option key={cat} value={cat}>
                            {cat}
                        </option>
                    ))}
                </select>

                <input
                    className="border rounded p-2"
                    placeholder="Ny kategori"
                    value={form.category}
                    onChange={(e) =>
                        setForm({ ...form, category: e.target.value })
                    }
                />

                <input
                    className="border rounded p-2"
                    placeholder="Taggar (comma separated)"
                    value={form.tags}
                    onChange={(e) =>
                        setForm({ ...form, tags: e.target.value })
                    }
                />

                <button className="bg-green-600 text-white py-2 rounded font-semibold hover:bg-green-700 transition">
                    {editingProduct ? "Uppdatera produkt" : "Lägg till produkt"}
                </button>
            </form>

            {/* PRODUKTER */}
            <div className="grid gap-4 sm:grid-cols-2">
                {products.map((p) => (
                    <div
                        key={p.id}
                        className="bg-white rounded-xl shadow-sm border p-4 flex flex-col gap-3"
                    >
                        <img
                            className="w-full h-40 object-contain bg-slate-50 rounded"
                            src={p.imageUrl && p.imageUrl.trim() !== "" ? p.imageUrl : placeholder}
                            alt={p.name}
                            onError={(e) => {
                                e.currentTarget.src = placeholder
                            }}
                        />

                        <div>
                            <p className="font-semibold">{p.name}</p>
                            <p className="text-sm text-slate-600">{p.price} kr</p>
                            <p className="text-sm text-slate-500 line-clamp-2">
                                {p.description}
                            </p>
                            <p className="text-xs text-blue-600 mt-1">{p.category}</p>
                        </div>

                        <div className="flex gap-2 mt-auto">
                            <button
                                className="flex-1 bg-red-500 text-white py-1 rounded hover:bg-red-600 transition"
                                onClick={() => handleDelete(p.id)}
                            >
                                Ta bort
                            </button>

                            <button
                                className="flex-1 border py-1 rounded hover:bg-slate-100 transition"
                                onClick={() => {
                                    setEditingProduct(p)
                                    setForm({
                                        ...p,
                                        tags: p.tags?.join(", ") || ""
                                    })
                                }}
                            >
                                Redigera
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* ORDERS */}
            <h2 className="text-xl font-bold mt-10 mb-4">Ordrar</h2>

            {ordersLoading && <p>Laddar ordrar...</p>}
            {ordersError && <p>{ordersError}</p>}

            <div className="flex flex-col gap-4">
                {orders?.map((order) => (
                    <div
                        key={order.id}
                        className="bg-white rounded-xl shadow-sm border p-4"
                    >
                        <p className="font-semibold mb-2">
                            Order ID: {order.id}
                        </p>

                        <div className="text-sm text-slate-600">
                            {order.products?.map((p, i) => (
                                <p key={i}>
                                    {p.name} – {p.price} kr ({p.quantity} st)
                                </p>
                            ))}
                        </div>

                        <button
                            className="mt-3 bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
                            onClick={() => handleDeleteOrder(order.id)}
                        >
                            Ta bort order
                        </button>
                    </div>
                ))}
            </div>
        </div>
    )
}