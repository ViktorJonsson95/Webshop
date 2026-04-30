import { useEffect, useState } from "react"
import { useProducts } from "../hooks/useProducts"
import { useCreateProduct } from "../hooks/useCreateProduct"
import { useDeleteProduct } from "../hooks/useDeleteProduct"
import { useDeleteOrder } from "../hooks/useDeleteOrder"
import { useOrders } from "../hooks/useOrders"
import { useCategories } from "../hooks/useCategories"
import placeholder from "../assets/placeholder640x640.png"
import { useUpdateProduct } from "../hooks/useUpdateProduct"



export default function AdminPage() {
    const { data: products, isLoading, error } = useProducts()
    const [editingProduct, setEditingProduct] = useState(null)
    const createMutation = useCreateProduct()
    const deleteMutation = useDeleteProduct()
    const deleteOrderMutation = useDeleteOrder()
    const { categories } = useCategories()
    const updateMutation = useUpdateProduct()


    const {
        data: orders,
        isLoading: ordersLoading,
        error: ordersError,
    } = useOrders()

    const [form, setForm] = useState({
        name: "",
        price: "",
        imageUrl: "",
        description: "",
        category: "",
        tags: ""
    })

    const [message, setMessage] = useState("")

    if (isLoading) return <p>Laddar...</p>
    if (error) return <p>Fel: {error.message}</p>

    const handleSubmit = async (e) => {
        e.preventDefault()
        setMessage("")

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
            const payload = {
                ...form,
                price: Number(form.price),
                tags: form.tags
                    .split(",")
                    .map((t) => t.trim())
                    .filter(Boolean),
            }

            if (editingProduct) {
                await updateMutation.mutateAsync({
                    id: editingProduct.id,
                    data: payload,
                })
                setMessage("Produkt uppdaterad")
            } else {
                await createMutation.mutateAsync(payload)
                setMessage("Produkt skapad")
            }

            setForm({
                name: "",
                price: "",
                imageUrl: "",
                description: "",
                category: "",
                tags: "",
            })

            setEditingProduct(null)
        } catch (err) {
            setMessage(err.message)
        }
    }

    const handleDelete = async (id) => {
        setMessage("")

        try {
            await deleteMutation.mutateAsync(id)
            setMessage("Produkt borttagen")
        } catch (err) {
            setMessage(err.message)
        }
    }

    const handleDeleteOrder = async (id) => {
        try {
            await deleteOrderMutation.mutateAsync(id)
            setMessage("Ordern borttagen")
        } catch (err) {
            setMessage(err.message)
        }
    }


    return (
        <div className="p-4">
            <h1>Admin</h1>

            {message && <p>{message}</p>}

            <form onSubmit={handleSubmit} className="flex flex-col gap-2 mb-6">
                <input
                    placeholder="Namn"
                    value={form.name}
                    onChange={(e) =>
                        setForm({ ...form, name: e.target.value })
                    }
                />
                <input
                    type="number"
                    placeholder="Pris"
                    value={form.price}
                    onChange={(e) =>
                        setForm({ ...form, price: e.target.value })
                    }
                />
                <input
                    placeholder="Bild URL"
                    value={form.imageUrl}
                    onChange={(e) =>
                        setForm({ ...form, imageUrl: e.target.value })
                    }
                />
                <textarea
                    placeholder="Beskrivning"
                    value={form.description}
                    onChange={(e) =>
                        setForm({ ...form, description: e.target.value })
                    }
                />
                <select
                    value={form.category}
                    onChange={(e) =>
                        setForm({ ...form, category: e.target.value })
                    }
                >
                    <option value="">Välj kategori</option>
                    {categories.map((cat) => (
                        <option key={cat} value={cat}>
                            {cat}
                        </option>
                    ))}
                </select>
                <input
                    placeholder="Ny kategori"
                    value={form.category}
                    onChange={(e) => {
                        setForm({ ...form, category: e.target.value })
                    }}
                />
                <input
                    placeholder="Taggar (comma separated)"
                    value={form.tags}
                    onChange={(e) =>
                        setForm({ ...form, tags: e.target.value })
                    }
                />

                <button className="border p-2" type="submit">
                    {editingProduct ? "Uppdatera produkt" : "Lägg till produkt"}
                </button>
            </form>

            <div className="flex flex-col gap-2">
                {products.map((p) => (
                    <div key={p.id} className=" flex justify-between border p-2">
                        <img className="size w-40 h-40"
                            src={p.imageUrl && p.imageUrl.trim() !== "" ? p.imageUrl : placeholder}
                            alt={p.name}
                            onError={(e) => {
                                e.currentTarget.src = placeholder
                            }}
                        />
                        <p>{p.name} – {p.price} kr</p>
                        <p>{p.description}</p>
                        <p className="color text-blue-800">{p.category}</p>
                        <button className="border p-2" onClick={() => handleDelete(p.id)}>
                            Ta bort
                        </button>
                        <button onClick={() => {
                            setEditingProduct(p)
                            setForm({
                                ...p,
                                tags: p.tags?.join(", ") || ""
                            })
                        }}>
                            Redigera
                        </button>
                    </div>
                ))}
            </div>

            <h2 className="mt-8">Ordrar</h2>

            {ordersLoading && <p>Laddar ordrar...</p>}
            {ordersError && <p>{ordersError}</p>}

            <div className="flex flex-col gap-2">
                {orders?.map((order) => (
                    <div key={order.id} className="border p-2">
                        <p><strong>Order ID:</strong> {order.id}</p>

                        {order.products?.map((p, i) => (
                            <p key={i}>
                                {p.name} – {p.price} kr - {p.quantity} st
                            </p>

                        ))}
                        <button
                            className="border p-2 mt-2"
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